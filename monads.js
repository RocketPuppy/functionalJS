/*
 * A monadic function is one which can be used with the bind (pass) function.
 * We can define lifting functions to lift non-monadic functions "into" a monad
 * so they can be used with it. These can extend to any arity (here we go up to
 * binary functions), or we can use the `ap` function to apply a non-monadic
 * function partially to its arguments, like so:
 *   plus(x, y, z)
 *   new Just(plus).ap(new Just(1)).ap(new Just(2)).ap(new Just(3)) = Just 6
 * Of course this obeys all of the monad rules as well, so a Nothing in the
 * list of arguments will short-circuit.
 */
function Monad(){};
Monad.prototype = new Functor();
Monad.prototype.liftM = function(f){
    self = this;
    return self.pass(function(x){
        return self.ret(f(x));
    });
};

Monad.prototype.liftM2 = function(f, m2){
    self = this;
    return self.pass(function(x){
        return m2.pass(function(y){
            return self.ret(f(x, y))
        });
    });
};

Monad.prototype.ap = function(m){
    self = this;
    return self.pass(function(f){
        return m.pass(function(x){
            return self.ret(curry(f)(x))
        });
    });
};

/*
 * This is like bind (pass) except it doesn't use the argument in the function
 * given to bind. It's purpose is to (seq)uence two monadic actions together.
 */
Monad.prototype.seq = function(m){
    self = this;
    return self.pass(function(){
        return m;
    });
}

/*
 * The join operation is used to remove a level of monadic structure. E.g.
 * `Just( Just(1) ).join()` would return `Just(1)`
 */
Monad.prototype.join = function(){
    return this.pass(id);
};

/*
 * MonadPlus offers two new operations "mzero" and "mplus" to use on monads.
 * `mzero` must follow the following identity laws:
 * mzero.bind(f) == mzero
 * m.seq(mzero) == mzero
 *
 * `mplus` must be associative
 */
function MonadPlus(){}
MonadPlus.prototype = new Monad();
