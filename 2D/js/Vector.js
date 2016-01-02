function Vector(x,y){
    this.x = x;
    this.y = y;
}

Vector.prototype.drawLine = function(vector){
    ctxt.beginPath();
    ctxt.moveTo(this.x,this.y);
    ctxt.lineTo(vector.x,vector.y);
    ctxt.stroke();
};

Vector.prototype.draw = function(color){
    var size = 10;
    if(color == undefined)color = 0;
    ctxt.fillStyle = 'rgb(' + color + ',0,0)';
    ctxt.fillRect(this.x - size/2, this.y-size/2, size, size);
    ctxt.fillStyle = 'rgb(0,0,0)';
};

Vector.getInterSectPoint = function(C, P, vector1, vector2){
    var dx = vector2.x - vector1.x;
    var dy = vector2.y - vector1.y;
    var slope = dy / dx;
    var yIntercept = vector1.y - vector1.x * slope;

    var t = (C.x * dy - C.y * dx + yIntercept) / (C.x * dy - C.y * dx + dx * P.y - dy * P.x);
    var ix = (1 - t) * C.x + t * P.x * dx;
    var iy = (1 - t) * C.y + t * P.y * dx;

    return new Vector(ix, iy);
};

Vector.prototype.isInTriangle = function(){

};

Vector.getTriangleArea = function(A, B, C){
    return Math.abs(A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y) / 2)
};
