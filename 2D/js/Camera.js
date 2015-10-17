function Camera(x,y){
    Vector.call(this,x,y);
}

Camera.prototype = Object.create(Vector.prototype);


Camera.prototype.drawVector = function(vector){
	ctxt.fillRect(x,y,10,10);
};

Camera.prototype.getIntersect = function(){

};