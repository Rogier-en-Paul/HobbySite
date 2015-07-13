var canvas = document.getElementById("mycanvas");
canvas.addEventListener("mousemove", doMouseMove,false);
var ctxt = canvas.getContext("2d");

var Point1 = new Point(10,10);
var Point2 = new Point(50,50);
var Line = new Line(Point1,Point2);

var Point3 = new Point(100,400);
var Point4 = new Point(250,100);
var Point5 = new Point(400,400);
var Triangle = new Triangle(Point3,Point4,Point5);

update();

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
    Triangle.drawTriangle(ctxt);
    console.log(Point1.isInTriangle(Triangle));
}

function getMousePos(canvas,e){
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function getDistance(Point1,Point2){
    var a = Point1.x - Point2.x;
    var b = Point1.y - Point2.y;
    return Math.pow(Math.pow(a,2)+Math.pow(b,2),0.5);
}
