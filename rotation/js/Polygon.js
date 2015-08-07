function Polygon(vertices){
    this.vertices = vertices
}

Polygon.prototype.drawPolygon = function(){
    ctxt.beginPath();
    this.vertices.forEach(function(vector){
        var rotatedPoint = vector.rotate(vector,vector.rotation);
        ctxt.lineTo(rotatedPoint.x + 250,rotatedPoint.y + 250);
    });
    var rotatedPoint = this.vertices[0].rotate(this.vertices[0],this.vertices[0].rotation);
    ctxt.lineTo(rotatedPoint.x + 250,rotatedPoint.y + 250);
    ctxt.stroke();
};

Polygon.prototype.rotate = function(rotation){
  this.vertices.forEach(function(point){
      point.rotation = rotation;
  });
};