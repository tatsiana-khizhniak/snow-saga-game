var Block = function(node, body, hp) {
    this.node = node;
    this.body = body;
    this.hp = hp;

    Game.blocks.push(node);

    var self = this;

    body.__onCollision = function(speed) {
        self.onCollision(speed);
    };
};

Block.prototype.onCollision = function(speed) {
    var dmg = Math.floor(Math.max(0, Math.min(100, (speed - 1) * (speed - 2))));

    if (dmg > 0) {
        this.hp -= dmg;

        if (this.hp <= 0) {
            this.body.__onCollision = null;
            Game.onBlockDestroyed(this.node);
        }
    }
};
