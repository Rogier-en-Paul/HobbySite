function Polygon(points){
    this.points = points
}

Polygon.prototype.drawPolygon = function(){
    ctxt.beginPath();
    this.points.forEach(function(point){
        var rotatedPoint = point.rotate(point,point.rotation);
        ctxt.lineTo(rotatedPoint.x + 250,rotatedPoint.y + 250);
    });
    var rotatedPoint = this.points[0].rotate(this.points[0],this.points[0].rotation);
    ctxt.lineTo(rotatedPoint.x + 250,rotatedPoint.y + 250);
    ctxt.stroke();
};

Polygon.prototype.rotate = function(rotation){
  this.points.forEach(function(point){
      point.rotation = rotation;
  });
};