var Point = function(x,y){
    this.x = x;
    this.y = y;
    function checkTile(x,y){
        if(grid[x][y-1] == 0 && grid[x][y-1] != undefined){
            return new Point(x,y);
        }
    }
};

Point.prototype.getAdjacentTiles = function(){
    var adjacentTiles = [];
    adjacentTiles.push(checkTile(this.x,this.y - 1));
    adjacentTiles.push(checkTile(this.x - 1,this.y));
    adjacentTiles.push(checkTile(this.x,this.y + 1));
    adjacentTiles.push(checkTile(this.x + 1,this.y));
    return adjacentTiles;
};