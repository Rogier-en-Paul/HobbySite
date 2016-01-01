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
    var normal = Vector.normal(plane1,plane2,plane3);
    var u = normal.dot(plane1.subtract(line1)) / normal.dot(line2.subtract(line1));
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

Vector.prototype.length = function(){
    return Math.pow(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2), 0.5);
};

Vector.prototype.angle = function(vector){
    return Math.acos(this.dot(vector) / (this.length() * vector.length()));
};

Vector.normal = function(A,B,C){
    return B.subtract(A).cross(C.subtract(A));
};

Vector.prototype.isInTriangle = function(A,B,C){
    var u = B.subtract(A);
    var v = C.subtract(A);
    var w = this.subtract(A);

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

    var denom = uCrossV.length();
    var r = vCrossW.length() / denom;
    var t = uCrossW.length() / denom;

    return (r + t <= 1);
};

Vector.rotate = function(x, y, z){
    this.rotateX(x);
    this.rotateY(y);
    this.rotateZ(z);
};

Vector.rotateX = function(t){
    var x = new Vector(1, 0, 0).cross(this);
    var y = new Vector(0, Math.cos(t), -Math.sin(t)).cross(this);
    var z = new Vector(0, Math.sin(t), Math.cos(t)).cross(this);
    return new Vector(x,y,z);
};

Vector.rotateY = function(t){
    var x = new Vector(Math.cos(t), 0, Math.sin(t)).cross(this);
    var y = new Vector(0, 1, 0).cross(this);
    var z = new Vector(-Math.sin(t), 0, Math.cos(t)).cross(this);
    return new Vector(x,y,z);
};

Vector.rotateZ = function(t){
    var x = new Vector(Math.cos(t), -Math.sin(t), 0).cross(this);
    var y = new Vector(Math.sin(t), -Math.cos(t), 0).cross(this);
    var z = new Vector(0, 0, 1).cross(this);
    return new Vector(x,y,z);
};


