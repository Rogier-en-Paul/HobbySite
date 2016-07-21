function AABB(posA,posB){
    this.posA = posA;
    this.posB = posB;
}

AABB.prototype.AABBCollide = function(aabb){
    return rangeIntersect(this.posA.x, this.posB.x, aabb.posA.x, aabb.posB.x) && rangeIntersect(this.posA.y, this.posB.y, aabb.posA.y, aabb.posB.y)
}

AABB.prototype.AABBContain = function(aabb){
    return rangeContain(this.posA.x, this.posB.x, aabb.posA.x, aabb.posB.x) && rangeContain(this.posA.y, this.posB.y, aabb.posA.y, aabb.posB.y)
}

AABB.prototype.circleCollide = function(circle){
    var center = this.getCenter();
    var halfVector = this.posB.subtract(this.posA).scale(0.5);
    var halfWidth = halfVector.x;
    var halfHeight = halfVector.y;
    var centerToCircle = circle.position.subtract(center);
    var x = clamp(centerToCircle.x, -halfWidth, halfWidth);
    var y = clamp(centerToCircle.y, -halfHeight, halfHeight);
    var closestPoint = new Vector(x, y).add(center);
    return circle.vectorCollision(closestPoint)
}

AABB.prototype.vectorCollide = function(vector){
    if(inRange(this.posA.x, this.posB.x, vector.x) && inRange(this.posA.y, this.posB.y, vector.y)){
    return true;
    }
    return false;
}

AABB.prototype.getCenter = function(){
    return this.posA.weightedAverage(this.posB, 0.5);
}

AABB.prototype.clone = function(){
    return new AABB(this.posA.clone(), this.posB.clone());
}

AABB.prototype.equals = function(aabb){
    return this.posA.equals(aabb.posA) && this.posB.equals(aabb.posB);
}

AABB.prototype.draw = function(){
    var distance = this.posB.subtract(this.posA)
    ctxt.strokeRect(this.posA.x - 0.5, this.posA.y - 0.5, distance.x, distance.y);
}
