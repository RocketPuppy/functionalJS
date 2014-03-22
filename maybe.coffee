# The Maybe type. It represents computations that can fail. Maybe is an
# instance of the MonadPlus class.
#
# You do not work with values of the Maybe class directly. You instead work
# with values that are instances of the Just class, which contains a single
# value, or you work with an instance of the Nothing class, which represents a
# lack of a value. The implementation details of this are hidden in the _Maybe
# class, and you use the methods on the Maybe class (`mzero`, `pure`, and
# `Nothing`) to create and use Just or Nothing values.
#
# N.B: You'll see I'm explicit about checking the types of the arguments passed
# to functions. This is because these functions should always be working with
# values that are of the Maybe type. In cases where they receive arguments that
# don't satisfy that, the behavior should be undefined.

class _Maybe extends MonadPlus
    class Just extends _Maybe
        constructor: (@val) ->
            super()

    class Nothing extends _Maybe
    @Nothing: new Nothing()

    $$ = (f, v) =>
        if f instanceof Just && v instanceof Just
            new Just(f.val.$(v.val))
        else if f instanceof Nothing || v instanceof Nothing
            return Maybe.Nothing

    pure = (x) ->
        new Just(x)
    @pure = pure

    join = (x) ->
        if x instanceof Just && x.val instanceof _Maybe
            x.val
        else if x instanceof Nothing
            return x

    mzero = -> Maybe.Nothing
    @mzero = mzero

    mplus = (m1, m2) ->
        if m1 instanceof Just
            m1
        else if m1 instanceof Nothing
            m2

    isJust: => this instanceof Just
    isNothing: => this instanceof Nothing

    @isJust: (m) -> m.isJust()
    @isNothing: (m) -> m.isNothing()

    constructor: () ->
        super(mzero, mplus, join, undefined, pure, $$)

class @Maybe
    @pure: _Maybe.pure
    @mzero: _Maybe.mzero
    @Nothing: _Maybe.Nothing
    @isJust: _Maybe.isJust
    @isNothing: _Maybe.isNothing

