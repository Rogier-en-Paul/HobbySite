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
/// <reference path="libs/utils/domutils.js" />
/// <reference path="sphere.ts" />


let screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
let crret = createCanvas(screensize.x,screensize.y)
let canvas = crret.canvas
let ctxt = crret.ctxt



let colors = [
    'yellow',
    'blue',
    'red',
    'purple',
    'orange',
    'green',
    'brown',
]



function genPoolBalls(offset){
    let res = []
    let index = 0
    for(let x = 0; x < 5; x++){
        for(let y = 0; y < x + 1; y++){
            let radius = 10
            let diameter = radius * 2
            let colheight = (x + 1) * diameter
            if(index == 7){
                let ball = new Sphere({
                    pos:new Vector(x * diameter,y * diameter - colheight / 2).add(offset),
                    vel:new Vector(0,0),
                    radius:radius,
                    color:'white',
                    number:index,
                    isFilled:false,
                })
                ball.calcMass()
                index++
                res.push(ball)
            }else{
                let ball = new Sphere({
                    pos:new Vector(x * diameter,y * diameter - colheight / 2).add(offset),
                    vel:new Vector(0,0),
                    radius:radius,
                    color:colors[index % colors.length],
                    number:index,
                    isFilled:index < 7,
                })
                ball.calcMass()
                index++
                res.push(ball)
            }
        }
    }

    return  res
}

let screencenter = screensize.c().scale(0.5)
let tablesize = new Vector(800,400)
let rect = Rect.fromSize(screencenter.c().sub(tablesize.c().scale(0.5)),tablesize)
let tl = rect.getPoint(new Vector(0,0))
let tr = rect.getPoint(new Vector(1,0))
let br = rect.getPoint(new Vector(1,1))
let bl = rect.getPoint(new Vector(0,1))

let edges = [
    [tl,tr],
    [tr,br],
    [br,bl],
    [bl,tl],
]

let pocketradius = 20
let pockets = [
    tl,rect.getPoint(new Vector(0.5,0)),tr,
    bl,rect.getPoint(new Vector(0.5,1)),br
]

let balls = [
    new Sphere({
        pos:rect.getPoint(new Vector(0.25,0.5)),
        vel:new Vector(0,0),
        radius:10,
        color:'white',
        isFilled:true,
    }),
]
let whiteball = balls[0]
balls.push(...genPoolBalls(rect.getPoint(new Vector(0.75,0.5))))
for(let ball of balls){
    ball.calcMass()
}



let dragging = false
let dragstart = new Vector(0,0)
let mousepos = new Vector(0,0)

document.addEventListener('mousemove',(e) => {
    mousepos = getMousePos(canvas,e)
})

document.addEventListener('mousedown',(e) => {
    if(e.button == 0 && spherSphereDetection(mousepos,1,whiteball.pos,whiteball.radius)){
        dragging = true
        dragstart = mousepos.c()
    }
})

document.addEventListener('mouseup',(e) => {
    if(e.button == 0){
        if(dragging){
            whiteball.vel.add(mousepos.to(whiteball.pos).scale(2)) 
        }
        dragging = false
        
    }
})




