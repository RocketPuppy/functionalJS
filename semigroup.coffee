# A semigroup is a collection of elements over which a specific binary
# operator is defined. An example is the natural numbers and the addition
# operator. Another is arrays and the concatenation operation.
#
# The combination operator must be associative.

class @Semigroup
    constructor: (context, combine) ->
        @combine = (r) ->
            combine(context, r)

    @combine: (l, r) ->
        l.combine(r)

    @sconcat: (list) ->
        if list.length > 0
            list.reduce(Semigroup.combine)
