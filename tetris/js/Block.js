function Block(type){
    this.color = colors[type];
    this.position = new Vector(4,0);
    this.grid = tetrominoes[type][0];
    this.type = type;
    this.rotation = 0;
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



Block.prototype.collides = function(position){
    for (var y = 0; y < this.grid.length; y++) {
        for (var x = 0; x < this.grid[0].length; x++) {
            if(this.grid[y][x] == 1){
                var spotToCheck = position.add(new Vector(x,y));

                if(spotToCheck.x >= columns || spotToCheck.x < 0)return true;
                if(spotToCheck.y >= rows)return true;
                if(field[spotToCheck.y][spotToCheck.x] == 1)return true
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
                colorField[this.position.y + y][this.position.x + x] = this.color;
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
    for(var i = 0; i < markedForDeletion.length; i++){
        field[markedForDeletion[i]] = [0,0,0,0,0,0,0,0,0,0];
        for(y = markedForDeletion[i]; y >= 1; y--){
            var temp = field[y];
            field[y] = field[y - 1];
            field[y - 1] = temp;
        }
    }
    score += Math.pow(markedForDeletion.length, 2);
};

Block.prototype.sonicDrop = function(){
    clearInterval(timer);
    timer = setInterval(update, dropSpeed);
    dropPosition = activeBlock.dropPosition();
    if(this.position.equals(dropPosition)){
        Block.placeBlock();
    }else{
        this.position = dropPosition;
    }
};

Block.prototype.moveDown = function(){
    if(this.collides(this.position.add(new Vector(0,1)))){
        Block.placeBlock();
    }else this.position.y++;
};

Block.prototype.moveRight = function(){
    var newPosition = this.position.add(new Vector(1,0));
    if(this.collides(newPosition)){
        return;
    }
    this.position = newPosition;
    dropPosition = activeBlock.dropPosition();
};

Block.prototype.moveLeft = function(){
    var newPosition = this.position.add(new Vector(-1,0));
    if(this.collides(newPosition)){
        return;
    }
    this.position = newPosition;
    dropPosition = activeBlock.dropPosition();
};

Block.prototype.rotate = function(){
    var oldGrid = this.grid;
    this.rotation++;
    this.rotation %= tetrominoes[this.type].length;
    this.grid = tetrominoes[this.type][this.rotation];

    if(this.collides(this.position)){
        if(this.wallKick())dropPosition = activeBlock.dropPosition();
        else this.grid = oldGrid;
    }else dropPosition = activeBlock.dropPosition()

};

Block.prototype.wallKick = function () {//returns if the wallkick was succesfull
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

Block.placeBlock = function(){
    activeBlock.lock();
    blockBuffer.push(new Block(Math.floor(Math.random() * tetrominoes.length)));
    activeBlock = blockBuffer.shift();
    if(activeBlock.collides(activeBlock.position)){//game over
        field = createMatrix(columns,rows);
        score = 0;
    }
    dropPosition = activeBlock.dropPosition();
};

Block.prototype.draw = function(vector, color){
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




