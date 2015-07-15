function Line(Point1,Point2){
    this.points = [Point1,Point2];


    this.drawLine = function(ctxt){
        ctxt.beginPath();
        ctxt.moveTo(this.points[0].x,this.points[0].y);
        ctxt.lineTo(this.points[1].x,this.points[1].y);
        ctxt.stroke();
    };

    this.getDelta = function(){
        var deltaX = this.points[1].x - this.points[0].x;
        var deltaY = this.points[1].y - this.points[0].y;
        return deltaY/deltaX;
    }

    this.getInitialY = function(){
        return this.points[0].y - this.points[0].x * this.getDelta();
    }

    this.drawBox = function(illumination,ctxt){
        ctxt.fillStyle = 'rgb(' + illumination + ',' + illumination + ',' + illumination + ')';
        ctxt.fillRect(this.points[0].x,this.points[0].y,this.points[1].x - this.points[0].x, this.points[1].y - this.points[0].y);
        ctxt.fillStyle = 'rgb(0,0,0)';
    }

}