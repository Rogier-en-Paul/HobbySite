var canvas = document.getElementById("mycanvas");
var container = document.getElementById("container");
var ctxt = canvas.getContext("2d");
canvas.addEventListener("click", click);

var vectors = [];

var quadTree = new QuadTree(new Vector(0,0), new Vector(400,400), 5, null);

for (var i = 0; i < 200; i++) {
    vectors.push(new Vector(Math.floor(Math.random() * 400),Math.floor(Math.random() * 400)));
    quadTree.insert(vectors[i]);
}

update();

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    quadTree.draw();
    for(var i = 0; i < vectors.length; i++){
        vectors[i].draw();
    }
}

function click(e){
    var mousePos = getMousePos(e);
    var leave = quadTree.vectorCollide(new Vector(mousePos.x, mousePos.y));
    // var leaves quadTree.AABBCollide(leave.aabb);

    update();
    ctxt.strokeStyle = "#ff0000"
    leave.draw();
    ctxt.strokeStyle = "#000000"
}
