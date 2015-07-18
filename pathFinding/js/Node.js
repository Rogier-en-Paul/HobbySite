function Node(h,g,parent,point){
    this.point = point;
    this.h = h;
    this.g = g;
    this.f = g+h;
    this.parent = parent;
}
Node.prototype.draw = function(ctxt){
    ctxt.font = "11px Arial";
    ctxt.fillRect(this.point.x,this.point.y,40,40);
    ctxt.fillText(this.h,this.point.x + 20,this.point.y + 20);
    ctxt.fillText(this.g,this.point.x,this.point.y + 20);
    ctxt.fillText(this.f,this.point.x,this.point.y);
    ctxt.filltext(this.parent.point.x + "," + this.parent.point.y,this.point.x,this.point.y);
}