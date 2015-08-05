var canvas = document.getElementById("mycanvas");
canvas.addEventListener("keydown", doKeyDown);
var ctxt = canvas.getContext("2d");
var origin = new Point(0,0);
var point = new Point(30,0);

origin.drawPoint();
point.rotation = 1;
point.drawPoint();

var triangle = new Polygon([point,new Point(-30,0),new Point(0,-30)]);
triangle.drawPolygon(point);

function doKeyDown(){

}