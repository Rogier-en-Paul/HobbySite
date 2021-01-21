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
/// <reference path="camera.ts" />
/// <reference path="2dgrowlist.ts" />




var colors = ['white','red','blue','purple','pink','orange','yellow','green','cyan','brown','coral','crimson','deeppink','violet','black','lawngreen','lightgreen']
var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt
var camera = new Camera(ctxt)
camera.pos = new Vector(0,0)
camera.scale = new Vector(1,1)
ctxt.imageSmoothingEnabled = false;
var tilesize = new Vector(32,32)

//take a list of tiles in order each tile has a rule that looks at its surroundings
//the first tile that passes it's rule gets placed at that spot else leave unchanged/zero
enum PaintMode{erase,fill}
var paintmode = PaintMode.fill


var [mousepos,oldmousepos] = startMouseListen(canvas)




var imagenames = ['void','surrounded','cornertl','openwalltm','ml1neighbour','alone','2neighboursopposite','error','filled','boxcorner','boxinnercorner','openwall','diagonal']
loadImages(imagenames.map(image => `res/${image}.png` )).then(images => {
    var autotiler = new AutoTiler()
    // autotiler.vertices.set(new Vector(0,0),1)
    var spritestore = new Store<Sprite>()
    var filled = spritestore.add(new Sprite(images[8],0,ctxt))
    var voidsprite = spritestore.add(new Sprite(images[0],0,ctxt))
    // var surroundSprite = spritestore.add(new Sprite(images[1],0,ctxt)) 
    // var cornersprites = Sprite.rotated(images[2],ctxt).map(s => spritestore.add(s))
    // var threeneighbours = Sprite.rotated(images[3],ctxt).map(s => spritestore.add(s))
    // var oneneighbour = Sprite.rotated(images[4],ctxt).map(s => spritestore.add(s))
    // var twoneigboursoppositevert = spritestore.add(new Sprite(images[6],0.25,ctxt))
    // var twoneigboursoppositehor = spritestore.add(new Sprite(images[6],0,ctxt))
    // var alone = spritestore.add(new Sprite(images[5],0,ctxt)) 
    var error = spritestore.add(new Sprite(images[7],0,ctxt))

    
    var boxcorner = Sprite.rotated(images[9],ctxt).map(s => spritestore.add(s))
    var boxinnercorner = Sprite.rotated(images[10],ctxt).map(s => spritestore.add(s))
    var openwall = Sprite.rotated(images[11],ctxt).map(s => spritestore.add(s))
    var diagonal = Sprite.rotated(images[12],ctxt).map(s => spritestore.add(s))

    

    // autotiler.setup(new List2D( new Vector(100,50),0))
    // var savedinput =  localStorage.getItem('input')
    // if(savedinput != null){
    //     var res = JSON.parse(savedinput)
    //     autotiler.input.arr = res.arr
    // }
     

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

    // autotiler.tiles = [
    //     // normalRule(voidsprite.id,new Map([[Directions.mm,0]])),
    //     normalRule(filled.id,new Map([[Directions.mm,0]])),
    //     ...rotated(boxinnercorner.map(s => s.id), new Map([[Directions.ml,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,1],[Directions.bl,0],[Directions.tl,1],[Directions.tr,1],[Directions.br,1],[Directions.mm,1]])),
    //     normalRule(filled.id,new Map([[Directions.ml,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,1],[Directions.tl,1],[Directions.tr,1],[Directions.bl,1],[Directions.br,1],[Directions.mm,1]])),
    //     ...rotated(boxcorner.map(s => s.id), new Map([[Directions.ml,0],[Directions.tm,0],[Directions.mr,1],[Directions.bm,1],[Directions.br,1],[Directions.mm,1]])),
    //     ...rotated(openwall.map(s => s.id), new Map([[Directions.ml,1],[Directions.tl,1],[Directions.tr,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,0],[Directions.mm,1]])),
    //     normalRule(error.id, new Map([[Directions.mm,1]])),
    // ]

    autotiler.tiles = [
        normalRule(filled.id,new Map([[Directions.tl,0],[Directions.tr,0],[Directions.bl,0],[Directions.br,0]])),
        normalRule(filled.id,new Map([[Directions.tl,1],[Directions.tr,1],[Directions.bl,1],[Directions.br,1]])),
        ...rotated(boxcorner.map(s => s.id),new Map([[Directions.tl,0],[Directions.tr,0],[Directions.bl,0],[Directions.br,1]])),
        ...rotated(boxinnercorner.map(s => s.id),new Map([[Directions.tl,1],[Directions.tr,1],[Directions.bl,0],[Directions.br,1]])),
        ...rotated(openwall.map(s => s.id),new Map([[Directions.tl,1],[Directions.tr,1],[Directions.bl,0],[Directions.br,0]])),
        ...rotated(diagonal.map(s => s.id),new Map([[Directions.tl,1],[Directions.tr,0],[Directions.bl,0],[Directions.br,1]])),
        normalRule(error.id, new Map([]))
    ]
    
    autotiler.processAll()

    // document.addEventListener('mousedown', e => {
    //     var pos = getGridMousePos()
    //     if(autotiler.input.get(pos) == 1){
    //         paintmode = PaintMode.erase
    //     }else{
    //         paintmode = PaintMode.fill
    //     }
    //     autotiler.input.set(pos,1 - autotiler.input.get(pos))
    //     autotiler.processAround(pos)
    //     localStorage.setItem('input',JSON.stringify(autotiler.input))
    // })
    
    // document.addEventListener('mousemove', e => {
    //     var pos = getGridMousePos()
    //     if(e.buttons == 1){
            
    //         var old = autotiler.input.get(pos)
    //         if(paintmode == PaintMode.fill){
    //             autotiler.input.set(pos,1)
    //         }else{
    //             autotiler.input.set(pos,0)
    //         }
    //         if(old != autotiler.input.get(pos)){
    //             autotiler.processAround(pos)
    //             localStorage.setItem('input',JSON.stringify(autotiler.input))
    //         }
    //     }
    // })

    document.addEventListener('mousedown', e => {
        var pos = getVertexMousePos(mousepos)
        if(autotiler.vertices.get(pos) == 1){
            paintmode = PaintMode.erase
        }else{
            paintmode = PaintMode.fill
        }
        paintEdge(pos)
    })
    
    document.addEventListener('mousemove', e => {
        var oldpos = getVertexMousePos(oldmousepos)
        var newpos = getVertexMousePos(mousepos)
        if(e.buttons == 1){
            // paintEdge(newpos)
            fullLine(oldpos,newpos).forEach(pos => paintEdge(pos))
        }
    })

    function line(a:Vector,b:Vector){
        var res:Vector[] = []
        var a2b = a.to(b)
        var diagonaldistance = Math.max(Math.abs(a2b.x),Math.abs(a2b.y))

        for(var step = 0; step <= diagonaldistance;step++){
            var r = diagonaldistance == 0 ? 0 : step / diagonaldistance
            res.push(a.lerp(b,r).round())
        }
        return res
    }

    function fullLine(a:Vector,b:Vector){
        
        var a2b = a.to(b)
        var dist = new Vector(Math.abs(a2b.x),Math.abs(a2b.y))
        var sign = new Vector(Math.sign(a2b.x),Math.sign(a2b.y))
        var current = a.c()
        var res:Vector[] = [current.c()]
        for(var x = 0, y = 0; x < dist.x || y < dist.y;){
            if((0.5+x) / dist.x < (0.5+y) / dist.y){
                current.x += sign.x
                x++
            }else{
                current.y += sign.y
                y++
            }
            res.push(current.c())
        }
        return res
    }

    function paintEdge(pos:Vector){
        var old = autotiler.vertices.get(pos)
        if(paintmode == PaintMode.fill){
            autotiler.vertices.set(pos,1)
        }else{
            autotiler.vertices.set(pos,0)
        }
        if(old != autotiler.vertices.get(pos)){
            autotiler.processAround(pos)
            // localStorage.setItem('input',JSON.stringify(autotiler.input))
        }
    }

    document.addEventListener('wheel',e => {
        camera.scale.scale(1 + e.deltaY * 0.001)
    })
    
    loop((dt) => {
        var worldmousepos = camera.screen2world(mousepos)
        ctxt.fillStyle = 'black'
        ctxt.fillRect(0,0,screensize.x,screensize.y)
        camera.pos.add(getMoveInputYFlipped().scale(500).scale(camera.scale.x).scale(dt))
        
        camera.begin()

        
        
        
        renderGrid(autotiler.output)
    
        ctxt.fillStyle = 'grey'

        if(keys['x']){
            ctxt.strokeStyle = 'grey'
            drawGrid(ctxt,tilesize)
        }
        

        // drawgridcell(getGridMousePos())
        drawVertexPos(getVertexMousePos(mousepos))
        camera.end()
        
    })

    function renderGrid(grid:List2D2<number>){
        grid.loop2d((v,tileid) => {
            var sprite = spritestore.get(tileid ?? 0)
            drawImage(sprite.img,ctxt,v.c().mul(tilesize),tilesize,sprite.rotations)
        })
    }
})

function getGridMousePos(mousepos){
    return abs2grid(camera.screen2world(mousepos))
}

function getVertexMousePos(mousepos){
    return camera.screen2world(mousepos).c().div(tilesize).round()
}

function drawgridcell(gridpos:Vector){
    var pos = gridpos.c().mul(tilesize)
    ctxt.fillRect(pos.x,pos.y,tilesize.x,tilesize.y)
}

function drawVertexPos(vertexpos:Vector){
    var pos = vertexpos.c().mul(tilesize)
    var half = tilesize.c().scale(0.5)
    ctxt.fillRect(pos.x - half.x,pos.y - half.y,tilesize.x,tilesize.y)
}

function abs2grid(abs:Vector){
    return abs.c().div(tilesize).floor()
}

function drawGrid(ctxt:CanvasRenderingContext2D,tilesize:Vector){
    ctxt.beginPath()
    screensize.c().div(tilesize).ceil().loop2d(v => {
        var pos = v.c().mul(tilesize)
        ctxt.rect(pos.x + 0.5,pos.y + 0.5,tilesize.x,tilesize.y)
    })
    ctxt.stroke()
    
}

