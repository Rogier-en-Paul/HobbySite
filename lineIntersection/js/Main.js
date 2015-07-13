$(document).ready(function(){
    var canvas = document.getElementById("mycanvas");
    canvas.addEventListener('keydown', doKeyDown, true);
    var ctxt = canvas.getContext("2d");
    ctxt.fillRect(10,10,10,10);
    function doKeyDown(e){

    }
});
