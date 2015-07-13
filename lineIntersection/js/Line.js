function Line(Point1,Point2){
    this.point1 = Point1;
    this.point2 = Point2;

    this.drawLine = function(ctxt){
        ctxt.beginPath();
        ctxt.moveTo(this.point1.x,this.point1.y);
        ctxt.lineTo(this.point2.x,this.point2.y);
        ctxt.stroke();
    }
}