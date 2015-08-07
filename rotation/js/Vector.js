function Vector(x,y){
    Point.call(this,x,y);
    this.origin = center;
    this.rotation = 0;
}

Vector.prototype = Object.create(Point.prototype);

Vector.prototype.drawPoint = function(){
    var rotatedVectort = this.rotate(this,this.rotation);
    var size = 10;
    ctxt.fillRect(rotatedVectort.x - size / 2 + 250, rotatedVectort.y - size / 2 + 250, size, size);
};

Vector.prototype.rotate = function(Vector,rotation){
    var rotatedVector = $.extend({},Vector);
    rotatedVector.x = (Vector.x - this.origin.x) * Math.cos(rotation) - (Vector.y - this.origin.y) * Math.sin(rotation) + this.origin.x;
    rotatedVector.y = (Vector.x - this.origin.x) * Math.sin(rotation) + (Vector.y - this.origin.y) * Math.cos(rotation) + this.origin.y;
    return rotatedVector;
};