var canvas = document.getElementById("mycanvas");
canvas.addEventListener("mousemove", doMouseMove);
var ctxt = canvas.getContext("2d");
var mousePos = {x:0, y:0};
var width = canvas.width;
var height = canvas.height;

var origin = new Point(0,0);
var point = new Point(0,-30);

var triangle = new Polygon([new Point(30,0),new Point(-30,0),new Point(0,-30)]);


update();

function doMouseMove(e){
    mousePos = getMousePos(canvas,e);
    update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    origin.drawPoint();

    //point.drawPoint();
    //point.rotation = 1;
    //point.drawPoint();

    triangle.rotate((mousePos.x / width) * (Math.PI * 2));
    triangle.drawPolygon();
}

function getMousePos(canvas,e){
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}