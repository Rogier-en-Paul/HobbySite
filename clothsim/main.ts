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
/// <reference path="libs/utils/camera.ts" />
/// <reference path="libs/networking/entity.ts" />
/// <reference path="libs/networking/server.ts" />
/// <reference path="cloth.ts" />


//damping
//gravity
//update springs then anchors

let crossed = true
let globalstiffness = 500
let globalgravity = new Vector(0,1000)
let globaldampening = 4
let globalresolution = 10


$('#crossed').addEventListener('change', (e:any) => {
    crossed = e.target.checked
    regenNet()
})

$('#stifness').addEventListener('input', e => {
    e.target.valueAsNumber
    globalstiffness = e.target.value
})

$('#gravity').addEventListener('input', e => {
    globalgravity.y = e.target.value
})

$('#dampening').addEventListener('input', e => {
    globaldampening = e.target.valueAsNumber
})

$('#resolution').addEventListener('input', e => {
    globalresolution = e.target.value
    regenNet()
})

$('#regen').addEventListener('click', e => {
    regenNet()
})

var net = null
function regenNet(){

    // net = generateNet(new Vector(200,200),new Vector(10,10),new Vector(50,50))
    var spacing = 500 / globalresolution
    net = generateNet(new Vector(200,200),new Vector(globalresolution,globalresolution),new Vector(spacing,spacing))
    anchors = []
    springs = []
    anchors.push(...net.anchors)
    springs.push(...net.springs)
}



var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt
var anchors = [
    // new Anchor({
    //     pos:new Vector(100,100),
    //     mass:1,
    //     locked:true,
    //     damping:0.9,
    //     // acc:new Vector(0,10),
    // }),
    // new Anchor({
    //     pos:new Vector(100,210),
    //     mass:1,
    //     locked:false,
    //     damping:0.995,
    //     acc:new Vector(0,20),
    // }),
    // new Anchor({
    //     pos:new Vector(100,350),
    //     mass:1,
    //     locked:false,
    //     damping:0.99,
    //     // acc:new Vector(0,10),
    // })
]

var springs = [
    // new Spring({
    //     a:anchors[0],
    //     b:anchors[1],
    //     length:100,
    //     stiffness:20
    // }),
    // new Spring({
    //     a:anchors[1],
    //     b:anchors[2],
    //     length:100,
    //     damping:0.8,
    //     stiffness:100
    // })
]

regenNet()


loop((dt) => {
    dt = clamp(dt,0.004,0.02)
    ctxt.clearRect(0,0,screensize.x,screensize.y)

    for(var spring of springs){
        spring.update(dt)
    }
    for(var anchor of anchors){
        anchor.update(dt)
    }

    for(var spring of springs){
        spring.draw()
    }
})

canvas.addEventListener('mousedown',e => {
    var mouesepos = getMousePos(canvas,e)
    for(var anchor of anchors){
        
        anchor.applyforce(mouesepos.to(anchor.pos).normalize(), clamp(map(mouesepos.to(anchor.pos).length(),0,500,1000,0),0,1000))
    }
})



function generateNet(origin:Vector, size:Vector,spacing:Vector){

    var anchors = []
    var anchormap = {}
    var springs = []

    size.loop2d(index => {
        var abs = index.c().mul(spacing).add(origin)
        var newanchor = new Anchor({
            pos:abs,
            mass:1,
            locked:index.y == 0,
            // damping:4,
            acc:globalgravity
        })
        anchormap[`${index.x}:${index.y}`] = newanchor
        anchors.push(newanchor)
    })

    size.loop2d(index => {
        var neighbourindices = getNeighbours(index,size)
        var self = anchormap[`${index.x}:${index.y}`]
        for(var neighbourindex of neighbourindices){
            var neighbour = anchormap[`${neighbourindex.x}:${neighbourindex.y}`]
            
            springs.push(new Spring({
                a:self,
                b:neighbour,
                length:self.pos.to(neighbour.pos).length(),
                // stiffness:500,
            }))
        }
    })

    return {
        anchors,
        anchormap,
        springs,
    }

}

function getNeighbours(index:Vector,gridsize:Vector):Vector[]{
    var sizemin1 = gridsize.c().sub(new Vector(1,1))
    var result = []
    var neighboursdirs = [
        new Vector(1,0),
        new Vector(-1,0),
        new Vector(0,1),
        new Vector(0,-1),
    ]

    if(crossed){
        neighboursdirs.push(
            new Vector(1,1),
            new Vector(1,-1),
        )
    }

    for(var dir of neighboursdirs){
        var abs = index.c().add(dir)
        if(boxCheck(abs,new Vector(0,0),sizemin1)){
            result.push(abs)
        }
    }

    return result
}

//check if a point intersects a rectangle
function boxCheck(pos:Vector,min:Vector,max:Vector):boolean{
    return inRange(min.x,max.x,pos.x) && inRange(min.y,max.y,pos.y)
}

function $(query){
    return document.querySelector(query) as any
}

    
