function Matrix(){

}

Matrix.prototype.transpose = function(grid){
    var newMatrix = createMatrix(4,grid.length);
    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[0].length; x++) {
            newMatrix[y][x] = grid[x][y];
        }
    }
    return newMatrix;
};


Matrix.prototype.reverseRows = function(grid){
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