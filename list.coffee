class _List extends MonadPlus
    $$ = (f, v) ->
        if f instanceof _List && v instanceof _List
            new _List(f.val.map((f) -> v.val.map(f)).reduce(((acc, v) -> acc.concat(v)), []))

    pure = (x) ->
        new _List(x)
    @pure = pure

    join = (x) ->
        new _List(x.val.reduce(((acc, v) -> acc.concat(v)), []))

    mzero = -> _List.empty
    @mzero = mzero

    mplus = (m1, m2) ->
        if m1 instanceof _List and m2 instanceof _List
            new _List(m1.val.concat(m2.val))

    constructor: (@val) ->
        super(mzero, mplus, join, undefined, pure, $$)

    @empty: new _List([])

class @List
    @pure: _List.pure
    @mzero: _List.mzero
