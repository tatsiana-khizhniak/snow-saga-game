var BlockEffects = {

    destroyBlock: function(block) {
      if (!block || !block.__ph_body) return; 
        var size = block.__size;
        var v = block.__ph_body.velocity;

        block.__removeFromParent();

        if (block.__needBreaks) {
            SoundManager.playRandomBreak();

            var step = 50;
            var bx = block.__x - size.x / 2;
            var by = block.__y - size.y / 2;

            for (var x = 0; x < size.x; x += step) {
                for (var y = 0; y < size.y; y += step) {
                    this.spawnPiece(bx + x, by + y, v);
                }
            }
        }
    },

    spawnPiece: function(x, y, velocity) {
        var piece = Game.level.node.__addChildBox({
            __img: 'break_' + randomInt(1, 9),
            __ofs: [x, y, -20],
            __rotate: randomInt(0, 360),
            __physics: {
                __isStatic: false,
                __friction: 10,
                __frictionAir: 1,
                __frictionStatic: 50,
                __restitution: 0,
                __density: 1,
                __bodyType: 1
            }
        });

        looperPost(function() {
            if (piece.__ph_body) {
                ph_Body.setVelocity(
                    piece.__ph_body,
                    new Vector2(
                        velocity.x + randomFloat(-10, 10),
                        velocity.y + randomFloat(-8, 3)
                    )
                );
            }
        });
    }
};
