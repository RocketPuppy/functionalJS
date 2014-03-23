class _List extends Module
    $$ = (f, v) ->
        if f instanceof _List && v instanceof _List
            new _List(f.val.map(
                    (f) -> v.val.map(f)
                ).reduce(
                    ((acc, v) -> acc.concat(v))
                , [])
            )

    pure = (x) ->
        if !(x instanceof Array)
            x = [x]
        new _List(x)
    @pure = pure

    join = (x) ->
        new _List(x.val.reduce(((acc, v) -> acc.concat(v)), []))

    mzero = -> _List.empty
    @mzero = mzero

    mplus = (m1, m2) ->
        if m1 instanceof _List and m2 instanceof _List
            new _List(m1.val.concat(m2.val))
    
    mempty = _List.empty
    combine = (l, r) ->
       _List.pure(l.val.concat(r.val))

    @extend(MonadPlus)
    @extend(Monoid)

    constructor: (@val) ->
        monadp = new MonadPlus(this, mzero, mplus, join, undefined, pure, $$)
        monoid = new Monoid(this, mempty, combine)
        this.include(monadp)
        this.include(monoid)

    @empty: new _List([])

class @List
    @pure: _List.pure
    @mzero: _List.mzero
