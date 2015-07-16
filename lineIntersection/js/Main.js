var canvas = document.getElementById("mycanvas");
canvas.addEventListener("mousemove", doMouseMove);
canvas.addEventListener("keydown", doKeyDown);
var ctxt = canvas.getContext("2d");

var Point1 = new Point(30,30);
var Point2 = new Point(100,100);
var Line1 = new Line(Point1,Point2);

var Point3 = new Point(100,400);
var Point4 = new Point(250,100);
var Point5 = new Point(400,400);
var Triangle = new Triangle(Point3,Point4,Point5);

var Line2 = new Line(Point3,Point4);
var currentPoint = Point2;
update();

function doMouseMove(e){
    var mousePos = getMousePos(canvas,e);
    currentPoint.x = mousePos.x;
    currentPoint.y = mousePos.y;
    update();
}

function doKeyDown(e){
    if(e.keyCode == 49){//1
        currentPoint = Point1;
    }else if(e.keyCode == 50){//2
        currentPoint = Point2;
    }else if(e.keyCode == 51){//3
        currentPoint = Point3;
    }else if(e.keyCode == 52){//4
        currentPoint = Point4;
    }
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    var IntersectionPoint = getIntersectionPoint(Line1,Line2);
    var lineSegmentsIntersect = doLineSegmentsIntersect(Line1,Line2);

    if(PointIsInBox(IntersectionPoint,Line1) && !PointIsInBox(IntersectionPoint,Line2)){
        Line1.drawBox(ctxt,PointIsInBox(IntersectionPoint,Line1));
        Line2.drawBox(ctxt,PointIsInBox(IntersectionPoint,Line2));
    }else{
        Line2.drawBox(ctxt,PointIsInBox(IntersectionPoint,Line2));
        Line1.drawBox(ctxt,PointIsInBox(IntersectionPoint,Line1));
    }

    currentPoint.drawPoint(ctxt);
    IntersectionPoint.drawPoint(ctxt,lineSegmentsIntersect);
    Line1.drawLine(ctxt);
    Triangle.drawTriangle(ctxt);
    console.log(lineSegmentsIntersect);
    //console.log(Point1.isInTriangle(Triangle));
}

function doLineSegmentsIntersect(line1,line2){
    var intersectionPoint = getIntersectionPoint(line1,line2);
    return PointIsInBox(intersectionPoint,line1) && PointIsInBox(intersectionPoint,line2);
}

function getIntersectionPoint(line1,line2){
    var delta1 = line1.getDelta();
    var initialY1 = line1.getInitialY();
    var delta2 = line2.getDelta();
    var initialY2 = line2.getInitialY();
    var intersectX = (initialY2-initialY1)/(delta1-delta2);
    var intersectY = (initialY1 + delta1 * intersectX);
    return new Point(intersectX,intersectY);
}

function PointIsInBox(point,line){
    return (point.x > Math.min(line.points[0].x, line.points[1].x) &&
    point.x < Math.max(line.points[0].x, line.points[1].x) &&
    point.y > Math.min(line.points[0].y, line.points[1].y) &&
    point.y < Math.max(line.points[0].y, line.points[1].y));
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
