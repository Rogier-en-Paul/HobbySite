function Vector(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.memlength = Math.pow(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2), 0.5);
}

Vector.getTriangleArea = function(triangle){
    var temp = triangle.C.subtract(triangle.A).cross(triangle.C.subtract(triangle.B));
    var x = Math.pow(temp.x, 2);
    var y = Math.pow(temp.y, 2);
    var z = Math.pow(temp.z, 2);
    return Math.pow(x + y + z, 0.5) / 2;
};

Vector.getPlaneIntersect = function(line1, line2,triangle){
    var normal = triangle.normal;
    var u = normal.dot(triangle.A.subtract(line1)) / normal.dot(line2.subtract(line1));
    return line1.add(line2.subtract(line1).scale(u));
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

Vector.prototype.calcLength = function(){
    return Math.pow(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2), 0.5);
};

Vector.prototype.angle = function(vector){
    return Math.acos(this.dot(vector) / (this.calcLength() * vector.calcLength()));
};

Vector.normal = function(A,B,C){
    return B.subtract(A).cross(C.subtract(A));
};

Vector.prototype.isInTriangle = function(triangle){
    var u = triangle.B.subtract(triangle.A);
    var v = triangle.C.subtract(triangle.A);
    var w = this.subtract(triangle.A);

    var vCrossW = v.cross(w);
    var vCrossU = v.cross(u);

    if (vCrossW.dot(vCrossU) < 0){
        return false;
    }

    var uCrossW = u.cross(w);
    var uCrossV = u.cross(v);

    if (uCrossW.dot(uCrossV) < 0) {
        return false;
    }

    var denom = uCrossV.calcLength();
    var r = vCrossW.calcLength() / denom;
    var t = uCrossW.calcLength() / denom;

    return (r + t <= 1);
};

Vector.prototype.rotate = function(x, y, z, center){
    Object.assign(this,this.subtract(center));
    this.rotateX(x);
    this.rotateY(y);
    this.rotateZ(z);
    Object.assign(this,this.add(center));
};

Vector.prototype.rotateX = function(t){
    var newy = this.y * Math.cos(t) - this.z * Math.sin(t);
    var newz = this.y * Math.sin(t) + this.z * Math.cos(t);
    this.y = newy;
    this.z = newz;
};

Vector.prototype.rotateY = function(t){
    var newz = this.z * Math.cos(t) - this.x * Math.sin(t);
    var newx = this.z * Math.sin(t) + this.x * Math.cos(t);
    this.z = newz;
    this.x = newx;

};

Vector.prototype.rotateZ = function(t){
    var newx = this.x * Math.cos(t) - this.y * Math.sin(t);
    var newy = this.x * Math.sin(t) + this.y * Math.cos(t);
    this.x = newx;
    this.y = newy;
};