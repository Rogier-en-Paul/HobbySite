var canvas = document.getElementById("mycanvas");
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMove);
var ctxt = canvas.getContext("2d");

var point1 = new Vector(10,10);
var point2 = new Vector(400,10);
var point3 = new Vector(400,200);
var point4 = new Vector(200,300);
var points = [point1, point2, point3, point4];
var selectedPoint;
update();

//setInterval(function () {
//    update();
//}, 1000/60);

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    point1.draw();
    point2.draw();
    Vector.drawLine(point1,point2);

    point3.draw();
    point4.draw();
    Vector.drawLine(point3,point4);
    Vector.bezierCurve(point1, point2, point3, point4, 20);

}

function mouseMove(e){
    var mousePos = getMousePos(e);
    if(selectedPoint != null){
        selectedPoint.x = mousePos.x;
        selectedPoint.y = mousePos.y;
    }
    update();
    //console.log(mousePos);
}

function mouseDown(e){
    selectedPoint = getClosestPoint(getMousePos(e), points);
    console.log(selectedPoint);
}

function mouseUp(e){
    selectedPoint = null;
    console.log(selectedPoint);
}

function getMousePos(e){
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function getClosestPoint(mousePosition, points){
    var closest = points[0];
    var closestDistance = Vector.distance(new Vector(mousePosition.x, mousePosition.y), closest);
    for(var i = 1; i < points.length; i++){
        var distance = Vector.distance(new Vector(mousePosition.x, mousePosition.y), points[i]);
        if(distance < closestDistance){
            closest = points[i];
            closestDistance = distance;
        }
    }
    if(closestDistance < 20)return closest;
    else return null;
}