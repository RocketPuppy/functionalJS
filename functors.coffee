# A Functor definition library
#
# Functors allow one to map normal functions over a value contained in the
# Functor.
#
# Classes that wish to be Functors **must** implement fmap acording to the
# functor laws

class @Functor
    constructor: (fmap) ->
        @fmap = (f) =>
            fmap(f, this)

    @fmap: (f, x) ->
        x.fmap(f)

# Applicative Functors allow one to map functions contained in a Functor
# over values contained in a Functor.
#
# Classes that implement Applicative **must** implement `$$` (pronounced "apply")
# and `pure` according to the Applicative laws. Classes **may** also implement
# `fmap` to override the default with a more efficient version.
class @Applicative extends Functor
    constructor: (pure, $$, fmap) ->
        @$$ = (v) =>
            $$(this, v)
        @pure = pure
        if !fmap?
            fmap = (f, x) =>
                @pure(f).$$(x)
        super(fmap)
