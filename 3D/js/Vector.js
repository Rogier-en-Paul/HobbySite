function Vector(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
}

Vector.getTriangleArea = function(A, B, C){
    var temp = C.subtract(A).cross(C.subtract(B));
    var x = Math.pow(temp.x, 2);
    var y = Math.pow(temp.y, 2);
    var z = Math.pow(temp.z, 2);
    return Math.pow(x + y + z, 0.5) / 2;
};

Vector.getPlaneIntersect = function(line1, line2, plane1, plane2, plane3){

};

Vector.prototype.isInTriangle = function(tri1, tri2, tri3){
    var totalArea = Vector.getTriangleArea(tri1, tri2, tri3);
    var sub1 = Vector.getTriangleArea(tri1, tri2, this);
    var sub2 = Vector.getTriangleArea(tri1, this, tri3);
    var sub3 = Vector.getTriangleArea(this, tri2, tri3);
    return sub1 + sub2 + sub3 <= totalArea; //watch out fr floating point errors
};

Vector.prototype.dot = function(vector){
    return this.x * vector.x + this.y * vector.y + this.z * vector.z
};

Vector.prototype.cross = function(vector){
    var x = this.y * vector.z - this.z * vector.y;
    var y = this.z * vector.x - this.x * vector.z;
    var z = this.x * vector.y - this.y * vector.x;
    return new Vector(x, y, z);
};

Vector.prototype.subtract = function(vector){
    var x = this.x - vector.x;
    var y = this.y - vector.y;
    var z = this.z - vector.z;
    return new Vector(x, y, z)
};

Vector.prototype.add = function(vector){
    var x = this.x + vector.x;
    var y = this.y + vector.y;
    var z = this.z + vector.z;
    return new Vector(x, y, z);
};

Vector.prototype.scale = function(scalar){
    return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
};

Vector.prototype.length = function(){
    return Math.pow(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2), 0.5);
};

Vector.prototype.angle = function(vector){
    return Math.acos(this.dot(vector) / (this.length() * vector.length()));
};


