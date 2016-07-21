function Circle(position, radius){
    this.position = position;
    this.radius = radius;
}

Circle.prototype.circleCollision = function(circle){
    return (this.radius + circle.radius) <= this.position.distance(circle.position);
}

Circle.prototype.vectorCollision = function(vector){
    return this.position.distance(vector) <= this.radius;
}

Circle.prototype.draw = function(){
    ctxt.beginPath();
    ctxt.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctxt.stroke();
}
