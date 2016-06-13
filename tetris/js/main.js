var canvas = document.getElementById("mycanvas");
var container = document.getElementById("container");
var ctxt = canvas.getContext("2d");


var rows = 20;
var columns = 10;
var size;

//canvas.height = size * rows;
resize();
var body = document.body;
var mc = new Hammer(document);
mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
var dropSpeed = 500;
var field = createMatrix(columns,rows);
var colorField = createMatrix(columns,rows);
var score = 0;
var activeBlock = new Block(0);
var dropPosition = activeBlock.dropPosition();



var blockBuffer = [];
for (var i = 0; i < 3; i++)blockBuffer.push(new Block(Math.floor(Math.random() * tetrominoes.length)));

draw();
var timer = setInterval(update,dropSpeed);

function update(){
    activeBlock.moveDown();
    draw();
}

function draw(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    ctxt.fillRect(0,0,columns * size, rows * size);
    ctxt.fillStyle = "#222";
    ctxt.fillRect(columns * size,0,canvas.width * size - canvas.width, canvas.height);
    ctxt.fillStyle = "#000";
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            if(field[y][x] == 1){
                ctxt.fillStyle = colorField[y][x];
                ctxt.fillRect(x * size, y * size, size, size)
            }
        }
    }
    ctxt.fillStyle = "#000";
    activeBlock.draw(dropPosition,"#444");
    activeBlock.draw(activeBlock.position,activeBlock.color);

    for (var i = 0; i < blockBuffer.length; i++) {
        blockBuffer[i].draw(new Vector(12, 1 + i * 3),blockBuffer[i].color)
    }
    ctxt.fillStyle = "#fff";
    ctxt.font = "30px Arial";
    ctxt.fillText(""+score,canvas.width / 2 + 2 * size,canvas.height - 4 * size);
    ctxt.fillStyle = "#000";
}

document.body.addEventListener("keydown", function (e) {
    if (e.keyCode == 87 || e.keyCode == 38) {//w
        activeBlock.rotate();
    }
    if (e.keyCode == 83 || e.keyCode == 40) {//s
        activeBlock.sonicDrop();
    }
    if (e.keyCode == 65 || e.keyCode == 37) {//a
        activeBlock.moveLeft();
    }
    if (e.keyCode == 68 || e.keyCode == 39) {//d
        activeBlock.moveRight();
    }
    draw();
});

function createMatrix(x,y){
    var newMatrix = [];
    for (var i = 0; i < y; i++) {
        newMatrix[i] = [];
        for (var j = 0; j < x; j++) {
            newMatrix[i][j] = 0;
        }
    }
    return newMatrix;
}
var distanceTraveled = 0;
var oldDistanceTraveled = 0;
var sensitivity = 50;

mc.on("panleft", function(ev) {
    distanceTraveled += Math.abs(ev.deltaX - oldDistanceTraveled);
    oldDistanceTraveled = ev.deltaX;
    if(distanceTraveled > sensitivity){
        distanceTraveled = 0;
        activeBlock.moveLeft();
        draw();
    }

});

mc.on("panright", function(ev) {
    distanceTraveled += Math.abs(ev.deltaX - oldDistanceTraveled);
    oldDistanceTraveled = ev.deltaX;
    if(distanceTraveled > sensitivity) {
        distanceTraveled = 0;
        activeBlock.moveRight();
        draw();
    }
});

mc.on("panend", function(ev) {
    distanceTraveled = 0;
    oldDistanceTraveled = 0;
});

mc.on("tap", function(ev) {
    activeBlock.rotate();
    draw();
});

mc.on("swipedown", function(ev) {
    activeBlock.sonicDrop();
    draw();
});


function resize(){
    console.log(container.clientHeight);
    console.log(screen.height);
    var maxwidth = container.clientWidth;
    var maxheight = screen.height - 200;
    var maxWidthSize = Math.floor(maxwidth / 2.5 / columns);
    var maxHeightSize = Math.floor(maxheight / rows);
    if(maxWidthSize > maxHeightSize) size = maxHeightSize;
    else size = maxWidthSize;
    canvas.width  = columns * size * 2 + 1;
    canvas.height = size * rows;
}

window.addEventListener("resize",resize);