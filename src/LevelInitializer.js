var LevelInitializer = {
    init: function(level) {
        level.node.__setAliasesData({
            rubber: function(node) {
                Game.rubber = node;
            },
            userInputArea: RubberController.create(),
            scoreLabel: null,
            hitsLabel: null,
            missLabel: null
        });

        _setTimeout(function() {
            level.node.update(1);

            ph_Events.on(ph_Engine, 'collisionStart', function(event) {
                var pairs = event.pairs;

                for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i];
                    
                    // КРИТИЧЕСКАЯ ПРОВЕРКА: существуют ли еще тела в памяти
                    if (!pair.bodyA || !pair.bodyB) continue;

                    var speed = PhysicsCore.relImpactSpeed(pair.bodyA, pair.bodyB);

                    // Вызываем столкновение, только если тела живы и имеют обработчик
                    if (pair.bodyA && pair.bodyA.__onCollision) {
                        pair.bodyA.__onCollision(speed, pair.bodyB);
                    }

                    // Важно: проверяем bodyB снова, так как bodyA мог удалиться выше
                    if (pair.bodyB && pair.bodyB.__ph_body && pair.bodyB.__onCollision) {
                        pair.bodyB.__onCollision(speed, pair.bodyA);
                    }
                }
            });

            level.traverse(function(node) {
                var body = node.__ph_body;
                if (body && !body.isStatic) {
                    node.__needBreaks = 1;
                    PhysicsCore.big_blocks++; // Используем свойство объекта
                    PhysicsCore.initCollision(body, node, 100);
                }
            });

            ScoreManager.updateLevelTexts();
        }, 0.01);
    }
};