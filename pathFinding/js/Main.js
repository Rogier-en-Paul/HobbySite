var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");
ctxt.fillRect(10,10,10,10);

var destinationPoint = new Point(6,6);
var start = new Point(1,1);
var startPoint = new Node(calcH(start,destinationPoint),0,null,start);


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
    closedList.push(currentPoint);
    removeFromArray(openList,currentPoint);

    if(arrayContainsPoint(closedList,destinationPoint)){
        break;
    }

    var adjacentTiles = currentPoint.getAdjacentTiles();
    for(var i = 0;i<adjacentTiles.length;i++){
        if(arrayContaintsObject(closedList,adjacentTiles[i])){
            continue;
        }else if(!arrayContaintsObject(openList,adjacentTiles[i])){
            openList.push(new Node(getH));
        }else if(currentPoint.g + currentPoint.h + 1 < adjacentTiles[i].f){
            adjacentTiles.parent = currentPoint;
        }
    }
}

function calcH(point,endPoint){
    var heuristic = 0;
    heuristic += endPoint.x - point.x;
    heuristic += endPoint.y - point.y;
    return heuristic;
}

function getSquareWithLowestFScore(){
    var lowestF;
    for(var i = 0; i < openList.length;i++){
        if(openList[0].f < lowestF){
            lowestF = openList[0];
        }
    }
}

function removeFromArray(array,object){
    for(var i = 0;i<array.length;i++){
        if(array[i] === object){
            array.splice(i,1);
        }
    }
}

function arrayContainsPoint(array,object){
    for(var i = 0;i < array.length;i++){
        if(array[i].point.x == object.x && array[i].point.y == object.y){
            return true;
        }
    }
    return false;
}

function arrayContaintsObject(array,object){
    for(var i = 0;i < array.length;i++){
        if(array[i] === object){
            return true;
        }
    }
    return false;
}