# The State monad contains a function that consumes a state and returns a new
# state, along with a value.
#
# To use just call State.runState(stateFunction, initialState)
class _State extends Monad
    $$ = (stateF, stateV) ->
        new _State(
            (initial) ->
                [f, second] = stateF.fn(initial)
                [v, third] = stateV.fn(second)
                [f.$(v), third])

    pure = (x) ->
        new _State((s) -> [x, s])
    @pure = pure

    join = (state1) ->
        new _State(
            (initial) ->
                [state2, second] = state1.fn(initial)
                state2.fn(second))

    constructor: (@fn) ->
        super(join, undefined, pure, $$)

class @State
    @pure: _State.pure
    @runState: (stateMonad, initialState) =>
        stateMonad.fn(initialState)
    @get: () ->
        new _State(
            (initial) ->
                [initial, initial])
    @put: (state) ->
        new _State(
            () ->
                [undefined, state])
