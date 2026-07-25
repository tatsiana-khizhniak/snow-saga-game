var PhysicsEvents = {

    registered: false,

    register: function() {
        if (this.registered) return;
        this.registered = true;

        ph_Events.on(ph_Engine, 'collisionStart', function(event) {
            var pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                var speed = relImpactSpeed(pair.bodyA, pair.bodyB);

                if (pair.bodyA && pair.bodyA.__onCollision)
                    pair.bodyA.__onCollision(speed);

                if (pair.bodyB && pair.bodyB.__onCollision)
                    pair.bodyB.__onCollision(speed);
            }
        });
    }
};
