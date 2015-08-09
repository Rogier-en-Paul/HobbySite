var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");
ctxt.fillRect(10,10,10,10);


var destination = new Point(6,6);
var start = new Node(0,null,new Point(1,1));


var grid = [
    [0,0,0,0,0,0],
    [0,0,0,1,0,0],
    [0,0,0,1,0,0],
    [0,0,0,1,0,0],
    [0,1,0,0,0,0],
    [0,0,0,0,0,0]
];
var openList = [start];
var closedList = [];

while(openList.length > 1000){
    var currentNode = getNodeWithLowestF();
    openList.splice(openList.indexOf(currentNode),1);
    closedList.push(currentNode);

    if(currentNode.point == destination){
        break;
    }

    currentNode.getNeighbours().forEach(function(neighbour){
        
    });
}

function getNodeWithLowestF(){
    var nodeWithLowestF = null;
    for(var i = 0;i < openList.length;i++){
        if(openList[i].f < nodeWithLowestF.f){
            nodeWithLowestF = openList[i];
        }
    }
    return nodeWithLowestF;
}