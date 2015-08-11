function Node(point){
    this.point = point;
    this.g = null; // shortest distance from start
    this.h = null; // distance from target
    this.f = null;
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

Node.prototype.addToOpenList = function(g){
    this.g = g;
    this.h = destination.point.x - this.point.x + destination.point.y - this.point.y;
    this.f = this.g+this.h;
    openList.push(this);
};

Node.prototype.getNeighbours = function(){
    var neighbours = [];
    grid[this.point.x][this.point.y - 1].addToNeighbours(neighbours,10);
    grid[this.point.x][this.point.y + 1].addToNeighbours(neighbours,10);
    grid[this.point.x - 1][this.point.y].addToNeighbours(neighbours,10);
    grid[this.point.x + 1][this.point.y].addToNeighbours(neighbours,10);
    return neighbours;
};

Node.prototype.addToNeighbours = function(neighbours,g){
    this.g = currentNode.g + g;
    this.h = destination.point.x - this.point.x + destination.point.y - this.point.y;
    this.f = this.g+this.h;
    neighbours.push(this);
};