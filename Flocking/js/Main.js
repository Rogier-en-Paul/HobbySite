var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");

update();


function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
}