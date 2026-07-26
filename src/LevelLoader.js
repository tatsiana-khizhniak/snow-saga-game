var LevelLoader = {
    load: function(index) {

        if (Game.level) {
            Game.level.remove();
            Game.level = null;
        }

        ScoreManager.startLevel(index);

        var levelName = "level_" + index;
        var node = scene.__addChildBox(levelName);

        Game.level = new Level(node);

        LevelInitializer.init(Game.level);
    }
};
