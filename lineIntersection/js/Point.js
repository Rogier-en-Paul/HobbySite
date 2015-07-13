function Point(x,y){
    this.x = x;
    this.y = y;

    this.drawPoint = function(ctxt){
        var size = 10;
        ctxt.fillRect(this.x - size/2, this.y-size/2, size, size);
    };

    this.isInTriangle = function(Triangle){
        var sideA = getDistance(Triangle.points[0],this);
        var sideB = getDistance(Triangle.points[1],this);
        var sideC = getDistance(Triangle.points[0],Triangle.points[1]);
        var Y = Math.acos((Math.pow(sideA,2)-Math.pow(sideB,2)-Math.pow(sideC,2))/2*sideA*sideB);
        return false;
    }
}
