var canvas = document.getElementById("mycanvas");
canvas.addEventListener("click",doClick);
var ctxt = canvas.getContext("2d");

var viewer = new Vector(0,0,10);
var camera = new Camera(0,0,0);
var vector = new Vector(1,2,100);
camera.drawVector(vector);
camera.convertTo2D(vector);

function doClick(){

}