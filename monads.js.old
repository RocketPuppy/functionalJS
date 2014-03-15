/*
 * The Monad class
 * 
 * Each instance of a Monad must follow one of two sets of laws. Both sets are
 * equivalent, but use different formulations of the laws.
 * Set 1:
 * 1. join . fmap join == join . join
 * 1. M.join.c(M.join.fmap) == M.join.c(M.join)
 */
function Monad(){};
Monad.prototype = new Applicative();

/*
 * Note that you must implement either join or pass in the object
 * you wish to be a monad. If you fail to implement either then calling one
 * will result in an infinite recursion.
 *
 * `join` - called on a monad, removes one level of monadic structure
 * `pass` - called on a monad with a function as an argument, it applies that
 * function to the value contained in the monad. The function given must take
 * as an argument a value of the same type contained in the monad, and return
 * a new instance of the monad.
 */
Monad.prototype.join = function(){
    return this.pass(id);
};
Monad.join = function(x){
    return x.join();
};
Monad.prototype.pass = function(f){
    return this.fmap(f).join();
};
Monad.pass = function(f, x){
    return x.pass(f);
};

/*
 * This is like pass except it doesn't use the argument in the function
 * given to bind. It's purpose is to (seq)uence two monadic actions together.
 */
Monad.prototype.seq = function(m){
    self = this;
    return self.pass(function(){
        return m;
    });
};
