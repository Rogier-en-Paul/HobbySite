var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");
ctxt.strokeStyle = '#e1e1e1';
ctxt.fillStyle = 'cadetblue';
var cells = init();

setInterval(function(){
    draw();
    update();
},100);

function update(){
    cells = nextUniverse();
}

function init(){
    cells = [];
    for (var x = 0; x < 64; x++) {
        cells[x] = [];
        for (var y = 0; y < 64; y++) {
            cells[x][y] = 0;
            
        }
    }
    //[
    //    [19, 20],[20,20],[21, 20]
    //].forEach(function(point) {
    //    cells[point[0]][point[1]] = 1;
    //});
    [
        // Gosper glider gun
        [1, 5],[1, 6],[2, 5],[2, 6],[11, 5],[11, 6],[11, 7],[12, 4],[12, 8],[13, 3],[13, 9],[14, 3],[14, 9],[15, 6],[16, 4],[16, 8],[17, 5],[17, 6],[17, 7],[18, 6],[21, 3],[21, 4],[21, 5],[22, 3],[22, 4],[22, 5],[23, 2],[23, 6],[25, 1],[25, 2],[25, 6],[25, 7],[35, 3],[35, 4],[36, 3],[36, 4],

        // Random cells
        // If you wait enough time these will eventually take part
        // in destroying the glider gun, and the simulation will be in a "static" state.
        [60, 47],[61,47],[62,47],
        [60, 48],[61,48],[62,48],
        [60, 49],[61,49],[62,49],
        [60, 51],[61,51],[62,51],
    ]
        .forEach(function(point) {
            cells[point[0]][point[1]] = 1;
        });

    return cells;
}

function nextUniverse(){
    var nextUniverse = [];
    for (var x = 0; x < 64; x++) {
        nextUniverse[x] = [];
        for (var y = 0; y < 64; y++) {
            nextUniverse[x][y] = nextState(x,y);
        }
    }
    return nextUniverse;
}

function nextState(x,y){
    var lifeneighbours = countNeighbours(x, y);
    if(cells[x][y] == 1){
        if(lifeneighbours < 2)return 0;
        else if(lifeneighbours > 3)return 0;
        else return 1;
    }else{
        if(lifeneighbours == 3)return 1;
    }
}

function countNeighbours(x, y){
    var amount = 0;
    function isFilled(x, y) {
        return cells[x] && cells[x][y];
    }

    if (isFilled(x-1, y-1)) amount++;
    if (isFilled(x,   y-1)) amount++;
    if (isFilled(x+1, y-1)) amount++;
    if (isFilled(x-1, y  )) amount++;
    if (isFilled(x+1, y  )) amount++;
    if (isFilled(x-1, y+1)) amount++;
    if (isFilled(x,   y+1)) amount++;
    if (isFilled(x+1, y+1)) amount++;
    return amount;
}

function draw() {
    ctxt.clearRect(0, 0, 512, 512);
    var size = 8;
    cells.forEach(function(row, x) {
        row.forEach(function(cell, y) {
            ctxt.beginPath();

            ctxt.rect(x*size, y*size, size, size);
            if (cell == 1) {
                ctxt.fill();
            } else {
                ctxt.stroke();
            }
        });
    });
}
