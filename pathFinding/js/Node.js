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
    ctxt.font = "11px Arial";
    ctxt.fillStyle = color;
    ctxt.fillRect(this.point.x * nodeWidth,this.point.y * nodeHeight,nodeWidth - 5,nodeHeight - 5);
    ctxt.fillStyle = 'rgb(0,0,0)';
    ctxt.fillText(this.h,this.point.x * nodeWidth,this.point.y * nodeHeight + 10);
    ctxt.fillText(this.g,this.point.x * nodeWidth + 55,this.point.y * nodeHeight + 10);
    ctxt.fillText(this.f,this.point.x * nodeWidth,this.point.y * nodeHeight + 66);
    if(this.parent != undefined){
        ctxt.fillText(this.parent.point.x + "," + this.parent.point.y,this.point.x * nodeWidth + 30,this.point.y * nodeHeight + 30);
    }

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