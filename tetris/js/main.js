var canvas = document.getElementById("mycanvas");
var body = document.body;
var mc = new Hammer(body);
mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
var ctxt = canvas.getContext("2d");
var dropSpeed = 500;
var rows = 20;
var columns = 10;
var size = 30;//canvas.height / rows;
var field = createMatrix(columns,rows);
var colorField = createMatrix(columns,rows);
var score = 0;
var activeBlock = new Block(0);
var dropPosition = activeBlock.dropPosition();
var scoreCell = $("#scoreCell");
scoreCell.text(score);
fitToContainer(canvas);

function fitToContainer(canvas){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    //canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    //canvas.height = canvas.offsetHeight;
}

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
    //ctxt.strokeRect(0,0,columns * size, rows * size);
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

mc.on("swipeleft", function(ev) {
    activeBlock.moveLeft();
});

mc.on("swiperight", function(ev) {
    activeBlock.moveRight();
});

mc.on("tap", function(ev) {
    activeBlock.rotate();
});

mc.on("swipedown", function(ev) {
    activeBlock.sonicDrop();
});