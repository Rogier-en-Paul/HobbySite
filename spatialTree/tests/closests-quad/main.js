var canvas = document.getElementById("mycanvas");
var container = document.getElementById("container");
var ctxt = canvas.getContext("2d");
canvas.addEventListener("click", click);

var vectors = [];

var quadTree = new QuadTree(new Vector(0,0), new Vector(1000,1000), 11, null);

for (var i = 0; i < 1000000; i++) {
    vectors.push(new Vector(Math.floor(Math.random() * 1000),Math.floor(Math.random() * 1000)));
    quadTree.insert(vectors[i]);
}

update();

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    // quadTree.draw();
    // for(var i = 0; i < vectors.length; i++){
    //     vectors[i].draw();
    // }
}

function click(e){
    var mousePos = getMousePos(e);
    var vectors = quadTree.getClosests(new Vector(mousePos.x, mousePos.y), 20);
    // var leaves quadTree.AABBCollide(leave.aabb);

    update();
    ctxt.fillStyle = "#ff0000"
    for(var i = 0; i < vectors.length; i++){
        vectors[i].draw();
    }
    ctxt.fillStyle = "#000000"
}
