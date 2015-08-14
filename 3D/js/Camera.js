function Camera(x,y,z){
    Vector.call(this,x,y,z)
    this.yaw = 0;
    this.pitch = 0;
    this.roll = 0;
}

Camera.prototype = Object.create(Vector.prototype);

Camera.prototype.drawVector = function(vector){
      ctxt.fillRect(vector.x,vector.y,10,10);
};