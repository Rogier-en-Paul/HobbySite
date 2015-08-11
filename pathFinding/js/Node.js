function Node(point){
    this.point = point;
    this.g = null; // shortest distance from start
    this.h = null; // distance from target
    this.f = null;
    this.parent = null;
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
    this.h = (destination.point.x - this.point.x + destination.point.y - this.point.y) * 10;
    this.f = this.g+this.h;
    openList.push(this);
};

Node.prototype.getNeighbours = function(){
    var neighbours = [];
    var neighbourMap = [
        {x:-1,y:0,distance:10},
        {x:1,y:0,distance:10},
        {x:0,y:-1,distance:10},
        {x:0,y:1,distance:10}
    ];
    for(var i = 0;i < neighbourMap.length;i++){
        var checkX = this.point.x + neighbourMap[i].x;
        var checkY = this.point.y + neighbourMap[i].y;
        if(checkX >= 0 && checkY >= 0 && checkX < 6 && checkY < 6){
            var neighbour = grid[checkX][checkY];
            neighbour.g = currentNode.g + neighbourMap[i].distance;
            neighbour.h = (destination.point.x - neighbour.point.x + destination.point.y - neighbour.point.y) * 10;
            neighbour.f = neighbour.g+neighbour.h;
            neighbours.push(neighbour);
        }
    }
    return neighbours;
};

function drawGrid(){
    for(var i = 0; i < grid.length;i++){
        for(var j = 0; j < grid[0].length; j++){
            grid[i][j].draw();
        }
    }
}