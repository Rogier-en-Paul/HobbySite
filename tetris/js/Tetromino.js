function Tetromino(type,tetrion){
    this.tetrion = tetrion;
    this.color = colors[type];
    this.position = new Vector(4,0);
    this.grid = tetrominoes[type][0];
    this.type = type;
    this.rotation = 0;
}

Tetromino.prototype.dropPosition = function(){
    var dropPosition = this.position.add(new Vector(0,0));
    var next = dropPosition;
    while(!this.collides(next)){
        dropPosition = next;
        next = dropPosition.add(new Vector(0,1));
    }
    return dropPosition;
};

Tetromino.prototype.collides = function(position){
    for (var y = 0; y < this.grid.length; y++) {
        for (var x = 0; x < this.grid[0].length; x++) {
            if(this.grid[y][x] == 1){
                var spotToCheck = position.add(new Vector(x,y));

                if(spotToCheck.x >= this.tetrion.columns || spotToCheck.x < 0)return true;
                if(spotToCheck.y >= this.tetrion.rows)return true;
                if(this.tetrion.matrix[spotToCheck.y][spotToCheck.x] == 1)return true
            }
        }
    }
    return false;
};



Tetromino.prototype.firmDrop = function(){
    this.tetrion.timerReset();
    var dropPosition = this.dropPosition();
    if(this.position.equals(dropPosition)){
        this.tetrion.placeTetromino();
    }else{
        this.position = dropPosition;
    }
};

Tetromino.prototype.moveDown = function(){
    if(this.collides(this.position.add(new Vector(0,1)))){
        this.tetrion.placeTetromino();
    }else this.position.y++;
};

Tetromino.prototype.moveRight = function(){
    var newPosition = this.position.add(new Vector(1,0));
    if(this.collides(newPosition)){
        return;
    }
    this.position = newPosition;
};

Tetromino.prototype.moveLeft = function(){
    var newPosition = this.position.add(new Vector(-1,0));
    if(this.collides(newPosition)){
        return;
    }
    this.position = newPosition;
};

Tetromino.prototype.rotate = function(){
    var oldGrid = this.grid;
    this.rotation++;
    this.rotation %= tetrominoes[this.type].length;
    this.grid = tetrominoes[this.type][this.rotation];

    if(this.collides(this.position)){
        if(!this.wallKick())this.grid = oldGrid;
    }

};

Tetromino.prototype.wallKick = function () {//returns true if the wallkick was succesfull
    var left = this.position.add(new Vector(-1,0));
    var right = this.position.add(new Vector(1,0));
    if(!this.collides(left)){
        this.position = left;
        return true;
    }
    else if(!this.collides(right)){
        this.position = right;
        return true;
    }
    else return false;
};



Tetromino.prototype.draw = function(vector, color){
    if(color)ctxt.fillStyle = color;
    else ctxt.fillStyle = this.color;

    for (var y = 0; y < this.grid.length; y++) {
        for (var x = 0; x < this.grid[0].length; x++) {
            if(this.grid[y][x] == 1){
                var spotToDraw = vector.add(new Vector(x, y));
                ctxt.fillRect(spotToDraw.x * size, spotToDraw.y * size, size, size)
            }
        }
    }
    ctxt.fillStyle = "#000";
};






