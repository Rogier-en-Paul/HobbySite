function Vector(x,y){
    this.x = x;
    this.y = y;
}

Vector.prototype.draw = function(){
    ctxt.fillRect(this.x,this.y,10,10)
};