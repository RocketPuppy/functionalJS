# Currying is the process of taking a function that takes multiple arguments
# and turning it into a function that takes a single argument and returns
# another function. For example:
# plus(x, y, z) takes three arguments
# curry(plus) becomes a function I can call three times with a single argument.
# 
# The big advantage to currying is that we can partially apply functions.
Function.curry = (fn, args) ->
    oldargs = args || []
    (x)->
      args = oldargs.concat(x)
      if args.length is fn.length || fn.length is 0
          fn.apply(fn, args)
      else
          Function.curry(fn, args)

# Seamless partial function application
Function.prototype.$ = (args...) ->
    args.reduce(
        (acc, v) -> acc(v)
    , Function.curry(this))

# Function application operator
Function.$ = (args...) ->
    (f) -> args.reduce(
        (acc, v) -> acc(v)
    , f.$())

# Flip the arguments of a binary function
Function.prototype.flip = -> (x, y) -> this(y, x)

# Function composition
Function.c = (f, g) -> (x) -> f(g(x))

Function.prototype.c = (g) -> Function.c(this, g)

# The id function
@id = (x) -> x
