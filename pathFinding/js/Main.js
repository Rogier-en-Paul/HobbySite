var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");
ctxt.fillRect(10,10,10,10);

var walkableGrid = [
    [0,0,0,0,0,0],
    [0,0,0,1,0,0],
    [0,0,0,1,0,0],
    [0,0,0,1,0,0],
    [0,1,0,0,0,0],
    [0,0,0,0,0,0]
];
var grid = createGrid();
var destination = grid[2][2];
var start = grid[1][1];
start.g = 0;
start.h = start.getH();
start.f = start.g + start.h;

var openList = [start];
var closedList = [];

while(openList.length > 0){
    var currentNode = getNodeWithLowestF();
    openList.splice(openList.indexOf(currentNode),1);
    closedList.push(currentNode);

    if(currentNode == destination){
        console.log(retracePath());
        drawGrid();
        break;
    }
    currentNode.getNeighbours().forEach(function(neighbour){
        if(!walkableGrid[neighbour.point.x][neighbour.point.y] && closedList.indexOf(neighbour) == -1) {
            var newMovementCostToNeighbour = currentNode.g + 10;
            if (newMovementCostToNeighbour < neighbour.g || openList.indexOf(neighbour) == -1) {
                neighbour.g = newMovementCostToNeighbour;
                neighbour.parent = currentNode;

                if (openList.indexOf(neighbour) == -1) {
                    openList.push(neighbour);
                }
            }
        }
    });
}

function retracePath(start,destination){
    var path = [];
    var currentNode = destination;
    while(destination != start){
        path.push(currentNode);
        currentNode = currentNode.parent;
    }
    return path.reverse();
}

function getNodeWithLowestF(){
    var nodeWithLowestF = openList[0];
    for(var i = 0;i < openList.length;i++){
        if(openList[i].f < nodeWithLowestF.f || openList[i].f == nodeWithLowestF.f && openList[i].h < nodeWithLowestF.h){
            nodeWithLowestF = openList[i];
        }
    }
    return nodeWithLowestF;
}

function createGrid(){
    var grid = create2DArray(6,6);

    for(var x = 0;x < 6;x++){
        for(var y = 0;y < 6;y++){
            grid[x][y] = new Node(new Point(x,y));
        }
    }
    return grid;
}

function drawGrid(){
    for(var i = 0; i < grid.length;i++){
        for(var j = 0; j < grid[0].length; j++){
            grid[i][j].draw(ctxt);
        }
    }
}

function create2DArray(x,y){
    var array = new Array(x);
    for(var i = 0;i < x;i++){
        array[i] = new Array(y);
    }
    return array;
}