loop((dt) => {
    dt = clamp(dt,1/120,1/30)
    ctxt.fillStyle = 'black'
    ctxt.fillRect(0,0,screensize.x,screensize.y)

    for(let ball of balls){
        ball.pos.add(ball.vel.c().scale(dt))
        ball.vel.add(ball.vel.c().normalize().scale(-1 * 40 * dt))

    }

    for(let edge of edges){
        ctxt.beginPath()
        ctxt.strokeStyle = 'white'
        ctxt.moveTo(edge[0].x,edge[0].y)
        ctxt.lineTo(edge[1].x,edge[1].y)
        ctxt.stroke()
    }

    for(let pocket of pockets){
        ctxt.beginPath();
        ctxt.strokeStyle = 'white'
        ctxt.ellipse(pocket.x,pocket.y,pocketradius,pocketradius,0,0,TAU)
        ctxt.stroke()
    }

    if(dragging){
        ctxt.beginPath()
        ctxt.strokeStyle = 'white'
        ctxt.moveTo(whiteball.pos.x,whiteball.pos.y)
        ctxt.lineTo(mousepos.x,mousepos.y)
        ctxt.stroke()
    }

    for(let ball of balls){
        for(let edge of edges){

            
            if(lineSphereDetection(edge[0],edge[1],ball.pos,ball.radius)){
                resolveSphereWallCollision(edge[0],edge[1],ball.pos,ball.vel,ball.radius)
            }

        }
    }

    let whitehit = pockets.findIndex(p => spherSphereDetection(p,pocketradius,whiteball.pos,whiteball.radius)) != -1
    if(whitehit){
        whiteball.pos = rect.getPoint(new Vector(0.25,0.5));
        whiteball.vel = new Vector(0,0)
    }

    balls = balls.filter(ball => {
        for(let pocket of pockets){
            if(spherSphereDetection(pocket,pocketradius,ball.pos,ball.radius) ){
                return false
            }
        }
        return true
    })

    
    for(let i = 0; i < balls.length;i++){
        for(let j = i + 1; j < balls.length;j++){
            if(spherSphereDetection(balls[i].pos,balls[i].radius,balls[j].pos,balls[j].radius)){
                resolveSherecollision2D(balls[i].pos,balls[i].radius,balls[i].vel,balls[i].mass,balls[j].pos,balls[j].radius,balls[j].vel,balls[j].mass)
            }
        }
    }

    

    for(let ball of balls){
        //draw a circle at the position of the ball
        ctxt.beginPath();
        ctxt.fillStyle = ball.color
        ctxt.strokeStyle = ball.color
        ctxt.ellipse(ball.pos.x,ball.pos.y,ball.radius,ball.radius,0,0,TAU)
        if(ball.isFilled){
            ctxt.fill()        
        }else{
            ctxt.stroke()
        }
    }
})


function spherSphereDetection(posa,radiusa,posb,radiusb){
    return posa.to(posb).length() < radiusa + radiusb
}

function lineSphereDetection(linefrom,lineto,circpos,radius){
    let a2b = linefrom.to(lineto)
    let a2ball = linefrom.to(circpos)
    let hit = a2ball.projectOnto(a2b).to(a2ball).length() < radius
    return hit
}


function elasticCollisionMP(mass1, vel1, mass2, vel2) {
    //vcom = velocity center of mass, a weighted velocity
    // https://www.youtube.com/watch?v=bSVfItpvG5Q
    let vcom = (mass1 * vel1 + mass2 * vel2) / (mass1 + mass2);
    let v1new = vcom + mass2 / (mass1 + mass2) * (vel2 - vel1);
    let v2new = vcom + mass1 / (mass1 + mass2) * (vel1 - vel2);;
    return [v1new, v2new];
}

function resolveSphereWallCollision(walla:Vector,wallb:Vector,pos:Vector,vel:Vector,radius){
    let wallnormal = walla.to(wallb).normalize().rotate2d(0.25);
    let dist2wall = wallnormal.dot(walla.to(pos))

    if(dist2wall < radius){
        pos.add(wallnormal.c().scale(radius - dist2wall))
    }
    let speedtowardswall = vel.dot(wallnormal)
    if(speedtowardswall){
        vel.overwrite(Vector.reflect(wallnormal,vel)) 
    }
    return vel
}

function resolveSherecollision2D(pos1,radius1,vel1,mass1,pos2,radius2,vel2,mass2){
    let penetration = (radius1 + radius2) - pos1.to(pos2).length();
    let center = pos1.lerp(pos2,0.5);
    pos1.add(center.to(pos1).normalize().scale(penetration/2))
    pos2.add(center.to(pos2).normalize().scale(penetration/2))

    let collisiondir = pos1.to(pos2).normalize()
    let v1 = vel1.dot(collisiondir)
    let v2 = vel2.dot(collisiondir)

    let res = elasticCollisionMP(mass1,v1,mass2,v2)

    let v1new = collisiondir.c().scale(res[0]);
    let v2new = collisiondir.c().scale(res[1]);

    // subtract the old velocity vector and add the new one
    vel1.sub(vel1.projectOnto(collisiondir)).add(v1new);
    vel2.sub(vel2.projectOnto(collisiondir)).add(v2new);

    return [vel1, vel2];
}
