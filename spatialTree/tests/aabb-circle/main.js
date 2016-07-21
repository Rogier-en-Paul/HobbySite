var canvas = document.getElementById("mycanvas");
var container = document.getElementById("container");
var ctxt = canvas.getContext("2d");
canvas.addEventListener("mousemove", mouseMove);
ctxt.fillStyle = '#000000';

var circle = new Circle(new Vector(75,100), 20);
var aabb = new AABB(new Vector(200,200), new Vector(250,250));

update();

function mouseMove(e){
    var mousePos = getMousePos(e);
    circle.position = new Vector(mousePos.x, mousePos.y);
    update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    if(aabb.circleCollide(circle)){
        ctxt.fillStyle = '#ff0000';
    }else{
        ctxt.fillStyle = '#000000';
    }
    circle.draw();
    aabb.draw();
}
