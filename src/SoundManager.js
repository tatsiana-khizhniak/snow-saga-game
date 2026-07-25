var SoundManager = {

    play: function(name) {
        playSound(name);
    },

    playRandomBreak: function() {
        playSound('break_' + randomInt(1, 4), 0, 0, 0.5);
    }
};