# Functor laws proof
#
# First: identity - fmap(id) = id
# Case 1: Nothing
# 1. Nothing.fmap(id) == Nothing
# 2. Nothing == Nothing    //fmap simplifies to Nothing
# Case 2: Just(x)
# 1. Just(x).fmap(id) == Just(x)
# 2. Just(id(x)) == Just(x)    //fmap simplifies
# 3. Just(x) == Just(x)        //id simplifies
#
# Second: Distributive - m.fmap(f.c(g)) == m.(fmap(g)).fmap(f)
# Case 1: Nothing
# 1. Nothing.fmap(f.c(g)) == Nothing.fmap(g).fmap(f)
# 2. Nothing == Nothing.fmap(f)    //fmap simplifies
# 3. Nothing == Nothing            //fmap simplifies
# Case 2: Just(x)
# 1. Just(x).fmap(f.c(g)) == Just(x).fmap(g).fmap(f)
# 2. Just(f.c(g)(x)) == Just(g(x)).fmap(f)
# 3. Just(f(g(x))) == Just(f(g(x)))
#
# Applicative laws proof
#
# First: Identity - (F.pure(id)).$$(v) == v
# Case 1: v = Nothing
# 1. Maybe.pure(id).$$(Nothing) == Nothing
# 2. Just(id).$$(Nothing) == Nothing   //simplify pure
# 3. Nothing == Nothing        //simplify $$
# Case 2: v = Just(x)
# 1. Maybe.pure(id).$$(Just(x)) == Just(x)
# 2. Just(id).$$(Just(x)) == Just(x)   //simplify pure
# 3. Just(id(x)) == Just(x)        //simplify $$
# 4. Just(x) == Just(x)            //simplify id
#
# Second: Homomorphism - (F.pure(g)).$$(F.pure(x)) == F.pure(g(x))
# 1. Maybe.pure(f).$$(Maybe.pure(x)) == Maybe.pure(f(x))
# 2. Just(f).$$(Just(x)) == Just(f(x)) //simplify pures
# 3. Just(f(x)) == Just(f(x))          //simplify $$
#
# Third: Interchange - f.$$(F.pure(x)) == F.pure(Function.$(x)).$$(f)
# Case 1: f = Nothing
# 1. Nothing.$$(F.pure(x)) == F.pure(Function.$(x)).$$(Nothing)
# 2. Nothing.$$(Just(x)) == Just(Function.$(x)).$$(Nothing)    //simplify pures
# 3. Nothing == Nothing    //simplify $$s
# Case 2: f = Just(f)
# 1. Just(f).$$(F.pure(x)) == F.pure(Function.$(x)).$$(Just(f))
# 2. Just(f).$$(Just(x)) == Just(Function.$(x)).$$(Just(f))    //simplify pures
# 3. Just(f.$(x)) == Just(Function.$(x).$(f))                  //simplify $$s
# 4. Just(f.$(x)) == Just(f.$(x))                              //simplify Function.$
#
# Fourth: Composition - u.$$(v.$$(w)) == F.pure(Function.c).$$(u).$$(v).$$(w)
# 1. u.$$(v.$$(w)) == F.pure(Function.c).$$(u).$$(v).$$(w)
# 2. u.$$(v.$$(w)) == Just(Function.c).$$(u).$$(v).$$(w)   //simplify pure
# Assume u = Just(x), v = Just(y), w = Just(z)
# 3.a. Just(x).$$(Just(y).$$(Just(z))) == Just(Function.c).$$(Just(x)).$$(Just(y)).$$(Just(z))   //substitute
# 3.b. Just(x.$(y)).$$(Just(z)) == Just(Function.c.$(x)).$$(Just(y)).$$(Just(z))                 //simplify $$
# 3.c. Just(x.$(y).$(z)) == Just(Function.c.$(x).$(y)).$$(Just(z))                               //simplify $$
# 3.d. Just(x.$(y).$(z)) == Just(Function.c.$(x).$(y).$(z))                                      //simplify $$
# 3.e. Just(x.$(y).$(z)) == Just(x.$(y).$(z))                                                    //simplify Function.c
#
# Monad Laws Proof
#
# First: Left-identity - (return x).pass(f) === f x
# 1. (Maybe.pure(x)).pass(f) === f x
# 2. (Just(x)).pass(f) === f x         //Maybe.pure(x) simplifies to Just(x)
# 3. f x === f x                       //Just(x).pass(f) simplifies to f x
# 
# Second: Right-identity - m.pass(return) === m
# Case 1: Nothing
# 1. Nothing.pass(Maybe.pure) === Nothing
# 2. Nothing === Nothing               //Nothing.pass(Maybe.pure) simplifies to Nothing
# Case 2: Just(x)
# 1. (new Just(x)).pass(Maybe.pure) === Just(x)
# 2. Maybe.pure(x) === Just(x)          //pass applies Maybe.pure to the inner value
# 3. Just(x) === Just(x)               //Maybe.pure returns a new Just with the given value
#
# Third: Associativity - (m.pass(f)).pass(g) === m.pass( function(x){ f(x).pass(g) } )
# Case 1: Nothing
# 1. (Nothing.pass(f)).pass(g) === Nothing.pass( function(x){ f(x).pass(g) } )
# 2. Nothing.pass(g) === Nothing   //the first passs simplify to Nothing
# 3. Nothing === Nothing           //the last pass simplifies to Nothing
# Case 2: Just(y)
# 1. (Just(y).pass(f)).pass(g) === (Just(y)).pass( function(x){ f(x).pass(g) } )
# 2. (f(y)).pass(g) === (function(y){ f(y).pass(g) })(y)   //the first passs simplify
# 3. f(y).pass(g) === f(y).pass(g)                 //reduce function and parens
#
