function Vector(x,y){
    this.x = x;
    this.y = y;
    this.length = this.calcLength();
}

Vector.prototype.add = function(vector){
    this.x += vector.x;
    this.y += vector.y;
    return this;
};

Vector.prototype.subtract= function(vector){
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
};

Vector.prototype.scale = function(scalar){
    this.x *= scalar;
    this.y *= scalar;
    this.length *= scalar;
    return this;
};

Vector.prototype.calcLength = function(){
    return Math.pow(Math.pow(this.x,2) + Math.pow(this.y,2), 0.5);
};

Vector.prototype.setAngle = function(angle){
    this.x = this.calcLength();
    this.y = 0;
    this.rotate(angle)
};

Vector.prototype.rotate = function(angle){
    var newX = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    var newY = this.x * Math.sin(angle) + this.y *Math.cos(angle);
    this.x = newX;
    this.y = newY;
    return this;
};

Vector.prototype.distance = function(vector){
    return this.subtract(vector).calcLength();
};

Vector.prototype.normalize = function(){
    return new Vector(this.x / this.length, this.y / this.length)
};