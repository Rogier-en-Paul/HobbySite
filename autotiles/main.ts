/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/ability.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="autotile.ts" />
/// <reference path="projectutils.ts" />
/// <reference path="list.ts" />
/// <reference path="sprite.ts" />



var colors = ['white','red','blue','purple','pink','orange','yellow','green','cyan','brown','coral','crimson','deeppink','violet','black','lawngreen','lightgreen']
var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt
ctxt.imageSmoothingEnabled = false;
var tilesize = new Vector(32,32)

//take a list of tiles in order each tile has a rule that looks at its surroundings
//the first tile that passes it's rule gets placed at that spot else leave unchanged/zero
enum PaintMode{erase,fill}
var paintmode = PaintMode.fill
var mousepos = startMouseListen(canvas)




var imagenames = ['void','surrounded','cornertl','openwalltm','ml1neighbour','alone','2neighboursopposite','error','filled','boxcorner','boxinnercorner','openwall']
loadImages(imagenames.map(image => `res/${image}.png` )).then(images => {
    var autotiler = new AutoTiler()
    var spritestore = new Store<Sprite>()
    var voidsprite = spritestore.add(new Sprite(images[0],0,ctxt))
    // var surroundSprite = spritestore.add(new Sprite(images[1],0,ctxt)) 
    // var cornersprites = Sprite.rotated(images[2],ctxt).map(s => spritestore.add(s))
    // var threeneighbours = Sprite.rotated(images[3],ctxt).map(s => spritestore.add(s))
    // var oneneighbour = Sprite.rotated(images[4],ctxt).map(s => spritestore.add(s))
    // var twoneigboursoppositevert = spritestore.add(new Sprite(images[6],0.25,ctxt))
    // var twoneigboursoppositehor = spritestore.add(new Sprite(images[6],0,ctxt))
    // var alone = spritestore.add(new Sprite(images[5],0,ctxt)) 
    var error = spritestore.add(new Sprite(images[7],0,ctxt))

    var filled = spritestore.add(new Sprite(images[8],0,ctxt))
    var boxcorner = Sprite.rotated(images[9],ctxt).map(s => spritestore.add(s))
    var boxinnercorner = Sprite.rotated(images[10],ctxt).map(s => spritestore.add(s))
    var openwall = Sprite.rotated(images[11],ctxt).map(s => spritestore.add(s))

    

    autotiler.setup(new List2D( new Vector(100,50),0))
    var savedinput =  localStorage.getItem('input')
    if(savedinput != null){
        var res = JSON.parse(savedinput)
        autotiler.input.arr = res.arr
    }
     

    // autotiler.tiles = [
    //     normalRule(voidsprite.id,new Map([[Directions.mm,0]])),
    //     normalRule(surroundSprite.id, new Map([[Directions.ml,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,1],[Directions.mm,1]])),//surrounded by cardinal directions/ center piece
    //     ...rotated(cornersprites.map(s => s.id), new Map([[Directions.ml,0],[Directions.tm,0],[Directions.mr,1],[Directions.bm,1],[Directions.mm,1]])),//tl corner piece
    //     ...rotated(threeneighbours.map(s => s.id), new Map([[Directions.ml,1],[Directions.tm,0],[Directions.mr,1],[Directions.bm,1],[Directions.mm,1]])),//tm 3 neighbours wall piece
    //     ...rotated(oneneighbour.map(s => s.id), new Map([[Directions.ml,0],[Directions.tm,0],[Directions.mr,1],[Directions.bm,0],[Directions.mm,1]])),//ml 1 neighbour
    //     normalRule(twoneigboursoppositevert.id, new Map([[Directions.ml,0],[Directions.tm,1],[Directions.mr,0],[Directions.bm,1],[Directions.mm,1]])),// 2 neighbours opposite vertical
    //     normalRule(twoneigboursoppositehor.id, new Map([[Directions.ml,1],[Directions.tm,0],[Directions.mr,1],[Directions.bm,0],[Directions.mm,1]])),// 2 neighbours opposite horizontal
    //     normalRule(alone.id, new Map([[Directions.ml,0],[Directions.tm,0],[Directions.mr,0],[Directions.bm,0],[Directions.mm,1]])),//alone
    //     normalRule(error.id, new Map([[Directions.mm,1]])),//default catch rule (something went wrong if you see this one)
    // ]

    autotiler.tiles = [
        // normalRule(voidsprite.id,new Map([[Directions.mm,0]])),
        normalRule(filled.id,new Map([[Directions.mm,0]])),
        ...rotated(boxinnercorner.map(s => s.id), new Map([[Directions.ml,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,1],[Directions.bl,0],[Directions.tl,1],[Directions.tr,1],[Directions.br,1],[Directions.mm,1]])),
        normalRule(filled.id,new Map([[Directions.ml,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,1],[Directions.tl,1],[Directions.tr,1],[Directions.bl,1],[Directions.br,1],[Directions.mm,1]])),
        ...rotated(boxcorner.map(s => s.id), new Map([[Directions.ml,0],[Directions.tm,0],[Directions.mr,1],[Directions.bm,1],[Directions.br,1],[Directions.mm,1]])),
        ...rotated(openwall.map(s => s.id), new Map([[Directions.ml,1],[Directions.tl,1],[Directions.tr,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,0],[Directions.mm,1]])),
        normalRule(error.id, new Map([[Directions.mm,1]])),
    ]
    
    autotiler.processAll()

    document.addEventListener('mousedown', e => {
        var pos = getGridMousePos()
        if(autotiler.input.get(pos) == 1){
            paintmode = PaintMode.erase
        }else{
            paintmode = PaintMode.fill
        }
        autotiler.input.set(pos,1 - autotiler.input.get(pos))
        autotiler.processAround(pos)
        localStorage.setItem('input',JSON.stringify(autotiler.input))
    })
    
    document.addEventListener('mousemove', e => {
        var pos = getGridMousePos()
        if(e.buttons == 1){
            
            var old = autotiler.input.get(pos)
            if(paintmode == PaintMode.fill){
                autotiler.input.set(pos,1)
            }else{
                autotiler.input.set(pos,0)
            }
            if(old != autotiler.input.get(pos)){
                autotiler.processAround(pos)
                localStorage.setItem('input',JSON.stringify(autotiler.input))
            }
        }
    })
    
    loop((dt) => {
        
        ctxt.clearRect(0,0,screensize.x,screensize.y)
        
        renderGrid(autotiler.output)
    
        ctxt.fillStyle = 'grey'
        
        

        drawgridcell(getGridMousePos())
        
    })

    function renderGrid(grid:number[][]){
        var size = get2DArraySize(grid)
        size.loop2d((v) => {
            var tileid = read2D(grid,v)
            // ctxt.fillStyle = colors[tileid]
            // drawgridcell(v)
            // ctxt.drawImage(loadedimages[tileid % loadedimages.length],v.x * tilesize.x,v.y * tilesize.y,tilesize.x,tilesize.y)
            var sprite = spritestore.get(tileid)
            drawImage(sprite.img,ctxt,v.c().mul(tilesize),tilesize,sprite.rotations)
        })
    }
})

function getGridMousePos(){
    return abs2grid(mousepos)
}

function drawgridcell(gridpos:Vector){
    var pos = gridpos.c().mul(tilesize)
    ctxt.fillRect(pos.x,pos.y,tilesize.x,tilesize.y)
}

function abs2grid(abs:Vector){
    return abs.c().div(tilesize).floor()
}


