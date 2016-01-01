function Camera(x,y,z){
    Vector.call(this,x,y,z);
    this.yaw = 0;
    this.pitch = 0;
    this.roll = 0;
    this.resolutionWidth = 40;
    this.resolutionHeight = 40;
}

Camera.prototype = Object.create(Vector.prototype);

Camera.prototype.generateImage = function(){
    var image = Array.matrix(this.resolutionWidth);
    for(var x = 0; x < this.resolutionWidth; x ++){
        for(var y = 0; y < this.resolutionHeight; y++){
            var firstHit = camera.castRay(new Vector(x-20, y-20, 20));
            if(firstHit == true){
                image[y][x] = new Color(0,0,0);
            }else{
                image[y][x] = new Color(255,255,255);
            }
        }
    }
    return image;
};

Camera.prototype.castRay = function(P){
    var A = new Vector(-5,-5,25);
    var B = new Vector(0,5,25);
    var C = new Vector(5,-5,25);
    return Vector.getPlaneIntersect(this,P,A,B,C).isInTriangle(A,B,C);
};
