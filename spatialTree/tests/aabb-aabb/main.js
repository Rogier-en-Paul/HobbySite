var canvas = document.getElementById("mycanvas");
var container = document.getElementById("container");
var ctxt = canvas.getContext("2d");
canvas.addEventListener("mousemove", mouseMove);
ctxt.fillStyle = '#000000';

var aabb = new AABB(new Vector(200,200), new Vector(250,250));
var aabb2 = new AABB(new Vector(100,100), new Vector(150,150));

update();

function mouseMove(e){
    var mousePos = getMousePos(e);
    aabb2.posA = new Vector(mousePos.x, mousePos.y);
    aabb2.posB = new Vector(mousePos.x + 75, mousePos.y + 50);
    update();
}

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    if(aabb.AABBCollide(aabb2)){
        ctxt.strokeStyle = '#ff0000';
        ctxt.fillStyle = '#ff0000';
    }else{
        ctxt.strokeStyle = '#000000';
        ctxt.fillStyle = '#000000';
    }
    aabb2.draw();
    aabb.draw();
}
