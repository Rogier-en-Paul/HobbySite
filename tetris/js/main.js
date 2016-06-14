var canvas = document.getElementById("mycanvas");
var container = document.getElementById("container");
window.addEventListener("resize",resize);
var ctxt = canvas.getContext("2d");
var size;
var body = document.body;
var mc = new Hammer(document);
mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
var tetrion = new Tetrion();

//functions in tetromino that use the tetrion attribute could maybe be placed in tetrion

resize();
document.body.addEventListener("keydown", function (e) {
    if (e.keyCode == 87 || e.keyCode == 38) {//w
        tetrion.activeTetromino.rotate();
    }
    if (e.keyCode == 83 || e.keyCode == 40) {//s
        tetrion.activeTetromino.firmDrop();
    }
    if (e.keyCode == 65 || e.keyCode == 37) {//a
        tetrion.activeTetromino.moveLeft();
    }
    if (e.keyCode == 68 || e.keyCode == 39) {//d
        tetrion.activeTetromino.moveRight();
    }
    if (e.keyCode == 67) {//c
        tetrion.hold();
    }
    tetrion.dropPosition = tetrion.activeTetromino.dropPosition();
    tetrion.draw();
});

var distanceTraveled = 0;
var oldDistanceTraveled = 0;
var sensitivity = 50;

mc.on("panleft", function(ev) {
    distanceTraveled += Math.abs(ev.deltaX - oldDistanceTraveled);
    oldDistanceTraveled = ev.deltaX;
    if(distanceTraveled > sensitivity){
        distanceTraveled = 0;
        tetrion.activeTetromino.moveLeft();
        tetrion.dropPosition = tetrion.activeTetromino.dropPosition();
        tetrion.draw();
    }

});

mc.on("panright", function(ev) {
    distanceTraveled += Math.abs(ev.deltaX - oldDistanceTraveled);
    oldDistanceTraveled = ev.deltaX;
    if(distanceTraveled > sensitivity) {
        distanceTraveled = 0;
        tetrion.activeTetromino.moveRight();
        tetrion.dropPosition = tetrion.activeTetromino.dropPosition();
        tetrion.draw();
    }
});

mc.on("panend", function(ev) {
    distanceTraveled = 0;
    oldDistanceTraveled = 0;
});

mc.on("tap", function(ev) {
    tetrion.activeTetromino.rotate();
    tetrion.dropPosition = tetrion.activeTetromino.dropPosition();
    tetrion.draw();
});

mc.on("swipedown", function(ev) {
    tetrion.activeTetromino.firmDrop();
    tetrion.dropPosition = tetrion.activeTetromino.dropPosition();
    tetrion.draw();
});

mc.on("swipeup", function(ev) {
    tetrion.hold();
    tetrion.dropPosition = tetrion.activeTetromino.dropPosition();
    tetrion.draw();
});

function resize(){
    var maxwidth = container.clientWidth;
    var maxheight = screen.height-200;
    var maxWidthSize = Math.floor(maxwidth / 2.5 / tetrion.columns);
    var maxHeightSize = Math.floor(maxheight / tetrion.rows);
    if(maxWidthSize > maxHeightSize) size = maxHeightSize;
    else size = maxWidthSize;
    canvas.width  = tetrion.columns * size * 2 + 1;
    canvas.height = size * tetrion.rows;
}

