function Polygon(points){
    this.points = points
}

Polygon.prototype.drawPolygon = function(){
    ctxt.beginPath();
    this.points.forEach(function(point){
        ctxt.lineTo(point.x + 250,point.y + 250);
    });
    ctxt.lineTo(this.points[0].x + 250,this.points[0].y + 250);
    ctxt.stroke();
};