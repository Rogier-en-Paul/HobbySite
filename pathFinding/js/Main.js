var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
canvas.addEventListener("keydown", doKeyDown);

var walkableGrid = [
    [0,0,0,0,0,0],
    [0,1,0,0,0,0],
    [0,1,1,1,1,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
];
var gridWidth = walkableGrid[0].length;
var gridHeight = walkableGrid.length;
var grid = createGrid(gridWidth,gridHeight);
var destination = grid[1][2];
var start = grid[4][3];
start.g = 0;
start.h = start.getH();
start.f = start.g + start.h;

var pathfound = false;
var path = [];
var openList = [start];
var closedList = [];
var currentNode = null;
drawGrid();

function findPath(){
    currentNode = getNodeWithLowestF();
    openList.splice(openList.indexOf(currentNode),1);
    closedList.push(currentNode);

    if(currentNode == destination){
        path = retracePath();
        pathfound = true;
    }
    var neighbours = currentNode.getNeighbours();
    for(var i = 0 ; i < neighbours.length;i++){
        if(!walkableGrid[neighbours[i].point.y][neighbours[i].point.x] && closedList.indexOf(neighbours[i]) == -1) {
            var newMovementCostToNeighbour = currentNode.g + 10;
            if (newMovementCostToNeighbour < neighbours[i].g || openList.indexOf(neighbours[i]) == -1) {
                neighbours[i].g = newMovementCostToNeighbour;
                neighbours[i].h = neighbours[i].getH();
                neighbours[i].f = neighbours[i].g + neighbours[i].h;
                neighbours[i].parent = currentNode;

                if (openList.indexOf(neighbours[i]) == -1) {
                    openList.push(neighbours[i]);
                }
            }
        }
    }



}

function doKeyDown(){
    if(pathfound){
        drawNodes(path,'rgb(100,100,255)');
    }else{
        findPath();
        drawGrid();
    }
}

function retracePath(){
    var path = [];
    var currentNode = destination;
    while(currentNode != start){
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

function createGrid(x,y){
    var grid = create2DArray(x,y);

    for(var i = 0;i < y;i++){
        for(var j = 0;j < x;j++){
            grid[i][j] = new Node(new Point(j,i));
        }
    }
    return grid;
}

function drawGrid(){
    for(var i = 0;i < closedList.length;i++){
        closedList[i].draw(ctxt,'rgb(255,0,0)');
    }
    for(var i = 0;i < openList.length;i++){
        openList[i].draw(ctxt,'rgb(0,255,0)');
    }
    start.draw(ctxt,'rgb(100,100,255)');
    destination.draw(ctxt,'rgb(100,100,255)');
}

function create2DArray(x,y){
    var array = new Array(y);
    for(var i = 0;i < x;i++){
        array[i] = new Array(x);
    }
    return array;
}

function drawNodes(nodes,color){
    for(var i = 0; i < nodes.length ; i++){
        nodes[i].draw(ctxt,color);
    }
}