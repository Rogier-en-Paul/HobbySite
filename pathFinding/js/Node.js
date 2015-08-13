function Node(point){
    this.point = point;
    this.g = null; // shortest distance from start
    this.h = null; // distance from target
    this.f = null;
    this.parent = null;
}

Node.prototype.draw = function(ctxt,color){
    if(color === undefined) color = 'rgb(0,255,0)';
    var nodeWidth = width/gridWidth;
    var nodeHeight = height/gridHeight;
    ctxt.fillStyle = 'rgb(80,80,80)';
    ctxt.fillRect(this.point.x * nodeWidth - 2,this.point.y * nodeHeight - 2,nodeWidth + 4,nodeHeight + 4);
    ctxt.fillStyle = color;
    ctxt.fillRect(this.point.x * nodeWidth + 3,this.point.y * nodeHeight + 3,nodeWidth - 6,nodeHeight - 6);
    ctxt.fillStyle = 'rgb(0,0,0)';
    ctxt.fillText(this.h,this.point.x * nodeWidth + 15,this.point.y * nodeHeight + 20);
    ctxt.fillText(this.g,this.point.x * nodeWidth + 70,this.point.y * nodeHeight + 20);
    ctxt.font = "bold 21px Arial";
    ctxt.fillText(this.f,this.point.x * nodeWidth + 42,this.point.y * nodeHeight + 50);
    ctxt.font = "14px Arial";
    if(this.parent != undefined){
        ctxt.fillText(this.parent.point.x + "," + this.parent.point.y,this.point.x * nodeWidth + 42,this.point.y * nodeHeight + 70);
    }

};

Node.prototype.getNeighbours = function(){
    var neighbours = [];
    var neighbourMap = [
        {x:-1,y:0},
        {x:1,y:0},
        {x:0,y:-1},
        {x:0,y:1}
    ];
    for(var i = 0;i < neighbourMap.length;i++){
        var checkX = this.point.x + neighbourMap[i].x;
        var checkY = this.point.y + neighbourMap[i].y;
        if(checkX >= 0 && checkY >= 0 && checkX < 6 && checkY < 6){
            var neighbour = grid[checkY][checkX];
            neighbours.push(neighbour);
        }
    }
    return neighbours;
};

Node.prototype.getH = function(){
    var distanceX = Math.abs(destination.point.y - this.point.y) ;
    var distanceY = Math.abs(destination.point.x - this.point.x);
    return (distanceX + distanceY) * 10;
};