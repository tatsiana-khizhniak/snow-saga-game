var ScoreManager = {

    totalScore: 0,
    totalHits: 0,
    totalMisses: 0,

    levelStats: [],

    combo: 1,
    lastBreakTime: 0,

    shotsTotal: 0,
    shotsHit: 0,
    shotsMissed: 0,

    startLevel: function(levelIndex) {
        this.combo = 1;
        this.lastBreakTime = 0;

        this.shotsTotal = 0;
        this.shotsHit = 0;
        this.shotsMissed = 0;

        this.levelStats[levelIndex] = {
            score: 0,
            hits: 0,
            misses: 0
        };

        this.updateLevelTexts();
    },

    addBlockScore: function() {
        var now = performance.now();

        if (now - this.lastBreakTime < 150) {
            this.combo = 2;
        } else {
            this.combo = 1;
        }

        this.lastBreakTime = now;

        var points = 10 * this.combo;

        this.levelStats[Game.currentLevelIndex].score += points;
        this.totalScore += points;

        this.updateLevelTexts();
    },

    registerHit: function() {
        this.shotsHit++;
        this.levelStats[Game.currentLevelIndex].hits++;
        this.totalHits++;

        this.updateLevelTexts();
    },

    registerMiss: function() {
        this.shotsMissed++;
        this.levelStats[Game.currentLevelIndex].misses++;
        this.totalMisses++;

        this.updateLevelTexts();
    },

    applyAccuracyBonus: function() {
        if (this.shotsMissed === 0) {
            this.levelStats[Game.currentLevelIndex].score += 50;
            this.totalScore += 50;
        }
    },

    getTotalStats: function() {
        return {
            score: this.totalScore,
            hits: this.totalHits,
            misses: this.totalMisses
        };
    },

    updateLevelTexts: function() {
        if (!Game.level || !Game.level.node || !Game.level.node.__aliases) return;

        var stats = this.levelStats[Game.currentLevelIndex];

        var a = Game.level.node.__aliases;

        if (a.scoreLabel) {
            a.scoreLabel.__text = "Score: " + stats.score;
        }
        if (a.hitsLabel) {
            a.hitsLabel.__text = "Throws: " + this.shotsTotal;
        }
        if (a.missLabel) {
            a.missLabel.__text = "Misses: " + this.shotsMissed;
        }
    }
};
