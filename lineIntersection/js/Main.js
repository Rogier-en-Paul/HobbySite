var canvas = document.getElementById("mycanvas");
canvas.addEventListener("mousemove", doMouseMove,false);
var ctxt = canvas.getContext("2d");

var Point1 = new Point(10,10);
var Point2 = new Point(60,60);
var Line = new Line(Point1,Point2);


function doMouseMove(e){
    var mousePos = getMousePos(canvas,e);
    Point1.x = mousePos.x;
    Point1.y = mousePos.y;
    update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    Point1.drawPoint(ctxt);
    Line.drawLine(ctxt);
}

function getMousePos(canvas,e){
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}
