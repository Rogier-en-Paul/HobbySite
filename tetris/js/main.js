var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");
var dropSpeed = 500;
var rows = 20;
var columns = 10;
var field = createMatrix(columns,rows);
var colorField = createMatrix(columns,rows);

var activeBlock = new Block(0);
var dropPosition = activeBlock.dropPosition();

draw();
var timer = setInterval(update,dropSpeed);

function update(){
    activeBlock.moveDown();
    draw();
}

function draw(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    var size = 20;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            if(field[y][x] == 1){
                ctxt.fillRect(x * size, y * size, size, size)
            }
        }
    }
    for (y = 0; y < activeBlock.grid.length; y++) {
        for (x = 0; x < activeBlock.grid[0].length; x++) {
            if(activeBlock.grid[y][x] == 1){
                var spotToDraw = activeBlock.position.add(new Vector(x, y));
                ctxt.fillRect(spotToDraw.x * size, spotToDraw.y * size, size, size)
            }
        }
    }
    ctxt.strokeRect(0,0,columns * size, rows * size);
}

document.body.addEventListener("keypress", function (e) {
    console.log(e.keyCode);
    if (e.keyCode == 119) {//w
        activeBlock.rotate();
    }
    if (e.keyCode == 115) {//s
        activeBlock.hardDrop();
    }
    if (e.keyCode == 97) {//a
        activeBlock.moveLeft();
    }
    if (e.keyCode == 100) {//d
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