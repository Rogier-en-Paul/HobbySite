var canvas = document.getElementById("mycanvas");
canvas.addEventListener("mousemove", doMouseMove,false);
var ctxt = canvas.getContext("2d");

var Point1 = new Point(30,30);
var Point2 = new Point(100,100);
var Line1 = new Line(Point1,Point2);

var Point3 = new Point(100,400);
var Point4 = new Point(250,100);
var Point5 = new Point(400,400);
var Triangle = new Triangle(Point3,Point4,Point5);

var Line2 = new Line(Point3,Point4);
update();

function doMouseMove(e){
    var mousePos = getMousePos(canvas,e);
    Point2.x = mousePos.x;
    Point2.y = mousePos.y;
    update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    console.log(doLineSegmentsIntersect(Line1,Line2));
    Point2.drawPoint(ctxt);
    Line1.drawLine(ctxt);
    Triangle.drawTriangle(ctxt);

    //console.log(Point1.isInTriangle(Triangle));
}

function doLineSegmentsIntersect(line1,line2){
    var intersectionPoint = getIntersectionPoint(line1,line2);
    intersectionPoint.drawPoint(ctxt);
    return isPointInBox(intersectionPoint,line1) && isPointInBox(intersectionPoint,line2);
}

function getIntersectionPoint(line1,line2){
    var delta1 = line1.getDelta();
    var initialY1 = line1.getInitialY();
    var delta2 = line2.getDelta();
    var initialY2 = line2.getInitialY();
    var intersectX = (initialY2-initialY1)/(delta1-delta2);
    var intersectY = (initialY1 + delta1 * intersectX);
    var point = new Point(intersectX,intersectY);
    line1.drawBox(128,ctxt);
    line2.drawBox(128,ctxt);
    return point;

}

function isPointInBox(point,line){
    if(point.x > Math.min(line.points[0].x,line.points[1].x) &&
        point.x < Math.max(line.points[0].x,line.points[1].x) &&
        point.y > Math.min(line.points[0].y,line.points[1].y) &&
        point.y < Math.max(line.points[0].y,line.points[1].y)
        ){
        return true
    }
    return false;
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
