var canvas = document.getElementById("mycanvas");
canvas.addEventListener("click",doClick);
var ctxt = canvas.getContext("2d");

var viewer = new Vector(0,0,0);
var camera = new Camera(0,0,0);
var vector = new Vector(10,10,0);
camera.drawVector(vector);

function doClick(){

}