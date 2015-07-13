function Point(x,y){
    this.x = x;
    this.y = y;

    this.drawPoint = function(ctxt){
        var size = 10;
        ctxt.fillRect(this.x - size/2, this.y-size/2, size, size);
    };

    this.isInTriangle = function(Triangle){
        var totalY = 0;
        var cycle = [0,1,2,0];
        for(var i = 0;i<3;i++){
            var sideA = getDistance(Triangle.points[cycle[i]],this);
            var sideB = getDistance(Triangle.points[cycle[i+1]],this);
            var sideC = getDistance(Triangle.points[cycle[i]],Triangle.points[cycle[i+1]]);
            totalY += Math.acos((Math.pow(sideA,2)+Math.pow(sideB,2)-Math.pow(sideC,2))/(2*sideA*sideB));
        }
        return totalY + 0.0000001 >= Math.PI * 2;

    }
}
