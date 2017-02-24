var symbolSize = 12;
var lastUpdate = Date.now()
var dt = 0;
// var gridSize = new Vector2(Math.floor(window.innerWidth / symbolSize), Math.floor(window.innerHeight / symbolSize))
var gridSize = new Vector2(100, 60)
var gridsm = gridSize.c().sub(new Vector2(1,1))
var grid = create2dArray(gridSize, null)

var streams = [];
var lastSpawn = Date.now();
var timeBetweenSpawn = 50;

function setup(){
    textSize(symbolSize)
    textAlign(TOP,BOTTOM)
    createCanvas(window.innerWidth - 4,window.innerHeight - 4)
    gridsm.loop((a) => {
        var symbol = new Symbol(new Vector2(a[0], a[1]));
        grid[a[0]][a[1]] = symbol
        if(Math.random() > 0.95)symbol.changespeed = random(100,200)
    })
    
    var urlparam = getURLParameter('name')
    var string = 'THE MATRIX'
    if(urlparam)string = urlparam;
    var v = new Vector2(40,40)
    stamp(string, v)
    for(var x = v.x; x < v.x + string.length; x++){
        streams.push(new Stream(new Vector2(x, 0)));
    }
}

function stamp(string, vec){
    var y = vec.y
    for(var x = 0; x < string.length; x++){
        var symbol = new Symbol(new Vector2(x + vec.x,y), string[x])
        symbol.changespeed = 9999999999;
        symbol.maxage = 8;
        symbol.age = 8;
        // symbol.highlight = true;
        grid[symbol.pos.x][symbol.pos.y] = symbol
    }
}

function draw(){
    background(0);
    var now = Date.now();
    dt = (now - lastUpdate) / 1000;
    lastUpdate = now;
    // console.log(1/dt)
    gridsm.loop((a) => {
        grid[a[0]][a[1]].update();
        grid[a[0]][a[1]].render();
    })

    if((Date.now() - lastSpawn) > timeBetweenSpawn){
        lastSpawn = Date.now();
        streams.push(new Stream(new Vector2(round(random(0, gridsm.x)),0)));
    }

    for(var i = 0; i < streams.length;i++){
        var stream = streams[i];
        stream.update();
        if(stream.pos.y > gridsm.y){
            streams.splice(i,1)
            continue;
        }
        stream.draw();
    }
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}