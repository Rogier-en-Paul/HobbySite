function Node(point){
    this.point = point;
    this.g = this.getG();
    this.h = null;
    this.f = this.g+this.h;
    this.parent = parent;
}
Node.prototype.draw = function(ctxt){
    ctxt.font = "11px Arial";
    ctxt.fillRect(this.point.x,this.point.y,40,40);
    ctxt.fillText(this.h,this.point.x + 20,this.point.y + 20);
    ctxt.fillText(this.g,this.point.x,this.point.y + 20);
    ctxt.fillText(this.f,this.point.x,this.point.y);
    ctxt.fillText(this.parent.point.x + "," + this.parent.point.y,this.point.x,this.point.y);
};

Node.prototype.getG = function(){
    return destination.x - this.point.x + destination.y - this.point.y;
};

Node.prototype.getNeighbours = function(){
    var neighbours = [];
};

Node.prototype.addNodeToList = function(node){
    
};