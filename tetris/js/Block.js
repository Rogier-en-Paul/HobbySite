function Block(type){
    this.color = [255,0,0];
    this.position = new Vector(4,0);
    this.grid = blockTypes[type];
}

Block.prototype.dropPosition = function(){
    var dropPosition = this.position.add(new Vector(0,0));
    var next = dropPosition;
    while(!this.collides(next)){
        dropPosition = next;
        next = dropPosition.add(new Vector(0,1));
    }
    return dropPosition;
};

Block.prototype.hardDrop = function(){
    clearInterval(timer);
    timer = setInterval(update, dropSpeed);
    if(this.position.equals(dropPosition)){
        activeBlock.lock();
        activeBlock = new Block(Math.floor(Math.random() * blockTypes.length));
        if(activeBlock.collides(activeBlock.position))field = createMatrix(columns,rows);//game over
        dropPosition = activeBlock.dropPosition();
    }else{
        this.position = dropPosition;
    }
};

Block.prototype.collides = function(position){
    for (var y = 0; y < this.grid.length; y++) {
        for (var x = 0; x < this.grid[0].length; x++) {
            if(this.grid[y][x] == 1){
                var spotToCheck = position.add(new Vector(x,y));

                //if(spotToCheck.x >= columns || spotToCheck.x < 0)return true;
                if(spotToCheck.y >= rows)return true;
                if(field[spotToCheck.y][spotToCheck.x] == 1)return true
            }
        }
    }
    return false;
};

Block.prototype.clone = function(){
    var clone = new Block(0);
    clone.grid = this.grid;
    clone.position = this.position.add(new Vector(0,0));
    clone.color = this.color.slice(0);
};

Block.prototype.wallCollides = function(position){
    for (var y = 0; y < this.grid.length; y++) {
        for (var x = 0; x < this.grid[0].length; x++) {
            if(this.grid[y][x] == 1){
                var spotToCheck = position.add(new Vector(x,y));

                if(spotToCheck.x >= columns || spotToCheck.x < 0)return true;
            }
        }
    }
    return false;
};



Block.prototype.lock = function(){
    var markedForDeletion = [];
    for (var y = 0; y < this.grid.length && this.position.y + y < rows; y++) {
        for (var x = 0; x < this.grid[0].length; x++) {
            if(this.grid[y][x] == 1){
                field[this.position.y + y][this.position.x + x] = 1;
            }
        }

        //finding complete rows
        var complete = true;
        for(x = 0;x < columns; x++){
            if(this.position.y + y < rows && field[this.position.y + y][x] == 0){
                complete = false;
                break;
            }
        }
        if(complete)markedForDeletion.push(this.position.y + y)
    }
    //deleting complete rows
    for(var i = markedForDeletion.length - 1; i >= 0; i--){
        field[markedForDeletion[i]] = [0,0,0,0,0,0,0,0,0,0];
        for(y = markedForDeletion[i]; y >= 1; y--){
            var temp = field[y];
            field[y] = field[y - 1];
            field[y - 1] = temp;
        }
    }
};

Block.prototype.moveDown = function(){
    if(this.collides(this.position.add(new Vector(0,1)))){
        activeBlock.lock();
        activeBlock = new Block(Math.floor(Math.random() * blockTypes.length));
        if(activeBlock.collides(activeBlock.position))field = createMatrix(columns,rows);//game over
        dropPosition = activeBlock.dropPosition();
    }else this.position.y++;
};

Block.prototype.moveRight = function(){
    var newPosition = this.position.add(new Vector(1,0));
    if(this.wallCollides(newPosition))return;
    if(this.collides(newPosition)){
        return;
    }
    this.position = newPosition;
    dropPosition = this.dropPosition();
};

Block.prototype.moveLeft = function(){
    var newPosition = this.position.add(new Vector(-1,0));
    if(this.wallCollides(newPosition))return;
    if(this.collides(newPosition)){
        return;
    }
    this.position = newPosition;
    dropPosition = this.dropPosition();
};

Block.prototype.rotate = function(){
    var oldGrid = this.grid;
    this.grid = Block.reverseRows(Block.transpose(this.grid));
    if(this.wallCollides(this.position)){
        this.grid = oldGrid;
        return;
    }
    if(this.collides(this.position)){
        this.grid = oldGrid;
        return;
    }
    dropPosition = this.dropPosition();

};

Block.transpose = function(grid){
    var newMatrix = createMatrix(4,grid.length);
    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[0].length; x++) {
            newMatrix[y][x] = grid[x][y];
        }
    }
    return newMatrix;
};


Block.reverseRows = function(grid){
    var newMatrix = createMatrix(4,4);
    for (var y = 0; y < grid.length; y++){
        var reversedRow = [];
        for (var x = 0; x < grid[0].length; x++) {
            reversedRow[grid[0].length - x - 1] = grid[y][x]
        }
        newMatrix[y] = reversedRow;
    }
    return newMatrix;
};

var blockTypes = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1],
        [1,1]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [0,0,0],
        [1,1,1],
        [0,1,0]
    ],
    [

        [1,1,0],
        [0,1,1],
        [0,0,0]
    ]
];