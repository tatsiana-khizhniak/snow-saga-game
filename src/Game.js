var Game = {
    currentLevelIndex: 1,
    level: null,
    blocks: [],
    bigBlocks: 0,
    rubber: null,

    loadLevel: function(index) {
        this.currentLevelIndex = index;
        LevelLoader.load(index);
    },

    resetLevel: function() {
        this.blocks = [];
        this.bigBlocks = 0;

        if (this.rubber) {
            this.rubber.__killAllAnimations();
            this.rubber = null;
        }

        if (this.level) {
            this.level.__removeFromParent();
            this.level = null;
        }
    },

    onBlockDestroyed: function(block) {
        removeFromArray(block, this.blocks);
        BlockEffects.destroyBlock(block);

        this.bigBlocks--;
        if (this.bigBlocks === 0) {
            this.win();
        }
    },

    win: function() {
        SoundManager.play('win');
        showWindow('win', function(wnd) {
            wnd.__setAliasesData({
                button: {
                    __onTap: function() {
                        Game.currentLevelIndex++;
                        Game.loadLevel(Game.currentLevelIndex);
                    },
                    __onTapHighlight: 1
                }
            });
        });
    }
};
