var relImpactSpeed = function(bodyA, bodyB) {
    var va = bodyA.velocity;
    var vb = bodyB.velocity;
    return new Vector2(va.x - vb.x, va.y - vb.y).__length();
};
