class Thing
    constructor: (@can_be_null) ->
    @can_be_null: (thing) ->
        thing.can_be_null

@things = [
    new Thing(Maybe.pure(2)),
    new Thing(Maybe.pure(4)),
    new Thing(Maybe.Nothing),
    new Thing(Maybe.pure(5)),
    new Thing(Maybe.Nothing)
]

@summed = Monoid.mconcat.c(things.map(Functor.fmap.$((x) -> new Plus(x)).c(Thing.can_be_null)))

@summed2 = things.reduceRight Monoid.mappend.c(Functor.fmap.$((x) -> new Plus(x)).c(Thing.can_be_null))
