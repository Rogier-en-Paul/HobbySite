var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");

var point = new Vector(20,20);

update();

function update(){
    ctxt.fillRect(10,10,10,10);
    point.draw();
}

