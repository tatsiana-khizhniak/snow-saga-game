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
        console.log('inside win');

        // accuracy bonus
        ScoreManager.applyAccuracyBonus();

        // FINAL SUMMARY AFTER LEVEL 3
        if (this.currentLevelIndex === 3) {

            var total = ScoreManager.getTotalStats();

            showWindow('win', function(wnd) {
                wnd.__setAliasesData({
                    scoreText: { __text: "Total Score: " + total.score },
                    hitsText: { __text: "Total Snowballs: " + total.hits },
                    missText: { __text: "Total Misses: " + total.misses },

                    button: {
                         __text: Game.currentLevelIndex === 3 ? "Play again" : "Next level",

                        __onTap: function() {
                            if (Game.currentLevelIndex === 3) {
                            Game.currentLevelIndex = 1;
                        } else {
                            Game.currentLevelIndex++;
                        }
                            wnd.__close();
                            Game.loadLevel(Game.currentLevelIndex);
                        },
                        __onTapHighlight: 1
                    }
                });
            });
            return;
        }

        // LEVEL SUMMARY (LEVELS 1 AND 2)
        var stats = ScoreManager.levelStats[this.currentLevelIndex];

        SoundManager.play('win');

        showWindow('win', function(wnd) {
            wnd.__setAliasesData({
                scoreText: { __text: "Score: " + stats.score },
                hitsText: { __text: "Snowballs: " + ScoreManager.shotsTotal },
                missText: { __text: "Misses: " + ScoreManager.shotsMissed },

                button: {
                    __onTap: function() {
                        wnd.__close();
                        Game.currentLevelIndex++;
                        Game.loadLevel(Game.currentLevelIndex);
                    },
                    __onTapHighlight: 1
                }
            });
        });
    }
};
