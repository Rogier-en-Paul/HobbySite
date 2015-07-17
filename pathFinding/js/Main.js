var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");
ctxt.fillRect(10,10,10,10);

var startPoint = new Point(1,2);
var destinationPoint = new Point(6,6);
var grid = [
    [0,0,0,0,0,0],
    [0,0,0,1,0,0],
    [0,0,0,1,0,0],
    [0,0,0,1,0,0],
    [0,1,0,0,0,0],
    [0,0,0,0,0,0]
];
var openList = [startPoint];
var closedList = [];

while(openList.length > 0){
    currentPoint = getSquareWithLowestFScore();
    currentPoint.getAdjacentTiles();
}

function calcH(point,endPoint){
    var heuristic = 0;
    heuristic += endPoint.x - point.x;
    heuristic += endPoint.y - point.y;
    return heuristic;
}

function getSquareWithLowestFScore(){

    for(var i = 0; i < openList.length;i++){

    }
}