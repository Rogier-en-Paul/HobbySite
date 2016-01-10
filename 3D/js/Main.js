Array.matrix = function(numrows){
    var array = [];
    for(var i = 0;i < numrows; i ++){
        array[i] = [];
    }
    return array
};

var canvas = document.getElementById("mycanvas");
var width = canvas.width;
var height = canvas.height;
canvas.addEventListener( "keydown", doKeyDown);
var ctxt = canvas.getContext("2d");

var scene = new Scene();
var A = new Vector(-5,0,10);
var B = new Vector(0,5,10);
var C = new Vector(5,0,10);
var triangle = new Triangle(A,B,C);
triangle.centroid = new Vector(0,0,10);
triangle.color = new Color(255,0,0);
scene.objects.push(triangle);

var A2 = new Vector(-5,0,8);
var B2 = new Vector(0,5,8);
var C2 = new Vector(5,0,8);
var triangle2 = new Triangle(A2,B2,C2);
triangle2.centroid = new Vector(0,0,8);
scene.objects.push(triangle2);

var camera = new Camera(0,0,0);

drawScene();
ctxt.fillRect(10,10,10,10);

setInterval(function () {
    triangle.rotate(0,-0.01,0.03);
    triangle2.rotate(0.03,0,0.01);
    update();
}, 1000/60);

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
    drawImage(camera.generateImage());
}

function drawImage(image){
    for(var x = 0; x < image.length; x ++) {
        for (var y = 0; y < image[0].length; y++) {
            ctxt.fillStyle = 'rgb('+ image[y][x].r +',' + image[y][x].g +','+image[y][x].b + ')';
            ctxt.fillRect(x * 10, y * 10,40,40)
        }
    }
    ctxt.fillStyle = 'rgb(0,0,0)';
}

