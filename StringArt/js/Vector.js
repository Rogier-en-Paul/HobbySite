function Vector(x,y){
    this.x = x;
    this.y = y;
}

Vector.prototype.draw = function(){
    var width = 10;
    ctxt.fillRect(this.x - width / 2, this.y - width / 2, width, width)
};

Vector.drawLine = function(vector1, vector2){
    ctxt.beginPath();
    ctxt.moveTo(vector1.x,vector1.y);
    ctxt.lineTo(vector2.x,vector2.y);
    ctxt.stroke();
};

Vector.bezierCurve = function(vector1, vector2, vector3, vector4, accuracy){
    var points = [];
    for(var i = 0; i < accuracy; i++){
        var weight = i / accuracy;
        var point1 = vector1.midPoint(vector2, weight);
        var point2 = vector3.midPoint(vector4, weight);
        points.push(point1.midPoint(point2, weight));
    }
    for(var j = 0; j < points.length - 1; j++){
        Vector.drawLine(points[j], points[j + 1]);
        points[j].draw();
    }
    points[points.length - 1].draw();
    Vector.drawLine(points[points.length - 1], vector4)
};

Vector.prototype.midPoint = function(vector, weigth){
    return this.scale(1 - weigth).add(vector.scale(weigth))
};

Vector.prototype.subtract = function(vector){
    var x = this.x - vector.x;
    var y = this.y - vector.y;
    return new Vector(x, y)
};

Vector.prototype.add = function(vector){
    var x = this.x + vector.x;
    var y = this.y + vector.y;
    return new Vector(x, y);
};

Vector.prototype.scale = function(scalar){
    return new Vector(this.x * scalar, this.y * scalar);
};

Vector.distance = function(vector1, vector2){
    var d = vector2.subtract(vector1);
    return Math.pow(Math.pow(d.x,2) + Math.pow(d.y,2), 0.5);
};