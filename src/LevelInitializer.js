var LevelInitializer = {
    init: function(level) {

        level.node.__setAliasesData({
            rubber: function(node) {
                Game.rubber = node;
            },

            userInputArea: RubberController.create()
        });

        _setTimeout(function() {

            level.node.update(1);

            ph_Events.on(ph_Engine, 'collisionStart', function(event) {
                var pairs = event.pairs;

                for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i];
                    var speed = PhysicsCore.relImpactSpeed(pair.bodyA, pair.bodyB);

                    if (pair.bodyA && pair.bodyA.__onCollision)
                        pair.bodyA.__onCollision(speed);

                    if (pair.bodyB && pair.bodyB.__onCollision)
                        pair.bodyB.__onCollision(speed);
                }
            });

            level.traverse(function(node) {
                var body = node.__ph_body;

                if (body && !body.isStatic) {
                    node.__needBreaks = 1;
                    big_blocks++;
                    PhysicsCore.initCollision(body, node, 100);
                }
            });

        }, 0.01);
    }
};
