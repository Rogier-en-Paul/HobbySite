/// <reference path="anim.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="table.ts" />
/// <reference path="eventsystem.ts" />
/// <reference path="particleSystem.ts" />
/// <reference path="utils.ts" />

var fastinfastoutanim = new BezierAnim([
    new Vector(0,0),new Vector(0,1),
    new Vector(0,1),new Vector(0.1,1),new Vector(0.2,1),
    new Vector(0.8,1),new Vector(0.9,1),new Vector(1,1),
    new Vector(1,1),new Vector(1,0),
])

var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt
var onUpdate = new EventSystem<number>()
var onDraw = new EventSystem<void>()
var rng = new RNG(0)
var ps = new ParticleSystem(1, new Vector(screensize.x / 2,screensize.y * 0.8),4)
ps.init()


ps.onParticleMounted.listen(particle => {
    particle.pos = ps.pos.c()
    particle.speed = rotate2d(new Vector(0,-200),rng.range(-0.05,0.05))
})

var gravity = new Vector(0,40)
ps.onParticleUpdate.listen(({particle,dt}) => {
    particle.speed.add(gravity.c().scale(dt))
    particle.update(dt)
})

ps.onParticleDraw.listen(p => {
    var colorbylifetime = p.getLifeRatio() * 360
    var sizebylifetime = fastinfastoutanim.getSmoothAt(p.getLifeRatio()) * 10

    fillCircle(p.pos,sizebylifetime,`hsl(${colorbylifetime},100%,50%)`)
})

ps.onParticleDismount.listen(p => {

    let subps = new ParticleSystem(0,p.pos.c(),4)
    subps.init()

    subps.onParticleMounted.listen(particle => {
        particle.pos = subps.pos.c()
        particle.speed = rotate2d(new Vector(rng.range(20,50) + 30,0),rng.norm()).add(p.speed)
        particle.lifetimesec *= rng.range(0.3,1)
        particle.data[0] = rng.range(0.7,1.3)
    })

    subps.onParticleUpdate.listen(({particle,dt}) => {
        particle.speed.scale(1 - (0.5 * dt))
        particle.update(dt)
    })

    subps.onParticleDraw.listen(p => {
        // var minspeed = 0
        // var maxspeed = 10 
        // var colorbyspeed = clamp(inverseLerp(p.speed.length(),minspeed,maxspeed),0,1) 
        // var sizebyspeed = clamp(inverseLerp(p.speed.length(),minspeed,maxspeed),0,1)
        var sizebylifetime = fastinfastoutanim.getSmoothAt(p.getLifeRatio()) * 5 * p.data[0]
        fillCircle(p.pos,sizebylifetime,`hsl(30,100%,${(1-p.getLifeRatio()) * 50}%)`)
    })

    let onupdateid = onUpdate.listen(dt => {
        subps.update(dt)
    })

    let ondrawid = onDraw.listen(() => {
        subps.draw()
    })

    setTimeout(() => {
        subps.delete()
        onUpdate.unlisten(onupdateid)
        onDraw.unlisten(ondrawid)
    },subps.particlelifetimeSec * 1000)
    subps.burst(20)
})

onUpdate.listen(dt => {
    ps.update(dt)
})

onDraw.listen(() => {
    ps.draw()
})




var fps = 0
setInterval(() => {
    fps = Math.round(1/lastdt)
},1000)
var lastdt = 0

loop((dt) => {
    dt /= 1000
    lastdt = dt
    ctxt.fillStyle = 'black'
    ctxt.fillRect(0,0,screensize.x,screensize.y)
    ctxt.fillStyle = 'white'
    ctxt.fillText(`fps ${fps}`,10,10)

    onUpdate.trigger(dt)
    onDraw.trigger()
    
    
})

function fillCircle(pos:Vector,radius:number,color:string){
    ctxt.fillStyle = color
    ctxt.beginPath()
    ctxt.ellipse(pos.x,pos.y,radius,radius,0,0,TAU)
    ctxt.fill()
}