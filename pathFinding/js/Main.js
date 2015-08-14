var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");
ctxt.textAlign = "center";
ctxt.font = "14px Arial";
var width = canvas.width;
var height = canvas.height;
canvas.addEventListener("keydown", doKeyDown);
canvas.addEventListener("click", doClick);

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
var nodeWidth = width/gridWidth;
var nodeHeight = height/gridHeight;
var destination = grid[1][2];
var start = grid[4][3];
var unwalkableNodes;
updateUnwalkableNodes();
start.g = 0;
start.h = start.getH();
start.f = start.g + start.h;

var pathFound = false;
var path = [];
var openList = [start];
var closedList = [];
var currentNode = null;
start.draw(ctxt,'rgb(100,100,255)');
destination.draw(ctxt,'rgb(100,100,255)');
drawNodes(unwalkableNodes,'rgb(0,0,0)');

function findPath(){
    currentNode = getNodeWithLowestF();
    openList.splice(openList.indexOf(currentNode),1);
    closedList.push(currentNode);

    if(currentNode == destination){
        path = retracePath();
        pathFound = true;
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
    if(!pathFound){
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
        findPath();
        drawNodes(closedList,'rgb(255,0,0)');
        drawNodes(openList,'rgb(0,255,0)');
        drawNodes(unwalkableNodes,'rgb(0,0,0)');
        if(pathFound){
            drawNodes(path,'rgb(100,100,255)');
        }
        start.draw(ctxt,'rgb(100,100,255)');
        destination.draw(ctxt,'rgb(100,100,255)');
    }
}

function doClick(e){
    var mousePos = getMousePos(canvas,e);
    for(var i = 0;i < grid.length;i++){
        for(var j = 0; j < grid[0].length;j++){
            var node = grid[i][j];
            if(mousePos.x > node.point.x * nodeWidth && mousePos.x < node.point.x  * nodeWidth + nodeWidth
                && mousePos.y > node.point.y * nodeHeight && mousePos.y < node.point.y * nodeHeight + nodeHeight){
                if(walkableGrid[node.point.y][node.point.x] == 1){
                    walkableGrid[node.point.y][node.point.x] = 0;
                }else{
                    walkableGrid[node.point.y][node.point.x] = 1;
                }

            }
        }
    }
    updateUnwalkableNodes();
    openList = [start];
    closedList = [];
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    drawNodes(closedList,'rgb(255,0,0)');
    drawNodes(openList,'rgb(0,255,0)');
    drawNodes(unwalkableNodes,'rgb(0,0,0)');
    start.draw(ctxt,'rgb(100,100,255)');
    destination.draw(ctxt,'rgb(100,100,255)');
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

function updateUnwalkableNodes(){
    unwalkableNodes = [];
    for(var i = 0;i < walkableGrid.length;i++){
        for(var j = 0;j < walkableGrid[0].length;j++){
            if(walkableGrid[i][j] == 1){
                unwalkableNodes.push(grid[i][j]);
            }
        }
    }
}

function getMousePos(canvas,e){
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}