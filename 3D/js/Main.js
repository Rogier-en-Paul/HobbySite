var canvas = document.getElementById("mycanvas");
var width = canvas.width;
var height = canvas.height;
canvas.addEventListener( "keydown", doKeyDown);
var ctxt = canvas.getContext("2d");

var camera = new Camera(0,0,0);
var vertices = [
    new Vector(-10,-10,10),//front
    new Vector(10,-10,10),
    new Vector(-10,10,10),
    new Vector(10,10,10),
    new Vector(-10,-10,20),//back
    new Vector(10,-10,20),
    new Vector(-10,10,20),
    new Vector(10,10,20)
];

drawScene();
ctxt.fillRect(10,10,10,10);

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
    if ( e.keyCode == 82 ) {//r
        camera.z += speed;
    }
    if ( e.keyCode == 70 ) {//f
        camera.z -= speed;
    }
    update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
}

function drawScene(){
    var A = new Vector(-5,-5,5);
    var B = new Vector(0,5,5);
    var C = new Vector(5,-5,5);
    var point1 = new Vector(0,0,1);
    var point2 = new Vector(0,2,2);
    Vector.getPlaneIntersect(point1,point2,A,B,C).isInTriangle(A,B,C);
}