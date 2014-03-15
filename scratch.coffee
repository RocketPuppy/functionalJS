curry = (fn, args) ->
  oldargs = args || [];
  (x)-> 
    args = oldargs.concat(x);
    if args.length is fn.length || fn.length is 0
      fn.apply(fn, args)
    else
      curry(fn, args)

Function.prototype.$ = (args...) ->
  args.reduce((acc, v) ->
    acc(v)
  , curry(this))

plus = (x, y) -> x + y

class Maybe
  @pure: (x) -> new Just(x)

class Just extends Maybe
  constructor: (@val) ->

alert Maybe.pure.$(1)
