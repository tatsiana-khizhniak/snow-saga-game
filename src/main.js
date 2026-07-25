BUS.__addEventListener(__ON_GAME_LOADED, function() {
    Game.loadLevel(Game.currentLevelIndex);
    return 1;
});
