# Each instance of the Monad class must also implement Applicative. Members of
# of the Monad class must implement either `join` or `pass`, but they **may**
# implement both if desired. They may also implement `seq` if desired.
class @Monad extends Applicative
    constructor: (join, pass, pure, $$, fmap) ->
        if join?
            @join = () =>
                join(this)
        if pass?
            @pass = (f) =>
                pass(this, f)
        super(pure, $$, fmap)

    join: () ->
        @pass(id)

    pass: (f) ->
        @fmap(f).join()

    seq: (m) ->
        @pass(-> m)

    @join: (x) ->
        x.join()

    @pass: (x, f) ->
        x.pass(f)

    @seq: (m1, m2) ->
        m1.seq(m2)
