/*
 * The Maybe monad type. All monads must respond to both `pass` and `return`
 * functions. Here return is called `pure` as return is already a keyword. I've
 * defined `pass` and `return` on the Maybe prototype so they can be used by
 * the two subclasses `Just` and `Nothing`.
 */
function Maybe(){}
Maybe.prototype = new MonadPlus();

/*
 * A value of type Maybe can have two possilbe types.
 * It is either Just something...
 */
function Just(val){
    this.val = val;
}
Just.prototype = new Maybe();
Maybe.Just = function(x){
    return new Just(x);
};

/*
 * ...or Nothing!
 */
function Nothing(){}
Nothing.prototype = new Maybe();
Maybe.Nothing = new Nothing();

/*
 * Applicative instance
 */
/*
 * The pure function simply wraps a value in the default context of the
 * monad. In this case, a Just.
 */
Maybe.prototype.pure = function(v){
    return new Just(v);
};

Maybe.prototype.$$ = function(f){
    if(this instanceof Just && f instanceof Just){
        return new Just(this.val.$(f.val));
    }
    else if(this instanceof Nothing || f instanceof Nothing){
        return Maybe.Nothing;
    }
};

/*
 * Monad instance
 */

Maybe.prototype.join = function(){
    if(this instanceof Just && this.val instanceof Maybe){
        return this.val;
    }
    else if(this instanceof Nothing){
        return this;
    }
};
/*
 * The pass function takes a single function as an argument. That function must
 * take a value of the same type as is inside the Just and return a new
 * instance of the Maybe class (either Just or Nothing).
 * If pass is called on a Just, it applies the given function to the value in
 * the just.
 * If pass is called on a Nothing, it short circuits and returns Nothing.
Maybe.prototype.pass = function(f){
    if(this instanceof Just){
        return f.$(this.val);
    }
    else if(this instanceof Nothing){
        return Maybe.Nothing;
    }
};
 */

/*
 * MonadPlus instance
 */
Maybe.prototype.mzero = Maybe.Nothing;
Maybe.prototype.mplus = function(m){
    if(this instanceof Just){
        return this;
    }
    else if(this instanceof Nothing){
        return m;
    }
};

/*
 * Usage Examples
 */
/*
 * A possible use of the Maybe monad.
 * Here we have a safe division operation. Used with pass, it will return
 * Nothing if its argument is 0, short-circuiting the rest of the chain and
 * preventing an exception.
 */
function safeDivM(num, denom){
    if(denom != 0){
        return new Just(num/denom);
    }
    else{
        return Maybe.Nothing
    }
}

//monadic math functions
plusM = function(x, y){
    return new Just(x + y);
};
minusM = function(x, y){
    return new Just(x - y);
};
multM = function(x, y){
    return new Just(x * y);
};

//non-monadic math functions
plus = function(x, y){
    return (x + y);
};
minus = function(x, y){
    return (x - y);
};
mult = function(x, y){
    return (x * y);
};

usage1 = function(x){
    return (new Just(x)).pass(plusM.$(20)).pass(multM.$(4)).pass(safeDivM.$(5)).pass(minusM.$(4));
};
usage2 = function(x){
    return (new Just(x)).fmap(plus.$(20)).fmap(mult.$(4)).pass(safeDivM.$(5)).fmap(minus.$(4))
}

