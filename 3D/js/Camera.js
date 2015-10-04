function Camera(x,y,z){
    Vector.call(this,x,y,z);
	this.screensize = 300;
    //orientation yaw pitch roll
    //fov
}

Camera.prototype = Object.create(Vector.prototype);


Camera.prototype.drawVector = function(vector){
	var x = this.getVectorXScreenPos(vector);
	var y = this.getVectorYScreenPos(vector);

	ctxt.fillRect(x,y,10,10);
};

Camera.prototype.getVectorXScreenPos = function(vector){
	return Math.floor((vector.x - this.x) / (vector.z - this.z) * this.screensize + width / 2);
};

Camera.prototype.getVectorYScreenPos = function(vector){
	return Math.floor((vector.y - this.y) / (vector.z - this.z) * this.screensize * -1 + height / 2);
};

Camera.prototype.drawLine = function(vector1,vector2){
	if(vector1.z < this.z || vector2.z < this.z){
		return
	}
	ctxt.beginPath();
	ctxt.moveTo(this.getVectorXScreenPos(vector1),this.getVectorYScreenPos(vector1));
	ctxt.lineTo(this.getVectorXScreenPos(vector2),this.getVectorYScreenPos(vector2));
	ctxt.stroke();
};
