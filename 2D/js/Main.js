var canvas = document.getElementById("mycanvas");
var width = canvas.width;
var height = canvas.height;
canvas.addEventListener( "keydown", doKeyDown);
var ctxt = canvas.getContext("2d");

var camera = new Camera(0, 0);
var projection = new Vector(300, 200);
var point1 = new Vector(0, 12);
var point2 = new Vector(100, 30);

var tri1 = new Vector(0, 0);
var tri2 = new Vector(0, 5);
var tri3 = new Vector(5, 5);

drawScene();

function doKeyDown(e) {
    var speed = 1;
    if ( e.keyCode == 87 ) {//w
        camera.y += speed;
    }
    if ( e.keyCode == 83 ) {//s
        camera.y -= speed;
    }
    if ( e.keyCode == 65 ) {//a
        camera.x -= speed;
    }
    if ( e.keyCode == 68 ) {//d
        camera.x += speed;
    }
    update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
}

function drawScene(){
    point1.drawLine(point2);
    camera.drawLine(projection);
    Vector.getInterSectPoint(camera, projection, point1, point2).draw();
    Vector.getTriangleArea(tri1,tri2,tri3);
}