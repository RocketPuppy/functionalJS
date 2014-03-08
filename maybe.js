/*
 * The Maybe monad type. All monads must respond to both `pass` and `return`
 * functions. Here return is called `ret` as return is already a keyword. I've
 * defined `pass` and `return` on the Maybe prototype so they can be used by
 * the two subclasses `Just` and `Nothing`.
 */
function Maybe(){}
Maybe.prototype = new MonadPlus();
/*
 * The pass function takes a single function as an argument. That function must
 * take a value of the same type as is inside the Just and return a new
 * instance of the Maybe class (either Just or Nothing).
 * If pass is called on a Just, it applies the given function to the value in
 * the just.
 * If pass is called on a Nothing, it short circuits and returns Nothing.
 */
Maybe.prototype.pass = function(f){
    if(this instanceof Just){
        return f(this.val);
    }
    else if(this instanceof Nothing){
        return Maybe.Nothing;
    }
};
/*
 * The ret(urn) function simply wraps a value in the default context of the
 * monad. In this case, a Just.
 */
Maybe.prototype.ret = function(val){
    return new Just(val);
};

/*
 * The MonadPlus instance for Maybe is here.
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
 * For something to be a monad it must have more than just the pass and return
 * functions. Those functions also need to abide by the monad laws. Here I'll
 * prove that these do just that.
 *
 * First: Left-identity - (return x).pass(f) === f x
 * 1. (Maybe.ret(x)).pass(f) === f x
 * 2. (Just(x)).pass(f) === f x         //Maybe.ret(x) simplifies to Just(x)
 * 3. f x === f x                       //Just(x).pass(f) simplifies to f x
 * 
 * Second: Right-identity - m.pass(return) === m
 * Case 1: Nothing
 * 1. Nothing.pass(Maybe.ret) === Nothing
 * 2. Nothing === Nothing               //Nothing.pass(Maybe.ret) simplifies to Nothing
 * Case 2: Just(x)
 * 1. (new Just(x)).pass(Maybe.ret) === Just(x)
 * 2. Maybe.ret(x) === Just(x)          //pass applies Maybe.ret to the inner value
 * 3. Just(x) === Just(x)               //Maybe.ret returns a new Just with the given value
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

/*
 * Implementation of fmap
 */
//TODO reimplement this when I get to applicatives
Maybe.prototype.fmap = function(f){
    if(this instanceof Just){
        return new Just(f(this.val));
    }
    else if(this instanceof Nothing){
        return Maybe.Nothing;
    }
};

/*
 * The functor laws
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
 */
/*
 * The Just subclass of Maybe. It contains a single value.
 */
function Just(val){
    this.val = val;
}
Just.prototype = new Maybe();

/*
 * The Nothing subclass of Maybe. It signifies Nothing.
 */
function Nothing(){}
Nothing.prototype = new Maybe();
Maybe.Nothing = new Nothing();

/*
 * Usage Examples
 */
/*
 * A possible use of the Maybe monad.
 * Here we have a safe division operation. Used with pass, it will return
 * Nothing if its argument is 0, short-circuiting the rest of the chain and
 * preventing an exception.
 */
function safeDiv(num){
    return function(denom){
        if(denom != 0){
            return new Just(num/denom);
        }
        else{
            return Maybe.Nothing
        }
    }
}

onlyEven = function(x){
    if(x % 2 === 0){
        return new Just(x);
    }
    else{
        return Maybe.Nothing;
    }
};
onlyOdd = function(x){
    if(x % 2 === 0){
        return Maybe.Nothing;
    }
    else{
        return new Just(x);
    }
};

plus = function(x){
    return function(y){
        return y + x;
    }
};
minus = function(x){
    return function(y){
        return y - x;
    }
};
mult = function(x){
    return function(y){
        return y * x;
    }
};
usage1 = function(x){return (new Just(x)).pass(function(x){ return new Just(x + 20)}).pass(function(x) {return new Just(x * 4)}).pass(safeDiv(62345)).pass(function(x){ return new Just(x - 4)})}
usage2 = function(x){
    return (new Just(x)).liftM(plus(20)).liftM(mult(4)).pass(safeDiv(62345)).liftM(minus(4))
}
