var blocks = [];
var big_blocks = 0;

function looperPostOne(f, delay) {
    if (f.__posted > 0) {
        f.__posted = _clearTimeout(f.__posted);
    }

    if (!f.__posted) {
        if (delay) {
            f.__posted = _setTimeout(function() {
                f.__posted = 0;
                f();
            }, delay);
        } else {
            f.__posted = -1;
            looperPost(function() {
                f.__posted = 0;
                f();
            });
        }
    }
}

function relImpactSpeed(bodyA, bodyB) {
    var va = bodyA.velocity;
    var vb = bodyB.velocity;
    var v = new Vector2(va.x - vb.x, va.y - vb.y);
    return v.__length();
}

function awakeBlocks() {
    $each(blocks, function(b) {
        b.__ph_awake();
    });
}

function removeBlock(block) {
    removeFromArray(block, blocks);

    var size = block.__size;
    var v = block.__ph_body.velocity;

    block.__removeFromParent();

    looperPostOne(awakeBlocks);

    ScoreManager.addBlockScore();

    if (block.__needBreaks) {

        SoundManager.playRandomBreak();

        var step = 50;
        var bx = block.__x - size.x / 2;
        var by = block.__y - size.y / 2;

        for (var x = 0; x < size.x; x += step) {
            for (var y = 0; y < size.y; y += step) {
                addBreakBlock(bx + x, by + y, v);
            }
        }

        big_blocks--;

        if (big_blocks === 0) {
            _setTimeout(function() {
                Game.win();
            }, 1);
        }

    } else {
        if (random() > 0.5 && !windowManager.__hasOpenedWindow()) {
            SoundManager.playRandomBreak();
        }
    }
}

function addBreakBlock(x, y, velocity) {
    var breack_block = Game.level.node.__addChildBox({
        __img: 'break_' + randomInt(1, 9),
        "__ofs": [x, y, -20],
        "__rotate": randomInt(0, 360),
        "__physics": {
            "__isStatic": false,
            "__friction": 10,
            "__frictionAir": 1,
            "__frictionStatic": 50,
            "__restitution": 0,
            "__density": 1,
            "__bodyType": 1
        }
    });

    looperPost(function() {
        if (breack_block.__ph_body) {
            ph_Body.setVelocity(
                breack_block.__ph_body,
                new Vector2(
                    velocity.x + randomFloat(-10, 10),
                    velocity.y + randomFloat(-8, 3)
                )
            );

            _setTimeout(function() {
                if (breack_block.__ph_body) {
                    initCollision(breack_block.__ph_body, breack_block, 50);

                    _setTimeout(function() {
                        if (!breack_block.__destructed) {
                            removeBlock(breack_block);
                        }
                    }, randomFloat(5, 10));
                }
            }, 1);
        }
    });
}

function initCollision(body, node, hp) {
    blocks.push(node);

    body.__hp = hp;
    node.__hitRegistered = false;

    body.__onCollision = function(speed) {
        if (!node.__hitRegistered) {
            node.__hitRegistered = true;
            ScoreManager.registerHit();
        }

        var dmg = Math.floor(Math.max(0, Math.min(100, (speed - 1) * (speed - 2))));

        if (dmg && body.__hp) {
            body.__hp = Math.max(0, body.__hp - dmg);

            if (!body.__hp) {
                body.__onCollision = null;

                looperPost(function() {
                    removeBlock(node);
                });
            }
        }
    };
}

var PhysicsCore = {
    initCollision: initCollision,
    removeBlock: removeBlock,
    relImpactSpeed: relImpactSpeed,
    awakeBlocks: awakeBlocks,
    addBreakBlock: addBreakBlock
};
