var blocks = [];

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

// Исправленная функция расчета скорости (защита от Z error)
function relImpactSpeed(bodyA, bodyB) {
    if (!bodyA || !bodyB || !bodyA.velocity || !bodyB.velocity) {
        return 0;
    }
    var va = bodyA.velocity;
    var vb = bodyB.velocity;
    var vx = (va.x || 0) - (vb.x || 0);
    var vy = (va.y || 0) - (vb.y || 0);
    return new Vector2(vx, vy).__length();
}

function awakeBlocks() {
    $each(blocks, function(b) {
        if (b && b.__ph_awake) b.__ph_awake();
    });
}

// Исправленная функция удаления блока (с восстановленным циклом осколков)
function removeBlock(block) {
    if (!block || block.__destructed) return;

    removeFromArray(block, blocks);

    // Сохраняем данные для создания осколков ПЕРЕД удалением
    var size = { x: block.__size.x, y: block.__size.y };
    var pos = { x: block.__x, y: block.__y };
    var v = { x: 0, y: 0 };
    if (block.__ph_body && block.__ph_body.velocity) {
        v.x = block.__ph_body.velocity.x;
        v.y = block.__ph_body.velocity.y;
    }

    var needsBreaks = block.__needBreaks;
    var isShard = block.__isShard;

    block.__destructed = true;
    block.__removeFromParent();

    looperPostOne(awakeBlocks);

    // Если это большая глыба (не осколок)
    if (!isShard) {
        ScoreManager.addBlockScore();

        if (needsBreaks) {
            SoundManager.playRandomBreak();

            // --- ВОССТАНОВЛЕННЫЙ ЦИКЛ СОЗДАНИЯ ОСКОЛКОВ ---
            var step = 50;
            var bx = pos.x - size.x / 2;
            var by = pos.y - size.y / 2;

            for (var x = 0; x < size.x; x += step) {
                for (var y = 0; y < size.y; y += step) {
                    addBreakBlock(bx + x, by + y, v);
                }
            }
            // ----------------------------------------------

            PhysicsCore.big_blocks--;
            if (PhysicsCore.big_blocks <= 0) {
                _setTimeout(function() {
                    Game.win();
                }, 1);
            }
        }
    } else {
        // Если это сам осколок, просто иногда играем звук
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

    // Помечаем, что это осколок (для ScoreManager и коллизий)
    breack_block.__isShard = true;
    if (breack_block.__ph_body) breack_block.__ph_body.__isShard = true;

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

    body.__onCollision = function(speed, other) {
        // Осколки не наносят урон
        if (other && other.__isShard) return;

        // Регистрация попадания только для крупных блоков
        if (!node.__hitRegistered && !node.__isShard) {
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
    big_blocks: 0,
    initCollision: initCollision,
    removeBlock: removeBlock,
    relImpactSpeed: relImpactSpeed,
    awakeBlocks: awakeBlocks,
    addBreakBlock: addBreakBlock
};