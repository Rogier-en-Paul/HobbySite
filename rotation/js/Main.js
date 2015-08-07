var canvas = document.getElementById("mycanvas");
canvas.addEventListener("mousemove", doMouseMove);
canvas.addEventListener("click",doClick);
var ctxt = canvas.getContext("2d");
var mousePos = {x:0, y:0};
var width = canvas.width;
var height = canvas.height;

var center = new Point(-30,0);
 var tiangle = new Polygon([new Vector(30,0),new Vector(-30,0),new Vector(0,-30)]);

update();

function doMouseMove(e){
    mousePos = getMousePos(canvas,e);
    update();
}

function doClick(e){
    //mousePos = getMousePos(canvas,e);
    //center.x = mousePos.x - width / 2;
    //center.y = mousePos.y - height / 2;
    //update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    center.drawPoint();

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