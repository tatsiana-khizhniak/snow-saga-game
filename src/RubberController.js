var RubberController = {

    create: function() {
        return {
            __dragDist: 1,

            __drag: function(x, y) {
                var dmouse = this.__worldPosition.__clone().sub(new Vector2(x, y));
                this.__dmouse = dmouse;

                Game.rubber.__parent.__rotate = -dmouse.__angle() * RAD2DEG;
                Game.rubber.__width = dmouse.__length();
            },

            __dragStart: function() {
                Game.rubber.__killAllAnimations();
            },

            __dragEnd: function() {
                SoundManager.play('punch');

                Game.rubber.__anim({ __width: 10 }, 0.4, 0, easeElasticO);

                var wp = this.__worldPosition;
                var velocity = this.__dmouse.__multiplyScalar(0.2);

                var bullet = Game.level.node.__addChildBox({
                    __effect: 'tail',
                    __img: 'circle1',
                    __size: [28, 28],
                    __ofs: [wp.x, wp.y, -20],
                    __physics: {
                        __isStatic: false,
                        __friction: 130,
                        __frictionAir: 0.2,
                        __frictionStatic: 500,
                        __restitution: 10,
                        __density: 4,
                        __bodyType: 1
                    }
                }).update();

                if (bullet.__ph_body) {
                    ph_Body.setVelocity(bullet.__ph_body, velocity);
                }

                _setTimeout(function() {
                    bullet.__removeFromParent();
                }, 2);
            }
        };
    }
};
