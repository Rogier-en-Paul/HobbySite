function Camera(x,y,z){
    Vector.call(this,x,y,z);
    this.ex = 0;
    this.ey = 0;
    this.ez = 0;
}

Camera.prototype = Object.create(Vector.prototype);

Camera.prototype.drawVector = function(vector){
      ctxt.fillRect(vector.x,vector.y,10,10);
};

Camera.prototype.convertTo2D = function(vector){
    var d = new Vector();
    var rx = vector.x - this.x;
    var ry = vector.y - this.y;
    var rz = vector.z - this.z;

    var cx = Math.cos(this.ex);
    var cy = Math.cos(this.ey);
    var cz = Math.cos(this.ez);
    var sx = Math.sin(this.ex);
    var sy = Math.sin(this.ey);
    var sz = Math.sin(this.ez);

    d.x = cy * (sz * ry + cz * rx) - sy * rz;
    d.y = sx * (cy * rz + sy * (sz * ry + cz * rx)) + cx * (cz * ry - sz * rx);
    d.z = cx * (cy * rz + sy * (sz * ry + cz * rx)) - sx * (cz * ry - sz * rx);

    var bx = (viewer.z / d.z) * d.x - viewer.x;
    var by = (viewer.z / d.z) * d.y - viewer.y;

    console.log("x = " + bx + ",y = " + by);
};