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
    //vertices.forEach(function(vector){
    //    camera.drawVector(vector);
    //});
    camera.drawLine(vertices[0],vertices[1]);
    camera.drawLine(vertices[1],vertices[3]);
    camera.drawLine(vertices[3],vertices[2]);
    camera.drawLine(vertices[2],vertices[0]);

    camera.drawLine(vertices[4],vertices[5]);
    camera.drawLine(vertices[5],vertices[7]);
    camera.drawLine(vertices[7],vertices[6]);
    camera.drawLine(vertices[6],vertices[4]);

    camera.drawLine(vertices[0],vertices[4]);
    camera.drawLine(vertices[1],vertices[5]);
    camera.drawLine(vertices[2],vertices[6]);
    camera.drawLine(vertices[3],vertices[7]);
}