function Triangle(Point1,Point2,Point3){
    this.points = [Point1,Point2,Point3];

    this.drawTriangle = function(ctxt){
        ctxt.beginPath();
        ctxt.moveTo(this.points[0].x,this.points[0].y);
        ctxt.lineTo(this.points[1].x,this.points[1].y);
        ctxt.lineTo(this.points[2].x,this.points[2].y);
        ctxt.lineTo(this.points[0].x,this.points[0].y);
        ctxt.stroke();
    }
}