var Level = function(node) {
    this.node = node;
};

Level.prototype.traverse = function(callback) {
    this.node.__traverse(callback);
};

Level.prototype.remove = function() {
    this.node.__removeFromParent();
};
