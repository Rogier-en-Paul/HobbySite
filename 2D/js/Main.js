var canvas = document.getElementById("mycanvas");
var width = canvas.width;
var height = canvas.height;
canvas.addEventListener( "keydown", doKeyDown);
var ctxt = canvas.getContext("2d");

var camera = new Camera(0,0,0);

var projection = new Vector(5,1);


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
    update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
}

function drawScene(){

}