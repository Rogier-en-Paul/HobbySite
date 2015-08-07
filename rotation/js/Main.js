var canvas = document.getElementById("mycanvas");
//canvas.addEventListener("mousemove", doMouseMove);
canvas.addEventListener("click",doClick);
var ctxt = canvas.getContext("2d");
var mousePos = {x:0, y:0};
var width = canvas.width;
var height = canvas.height;

var absoluteCenter = new Point(0,0);
var center = new Point(0,0);
var triangle = new Polygon([new Vector(-100,100),new Vector(100,100),new Vector(0,-100)]);
var rotation = 0;

update();

//function doMouseMove(e){
//    mousePos = getMousePos(canvas,e);
//    update();
//}

setInterval(function () {
    rotation += 0.005;
    triangle.rotate(rotation);
    update();
}, 1/60);

function doClick(e){
    mousePos = getMousePos(canvas,e);
    center.x = mousePos.x - width / 2;
    center.y = mousePos.y - height / 2;
    update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    center.drawPoint();
    absoluteCenter.drawPoint();

    triangle.drawPolygon();
}

function getMousePos(canvas,e){
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}