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
var destination = grid[6][6];
var start = grid[1][1];

var openList = [];
var closedList = [];
start.addToOpenList();

while(openList.length > 0){
    var currentNode = getNodeWithLowestF();
    openList.splice(openList.indexOf(currentNode),1);
    closedList.push(currentNode);

    if(currentNode == destination){
        break;
    }

    currentNode.getNeighbours().forEach(function(neighbour){
        if(!walkableGrid[neighbour.point.x][neighbour.point.y] || closedList.indexOf(neighbour) == -1){
            continue;
        }
        var newMovementCostToNeighbour = currentNode.g + GetDistance(currentNode, neighbour);
        if(0 || openList.indexOf(neighbour) == -1){
            //add some stuff here
            if(openList.indexOf(neighbour) != -1){
                openList.push(neighbour);
            }
        }

    });
}

function getNodeWithLowestF(){
    var nodeWithLowestF = null;
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

function create2DArray(x,y){
    var array = new Array(x);
    for(var i = 0;i < x;i++){
        array[i] = new Array(y);
    }
    return array;
}