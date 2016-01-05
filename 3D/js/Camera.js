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
            image[y][x] = camera.castRay(new Vector(x-20, y-20, 20),scene);
        }
    }
    return image;
};

//returns color
Camera.prototype.castRay = function(P, scene){
    var closest = new Vector(0,0,99999999);
    var color = new Color(255,255,255);
    for(var i = 0;i < scene.objects.length; i ++){
        var intersection = Vector.getPlaneIntersect(this,P,scene.objects[i]);
        if(intersection.isInTriangle(scene.objects[i])){
            if(intersection.memlength < closest.memlength){
                closest = intersection;
                color = scene.objects[i].color;
            }
        }
    }
    return color;
};
