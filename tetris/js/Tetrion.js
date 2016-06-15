function Tetrion(){
    this.columns = 10;
    this.rows = 20;
    this.dropSpeed = 500;
    this.randomBag = this.generateBag();
    this.matrix = createMatrix(this.columns, this.rows);
    this.colorMatrix = createMatrix(this.columns, this.rows);
    this.activeTetromino = this.randomBag.shift();
    this.dropPosition = this.activeTetromino.dropPosition(this.matrix);
    this.tetrominoBuffer = this.randomBag.splice(0,3);
    this.timer = setInterval(this.update,this.dropSpeed);
    this.score = 0;
    this.holdLocked = false;
}

Tetrion.prototype.update = function(){
    //stupid javascript using the window object to call update instead of having Tetrion call it

    if(!tetrion.activeTetromino.move(new Vector(0,1),tetrion.matrix)){
        tetrion.placeActiveTetromino();
    }
    tetrion.draw();
};

Tetrion.prototype.reset = function(){
    this.matrix = createMatrix(this.columns,this.rows);
    this.randomBag = this.generateBag();
    this.activeTetromino = this.randomBag.shift();
    this.tetrominoBuffer = this.randomBag.splice(0,3);this.score = 0;
    this.holdTetromino = null;
};

Tetrion.prototype.hold = function(){
    if(this.holdLocked)return;
    this.holdLocked = true;
    this.timerReset();
    if(!this.holdTetromino){//no tetromino is being held
        this.holdTetromino = this.activeTetromino;
        this.spawnTetromino()
    }
    else{
        var temp = this.holdTetromino;
        this.holdTetromino = this.activeTetromino;
        this.activeTetromino = temp;
        this.activeTetromino.position = new Vector(4,0);
        if(this.activeTetromino.collides(this.matrix)){//game over
            this.reset();
        }
        this.dropPosition = this.activeTetromino.dropPosition(this.matrix);
    }
};

Tetrion.prototype.timerReset = function(){
    clearInterval(this.timer);
    this.timer = setInterval(this.update, this.dropSpeed);
};

Tetrion.prototype.placeActiveTetromino = function(){
    this.lock(this.activeTetromino);
    this.spawnTetromino();
};

Tetrion.prototype.spawnTetromino = function(){
    this.tetrominoBuffer.push(this.randomBag.shift());
    if(this.randomBag.length == 0)this.randomBag = this.generateBag();
    this.activeTetromino = this.tetrominoBuffer.shift();
    if(this.activeTetromino.collides(this.matrix)){//game over
        this.reset();
    }
    this.dropPosition = this.activeTetromino.dropPosition(this.matrix);
};

Tetrion.prototype.lock = function(tetromino){
    var markedForDeletion = [];
    for (var y = 0; y < tetromino.grid.length && tetromino.position.y + y < this.rows; y++) {
        for (var x = 0; x < tetromino.grid[0].length; x++) {
            if(tetromino.grid[y][x] == 1){
                this.matrix[tetromino.position.y + y][tetromino.position.x + x] = 1;
                this.colorMatrix[tetromino.position.y + y][tetromino.position.x + x] = tetromino.color;
            }
        }

        //finding complete rows
        var complete = true;
        for(x = 0;x < this.columns; x++){
            if(tetromino.position.y + y < this.rows && this.matrix[tetromino.position.y + y][x] == 0){
                complete = false;
                break;
            }
        }
        if(complete)markedForDeletion.push(tetromino.position.y + y)
    }
    //deleting complete rows
    for(var i = 0; i < markedForDeletion.length; i++){
        this.matrix[markedForDeletion[i]] = [0,0,0,0,0,0,0,0,0,0];
        for(y = markedForDeletion[i]; y >= 1; y--){
            var temp = this.matrix[y];
            this.matrix[y] = this.matrix[y - 1];
            this.matrix[y - 1] = temp;
        }
    }
    this.holdLocked = false;
    this.score += Math.pow(markedForDeletion.length, 2);
};

Tetrion.prototype.generateBag = function(){
    var tetrominoeBag = [];
    for (var i = 0; i < tetrominoes.length * 3; i++)tetrominoeBag.push(new Tetromino(i % tetrominoes.length));
    var range = tetrominoeBag.length - 1;
    while(range >= 0){
        swap(tetrominoeBag, range, Math.floor(Math.random() * range));
        range--;
    }
    return tetrominoeBag;
};

Tetrion.prototype.draw = function(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    ctxt.fillRect(0,0,this.columns * size, this.rows * size);
    ctxt.fillStyle = "#222";
    ctxt.fillRect(this.columns * size,0,canvas.width * size - canvas.width, canvas.height);
    ctxt.fillStyle = "#000";
    for (var y = 0; y < this.rows; y++) {
        for (var x = 0; x < this.columns; x++) {
            if(this.matrix[y][x] == 1){
                ctxt.fillStyle = colors[this.colorMatrix[y][x]];
                ctxt.fillRect(x * size, y * size, size, size)
            }
        }
    }
    ctxt.fillStyle = "#000";
    this.activeTetromino.draw(this.dropPosition,"#444");
    this.activeTetromino.draw(this.activeTetromino.position);

    for (var i = 0; i < this.tetrominoBuffer.length; i++) {
        this.tetrominoBuffer[i].draw(new Vector(11, 1 + i * 3))
    }
    if(this.holdTetromino)this.holdTetromino.draw(new Vector(16, 1));
    ctxt.fillStyle = "#fff";
    ctxt.font = "30px Arial";
    ctxt.fillText("" + this.score,canvas.width / 2 + 2 * size,canvas.height - 4 * size);
    ctxt.fillStyle = "#000";
};

function swap(array, a ,b){
    var temp = array[a];
    array[a] = array[b];
    array[b] = temp;
}

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
