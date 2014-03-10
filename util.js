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
    var oldargs = args || [];
    return function(){
        //only get the first arg, if any
        var args = oldargs.concat(Array.prototype.slice.call(arguments, 0, 1));
        if(args.length === fn.length || fn.length === 0){
            return fn.apply(null, args);
        }
        else{
            return curry(fn, args);
        }
    }
}

function curry(fn){
    if(fn.length === 1){
        return function(x){
            return fn(x);
        }
    }
    if(fn.length === 2){
        return function(x){
            return curry(fn, x);
        };
        return function(x){
            return function(y){
                return fn(x, y);
            }
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
    }, f());
};

/*
 * Function application operator
 */
Function.$ = function(){
    var args = Array.prototype.slice.call(arguments);
    return function(f){
        return args.reduce(function(acc, v){
            return acc.$(v);
        }, f.$());
    };
};

/*
 * Flip the arguments of a binary function
 */
Function.prototype.flip = function(){
    var f = this;
    return function(x, y){
        return f.$(y, x);
    };
};

/*
 * Function composition
 */
Function.c = function(f, g){
    return function(x){
        return f.$(g.$(x))
    }
};

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
