var canvas = document.getElementById("mycanvas");
canvas.addEventListener("keydown", doKeyDown);
var ctxt = canvas.getContext("2d");

var point = new Point(10,10);
point.drawPoint(ctxt);

function doKeyDown(){

}