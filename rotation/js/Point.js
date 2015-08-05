function Point(x,y){
    this.x = x;
    this.y = y;
    this.origin = origin;
    this.rotation = 0;
}

Point.prototype.drawPoint = function(){
    var rotatedPoint = this.rotate(this,this.rotation);
    var size = 10;
    ctxt.fillRect(rotatedPoint.x - size / 2 + 250, rotatedPoint.y - size / 2 + 250, size, size);
};

Point.prototype.rotate = function(Point,rotation){
    var rotatedPoint = $.extend(true,{},Point);
    rotatedPoint.x = Point.x * Math.cos(rotation) - Point.y * Math.sin(rotation);
    rotatedPoint.y = Point.x * Math.sin(rotation) + Point.y * Math.cos(rotation);
    return rotatedPoint;
};
