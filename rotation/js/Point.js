function Point(x,y){
    this.x = x;
    this.y = y;
    this.origin = origin;
    this.rotation = 0;
}

Point.prototype.drawPoint = function(){
    var rotatedPoint = this;//this.rotate(this,this.rotation);
    var size = 10;
    ctxt.fillRect(rotatedPoint.x - size / 2 + 250, rotatedPoint.y - size / 2 + 250, size, size);
};

Point.prototype.rotate = function(Point,rotation){
    var rotatedPoint = $.extend(true,{},Point);
    var length = Math.pow(Math.pow(rotatedPoint.x,2) + Math.pow(rotatedPoint.y,2),0.5);
    rotatedPoint.x = Math.cos(rotation) * length;
    rotatedPoint.y = Math.sin(rotation) * length;
    return rotatedPoint;
};
