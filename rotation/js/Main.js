var canvas = document.getElementById("mycanvas");
canvas.addEventListener("mousemove", doMouseMove);
var ctxt = canvas.getContext("2d");
var origin = new Point(0,0);
var point = new Point(0,-30);

origin.drawPoint();

//point.drawPoint();
//point.rotation = 1;
//point.drawPoint();

var triangle = new Polygon([new Point(30,0),new Point(-30,0),new Point(0,-30)]);
triangle.drawPolygon();
triangle.rotate(Math.PI * 1.5);
triangle.drawPolygon();

function doMouseMove(){

}