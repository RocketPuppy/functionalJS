# MonadPlus generalizes list concatenation operations to other types. It
# comprises the functions `mzero` and `mplus`. All members of MonadPlus must
# implement Monad as well.

class @MonadPlus extends Monad
    constructor: (context, mzero, mplus, join, pass, pure, $$, fmap) ->
        @mzero = mzero
        @mplus = (m2) ->
            mplus(context, m2)
        super(context, join, pass, pure, $$, fmap)

    @mzero: (m) ->
        m.mzero()

    @mplus: (m1, m2) ->
        m1.mplus(m2)
