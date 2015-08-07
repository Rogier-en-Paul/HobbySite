function Vector(x,y){
    Point.call(this,x,y);
    this.origin = center;
    this.rotation = 0;
}

Vector.prototype = Object.create(Point.prototype);

Vector.prototype.drawPoint = function(){
    var rotatedPoint = this.rotate(this,this.rotation);
    var size = 10;
    ctxt.fillRect(rotatedPoint.x - size / 2 + 250, rotatedPoint.y - size / 2 + 250, size, size);
};

Vector.prototype.rotate = function(Point,rotation){
    var rotatedPoint = $.extend({},Point);
    rotatedPoint.x = (Point.x - this.origin.x) * Math.cos(rotation) - (Point.y - this.origin.y) * Math.sin(rotation);
    rotatedPoint.y = (Point.x - this.origin.x) * Math.sin(rotation) + (Point.y - this.origin.y) * Math.cos(rotation);
    return rotatedPoint;
};