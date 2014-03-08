/*
 * Currying is the process of taking a function that takes multiple arguments
 * and turning it into a function that takes a single argument and returns
 * another function. For example:
 * plus(x, y, z) takes three arguments
 * curry(plus) becomes a function I can call three times with a single argument.
 * 
 * The big advantage to currying is that we can partially apply functions.
 */
function curry(fn, args){
    args = args || [];
    return function(x){
        args = args.concat([x]);
        if(args.length === fn.length){
            return fn.apply(null, args);
        }
        else{
            return curry(fn, args);
        }
    }
}

/*
 * Seamless partial function application.
 */
Function.prototype.$ = function(){
    var f = curry(this);
    var args = Array.prototype.slice.call(arguments);
    return args.reduce(function(acc, v){
        return acc(v);
    }, f);
}

/*
 * Function composition
 */
Function.prototype.c = function(g){
    var f = this;
    return function(x){
        return f.$(g.$(x));
    };
};

/*
 * The id function, it returns whatever is passed into it.
 */
function id(x){
    return x;
}
