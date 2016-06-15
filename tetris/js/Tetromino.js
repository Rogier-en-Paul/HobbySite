function Tetromino(type){
    this.color = type;
    this.position = new Vector(3,0);
    this.grid = tetrominoes[type][0];
    this.type = type;
    this.rotation = 0;
}

Tetromino.prototype.firmDrop = function(matrix){
    this.position = this.dropPosition(matrix);
};

Tetromino.prototype.move = function(translation,matrix){
    var oldPosition = this.position;
    this.position = this.position.add(translation);
    if(this.collides(matrix)){
        this.position = oldPosition;
        return false;
    }
    return true;
};

Tetromino.prototype.rotate = function(matrix){
    var oldGrid = this.grid;
    this.rotation++;
    this.rotation %= tetrominoes[this.type].length;
    this.grid = tetrominoes[this.type][this.rotation];

    if(this.collides(matrix)){
        if(this.wallKick(matrix)) return true;
        this.grid = oldGrid;
        return false;
    }
    return true;
};

Tetromino.prototype.dropPosition = function(matrix){
    var originalPosition = this.position;

    //var dropPosition = this.position.add(new Vector(0,0));

    while(!this.collides(matrix)){
        this.position = this.position.add(new Vector(0,1));
    }
    this.position = this.position.add(new Vector(0, -1));
    var dropPosition = this.position.clone();
    this.position = originalPosition;
    return dropPosition;
};

Tetromino.prototype.wallKick = function (matrix) {//returns true if the wallkick was succesfull
    //wallkick not working right now bebause this.collides doesnt take the left and right vectors
    var originalPosition = this.position;
    this.position = originalPosition.add(new Vector(-1,0));//left
    if(this.collides(matrix)){
        if(this.type == 0){//I tetromino
            this.position = originalPosition.add(new Vector(-2,0));
            if(!this.collides(matrix)){
                return true;
            }
        }
    }else return true;
    this.position = originalPosition.add(new Vector(1,0));//right
    if(!this.collides(matrix)){
        return true;
    }
    this.position = originalPosition;
    return false;
};

Tetromino.prototype.collides = function(matrix){
    for (var y = 0; y < this.grid.length; y++) {
        for (var x = 0; x < this.grid[0].length; x++) {
            if(this.grid[y][x] == 1){
                var spotToCheck = this.position.add(new Vector(x,y));

                if(spotToCheck.x >= matrix[0].length || spotToCheck.x < 0)return true;
                if(spotToCheck.y >= matrix.length)return true;
                if(matrix[spotToCheck.y][spotToCheck.x] == 1)return true
            }
        }
    }
    return false;
};

Tetromino.prototype.draw = function(vector, color){
    if(color)ctxt.fillStyle = color;
    else ctxt.fillStyle = colors[this.color];

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