/*
 * Functor laws proof
 *
 * First: identity - fmap(id) = id
 * Case 1: Nothing
 * 1. Nothing.fmap(id) == Nothing
 * 2. Nothing == Nothing    //fmap simplifies to Nothing
 * Case 2: Just(x)
 * 1. Just(x).fmap(id) == Just(x)
 * 2. Just(id(x)) == Just(x)    //fmap simplifies
 * 3. Just(x) == Just(x)        //id simplifies
 *
 * Second: Distributive - m.fmap(f.c(g)) == m.(fmap(g)).fmap(f)
 * Case 1: Nothing
 * 1. Nothing.fmap(f.c(g)) == Nothing.fmap(g).fmap(f)
 * 2. Nothing == Nothing.fmap(f)    //fmap simplifies
 * 3. Nothing == Nothing            //fmap simplifies
 * Case 2: Just(x)
 * 1. Just(x).fmap(f.c(g)) == Just(x).fmap(g).fmap(f)
 * 2. Just(f.c(g)(x)) == Just(g(x)).fmap(f)
 * 3. Just(f(g(x))) == Just(f(g(x)))
 *
 * Applicative laws proof
 *
 * First: Identity - (F.pure(id)).$$(v) == v
 * Case 1: v = Nothing
 * 1. Maybe.pure(id).$$(Nothing) == Nothing
 * 2. Just(id).$$(Nothing) == Nothing   //simplify pure
 * 3. Nothing == Nothing        //simplify $$
 * Case 2: v = Just(x)
 * 1. Maybe.pure(id).$$(Just(x)) == Just(x)
 * 2. Just(id).$$(Just(x)) == Just(x)   //simplify pure
 * 3. Just(id(x)) == Just(x)        //simplify $$
 * 4. Just(x) == Just(x)            //simplify id
 *
 * Second: Homomorphism - (F.pure(g)).$$(F.pure(x)) == F.pure(g(x))
 * 1. Maybe.pure(f).$$(Maybe.pure(x)) == Maybe.pure(f(x))
 * 2. Just(f).$$(Just(x)) == Just(f(x)) //simplify pures
 * 3. Just(f(x)) == Just(f(x))          //simplify $$
 *
 * Third: Interchange - f.$$(F.pure(x)) == F.pure(Function.$(x)).$$(f)
 * Case 1: f = Nothing
 * 1. Nothing.$$(F.pure(x)) == F.pure(Function.$(x)).$$(Nothing)
 * 2. Nothing.$$(Just(x)) == Just(Function.$(x)).$$(Nothing)    //simplify pures
 * 3. Nothing == Nothing    //simplify $$s
 * Case 2: f = Just(f)
 * 1. Just(f).$$(F.pure(x)) == F.pure(Function.$(x)).$$(Just(f))
 * 2. Just(f).$$(Just(x)) == Just(Function.$(x)).$$(Just(f))    //simplify pures
 * 3. Just(f.$(x)) == Just(Function.$(x).$(f))                  //simplify $$s
 * 4. Just(f.$(x)) == Just(f.$(x))                              //simplify Function.$
 *
 * Fourth: Composition - u.$$(v.$$(w)) == F.pure(Function.c).$$(u).$$(v).$$(w)
 * 1. u.$$(v.$$(w)) == F.pure(Function.c).$$(u).$$(v).$$(w)
 * 2. u.$$(v.$$(w)) == Just(Function.c).$$(u).$$(v).$$(w)   //simplify pure
 * Assume u = Just(x), v = Just(y), w = Just(z)
 * 3.a. Just(x).$$(Just(y).$$(Just(z))) == Just(Function.c).$$(Just(x)).$$(Just(y)).$$(Just(z))   //substitute
 * 3.b. Just(x.$(y)).$$(Just(z)) == Just(Function.c.$(x)).$$(Just(y)).$$(Just(z))                 //simplify $$
 * 3.c. Just(x.$(y).$(z)) == Just(Function.c.$(x).$(y)).$$(Just(z))                               //simplify $$
 * 3.d. Just(x.$(y).$(z)) == Just(Function.c.$(x).$(y).$(z))                                      //simplify $$
 * 3.e. Just(x.$(y).$(z)) == Just(x.$(y).$(z))                                                    //simplify Function.c
 *
 * Monad Laws Proof
 *
 * First: Left-identity - (return x).pass(f) === f x
 * 1. (Maybe.pure(x)).pass(f) === f x
 * 2. (Just(x)).pass(f) === f x         //Maybe.pure(x) simplifies to Just(x)
 * 3. f x === f x                       //Just(x).pass(f) simplifies to f x
 * 
 * Second: Right-identity - m.pass(return) === m
 * Case 1: Nothing
 * 1. Nothing.pass(Maybe.pure) === Nothing
 * 2. Nothing === Nothing               //Nothing.pass(Maybe.pure) simplifies to Nothing
 * Case 2: Just(x)
 * 1. (new Just(x)).pass(Maybe.pure) === Just(x)
 * 2. Maybe.pure(x) === Just(x)          //pass applies Maybe.pure to the inner value
 * 3. Just(x) === Just(x)               //Maybe.pure returns a new Just with the given value
 *
 * Third: Associativity - (m.pass(f)).pass(g) === m.pass( function(x){ f(x).pass(g) } )
 * Case 1: Nothing
 * 1. (Nothing.pass(f)).pass(g) === Nothing.pass( function(x){ f(x).pass(g) } )
 * 2. Nothing.pass(g) === Nothing   //the first passs simplify to Nothing
 * 3. Nothing === Nothing           //the last pass simplifies to Nothing
 * Case 2: Just(y)
 * 1. (Just(y).pass(f)).pass(g) === (Just(y)).pass( function(x){ f(x).pass(g) } )
 * 2. (f(y)).pass(g) === (function(y){ f(y).pass(g) })(y)   //the first passs simplify
 * 3. f(y).pass(g) === f(y).pass(g)                 //reduce function and parens
 */
