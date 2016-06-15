function Vector(x,y){
    this.x = x;
    this.y = y;
}

Vector.prototype.subtract = function(vector){
    var x = this.x - vector.x;
    var y = this.y - vector.y;
    return new Vector(x, y)
};

Vector.prototype.add = function(vector){
    var x = this.x + vector.x;
    var y = this.y + vector.y;
    return new Vector(x, y);
};

Vector.prototype.scale = function(scalar){
    return new Vector(this.x * scalar, this.y * scalar);
};

Vector.prototype.equals = function(vector){
    return vector.x == this.x && vector.y == this.y;
};

Vector.prototype.clone = function(){
    return new Vector(this.x, this.y);
};