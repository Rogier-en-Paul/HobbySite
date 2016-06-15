var canvas = document.getElementById("mycanvas");
var container = document.getElementById("container");
window.addEventListener("resize",resize);
var ctxt = canvas.getContext("2d");
var size;
var body = document.body;
var mc = new Hammer(document);
mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
var tetrion = new Tetrion();

resize();
document.body.addEventListener("keydown", function (e) {
    if (e.keyCode == 87 || e.keyCode == 38) {//w
        tetrion.activeTetromino.rotate(tetrion.matrix);
    }
    if (e.keyCode == 83 || e.keyCode == 40) {//s
        tetrion.timerReset();
        var oldPosition = tetrion.activeTetromino.position;
        tetrion.activeTetromino.firmDrop(tetrion.matrix);
        if(tetrion.activeTetromino.position.equals(oldPosition))tetrion.placeActiveTetromino();
    }
    if (e.keyCode == 65 || e.keyCode == 37) {//a
        tetrion.activeTetromino.move(new Vector(-1,0), tetrion.matrix);
    }
    if (e.keyCode == 68 || e.keyCode == 39) {//d
        tetrion.activeTetromino.move(new Vector(1,0), tetrion.matrix);
    }
    if (e.keyCode == 67) {//c
        tetrion.hold();
    }
    if (e.keyCode == 191) {//c
        tetrion.timerReset();
        tetrion.spawnTetromino();
    }
    tetrion.dropPosition = tetrion.activeTetromino.dropPosition(tetrion.matrix);
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
        tetrion.activeTetromino.move(new Vector(-1,0), tetrion.matrix);
        tetrion.dropPosition = tetrion.activeTetromino.dropPosition(tetrion.matrix);
        tetrion.draw();
    }

});

mc.on("panright", function(ev) {
    distanceTraveled += Math.abs(ev.deltaX - oldDistanceTraveled);
    oldDistanceTraveled = ev.deltaX;
    if(distanceTraveled > sensitivity) {
        distanceTraveled = 0;
        tetrion.activeTetromino.move(new Vector(1,0), tetrion.matrix);
        tetrion.dropPosition = tetrion.activeTetromino.dropPosition(tetrion.matrix);
        tetrion.draw();
    }
});

mc.on("panend", function(ev) {
    distanceTraveled = 0;
    oldDistanceTraveled = 0;
});

mc.on("tap", function(ev) {
    tetrion.activeTetromino.rotate(tetrion.matrix);
    tetrion.dropPosition = tetrion.activeTetromino.dropPosition(tetrion.matrix);
    tetrion.draw();
});

mc.on("swipedown", function(ev) {
    tetrion.timerReset();
    tetrion.activeTetromino.firmDrop(tetrion.matrix);
    if(tetrion.activeTetromino.position.equals(tetrion.activeTetromino.dropPosition))tetrion.placeActiveTetromino();
    tetrion.dropPosition = tetrion.activeTetromino.dropPosition(tetrion.matrix);
    tetrion.draw();
});

mc.on("swipeup", function(ev) {
    tetrion.hold();
    tetrion.dropPosition = tetrion.activeTetromino.dropPosition(tetrion.matrix);
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

