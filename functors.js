/*
 * A Functor definition library
 * 
 * Classes that wish to be functors must implement fmap according to the
 * functor laws.
 */

function Functor(){}

/*
 * `fmap` has the type function(f) where f is a function that takes a single
 * argument.
 */

/*
 * Applicatives, applicatives must implement pure and $$ according to the
 * applicative laws.
 * pure has the signature F.pure(v) == F(v)
 * $$ has the signature F.$$(F(v)) == F(x)
 */
 function Applicative(){}
 Applicative.prototype = new Functor();

/*
 * fmap can be defined in terms of the applicative operations.
 */
 Applicative.prototype.fmap = function(f){
     return this.pure(f).$$(this);
 }
 Function.prototype.fmap = function(x){
     if(x instanceof Applicative || x instanceof Functor){
         return x.fmap.$(this);
     }
 };
