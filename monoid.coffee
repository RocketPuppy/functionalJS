# A monoid is a semigroup that contains an identity element, such as 0 or [].
#
# Monoid Laws:
# m.combine(m.mempty()) = m
# m.mempty().combine(m) = m
# combine must be associative (like with the semigroup)

class @Monoid extends Semigroup
    constructor: (context, mempty, combine) ->
        @mempty = mempty

        super(context, combine)

    @mempty: (x) ->
        x.mempty()

    @mconcat: (list) ->
        list.reduceRight(Semigroup.combine, list[0].mempty())

class @Plus extends Module
    mempty = () -> new Plus(0)
    combine = (l, r) -> new Plus(l.val + r.val)

    @extend(Monoid)

    @mempty: mempty

    constructor: (@val) ->
        monoid = new Monoid(this, mempty, combine)
        this.include(monoid)
