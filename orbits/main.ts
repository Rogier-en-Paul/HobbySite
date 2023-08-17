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
/// <reference path="body.ts" />
/// <reference path="engine.ts" />
/// <reference path="orbitmath.ts" />


// https://space.stackexchange.com/questions/2562/2d-orbital-path-from-state-vectors
// https://space.stackexchange.com/questions/1904/how-to-programmatically-calculate-orbital-elements-using-position-velocity-vecto
// https://wiki.kerbalspaceprogram.com/wiki/Tutorial:_Basic_Orbiting_(Math)

// https://orbital-mechanics.space/classical-orbital-elements/orbital-elements-and-the-state-vector.html#equation-eq-simplified-eccentricity-vector
// https://space.stackexchange.com/questions/19322/converting-orbital-elements-to-cartesian-state-vectors

//todo
//orbit params
//test/draw orbit
//stages/parts hierarchy
//multiple planets
//patched conics/soi


//questions
// orbital parameters math
// what exactly is isp
// math rearranging/algebra
// your rocket project?
// usefull equations or other things to know?




var tau = Math.PI * 2
var timemultiplier = 1
var rad2deg = 360 / tau
var deg2rad = tau / 360
var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt
var airdensityarray = [
    [-1000,	1.347],
    [0,	1.225],
    [1000,	1.112],
    [2000,	1.007],
    [3000,	0.9093],
    [4000,	0.8194],
    [5000,	0.7364],
    [6000,	0.6601],
    [7000,	0.5900],
    [8000,	0.5258],
    [9000,	0.4671],
    [10000,	0.4135],
    [15000,	0.1948],
    [20000,	0.08891],
    [25000,	0.04008],
    [30000,	0.01841],
    [40000,	0.003996],
    [50000,	0.001027],
    [60000,	0.0003097],
    [70000,	0.00008283],
    // [80000,	0.00001846],
]
var smoketrail:Vector[] = []

var camera = new Camera2(ctxt)
var zoom = 1
// camera.addListeners()
const G = 6.674 * Math.pow(10,-11);
var earth = new Planet({
    atmoshpericdensity:0,
    atmosphereheight:70_000,
    radius:600_000,
    body:new BodyA({
        direction:0,
        mass:5.29*Math.pow(10,22),
        pos:new Vector(0,0,0),
        vel:new Vector(0,0,0),
    }),
}) 
var rocket = new Rocket({
    onrails:false,
    turnrate:0.25,
    fuelContainer:new FuelContainer({
        mass:500,
        currentfuel:5000,
        maxfuel:5000,
        fueltype:new FuelType({
            density:1,
            name:'liquidfuel',
        })
    }),
    engine:new Engine({
        throttle:0,
        throttlespeed:1,
        // ispatm:300,
        // ispvac:320,
        mass:2000,
        // thrustatm:250000,
        // thrustvac:250000,
        fuelpersecond:100,
        exhaustvel:320 * 9.8,
        // fuelpersecond:10,
    }),
    body:new BodyA({
        direction:0,
        mass:2000,
        pos:new Vector(0,0,0),
        vel:new Vector(0,0,0),
    }),
}) 

// cacheOrbit(earth.body,rocket.body)
//twr = thrust/weight/9.8(g)
var mu = G * earth.body.mass
setup()

loop((dt) => {
    dt = Math.min(dt,1/30)
    update(dt)
    draw()
})

window.addEventListener('wheel',(e) => {
    var scroll = 1
    if(e.deltaY > 0){
        scroll = 2
    }else{
        scroll = 0.5
    }
    zoom *= scroll
    zoom = Math.max(1,zoom)
})

setInterval(() => {
    smoketrail.push(rocket.body.pos.c())
    if(smoketrail.length > 100){
        smoketrail.shift()
    }
},1000)

var orbelems = posAndVel2OrbitParams(new Vector(0,-14000,0),new Vector(3,0,3),398600.5)
var posvelback = orbitParams2PosVel2(orbelems)


var test = new Vector(1,0,0).anglediff3d(new Vector(0,-1,0))

function setup(){
    
    // camera.scale.scale(1/20)
    // rocket.body.vel.y = calcSpeedForCircularOrbit(earth.body.mass,earth.body.pos.to(rocket.body.pos).length())
    // rocket.body.pos = new Vector(0,-earth.radius)
    rocket.body.pos = new Vector(0,-earth.radius - 80000,0)
    var circvelocity = 3000 //calcSpeedForCircularOrbit(earth.body.mass,-earth.radius - 80000)
    rocket.body.vel.x = circvelocity
    rocket.body.vel.z = 0.1
    rocket.engine.throttle = 0
    rocket.body.direction = 0.5
}

document.addEventListener('keydown', e => {
    if(e.key == ','){
        timemultiplier *= 0.5
    }
    if(e.key == '.'){
        timemultiplier *= 2
    }
    timemultiplier = Math.max(timemultiplier,1)
})

var acceleration = new Vector(0,0,0)
var airdensitycurrent = 0
var dragacc = new Vector(0,0,0)
var dragwasteddv = 0
var enginewasteddv = 0

document.addEventListener('keydown',(e) => {
    if(e.key == 'r'){
        rocket.onrails = !rocket.onrails

        if(rocket.onrails){
            //going to onrails
            rocket.orbitalParams = posAndVel2OrbitParams(rocket.body.pos,rocket.body.vel,mu)
        }else{
            //going to simulation
            rocket.orbitalParams.trueanomaly = time2trueanomaly(rocket.orbitalParams.time,rocket.orbitalParams.semimajor,rocket.orbitalParams.eccentricity)
            var res = orbitParams2PosVel2(rocket.orbitalParams)
            rocket.body.pos = res.pos
            rocket.body.vel = res.vel

        }
    }
})

function update(dt){
    dt *= timemultiplier
    //input
    if(keys['a']){
        rocket.body.direction -= rocket.turnrate * dt
    }
    if(keys['d']){
        rocket.body.direction += rocket.turnrate * dt
    }
    if(keys['w']){
        rocket.engine.throttle += rocket.engine.throttlespeed * dt
    }
    if(keys['s']){
        rocket.engine.throttle -= rocket.engine.throttlespeed * dt
    }
    rocket.engine.throttle = clamp(rocket.engine.throttle,0,1)

    if(rocket.onrails == false){
        var rocketmass = rocket.engine.mass + rocket.fuelContainer.mass + rocket.fuelContainer.currentfuel * rocket.fuelContainer.fueltype.density
        // var engineforce = rocket.engine.thrustvac * rocket.engine.throttle
        var fuelmassps = rocket.engine.fuelpersecond * rocket.engine.throttle
        var engineforce = fuelmassps * rocket.engine.exhaustvel
        if(rocket.fuelContainer.currentfuel <= 0){
            engineforce = 0
        }else{
            rocket.fuelContainer.currentfuel = Math.max(0, rocket.fuelContainer.currentfuel - fuelmassps * dt)
        }
    
        var engineacc = new Vector(0,1,0).rotate2d(rocket.body.direction).scale(engineforce/rocketmass)
        var relvel = rocket.body.vel.c().sub(earth.body.vel)
        var earth2rocket = earth.body.pos.to(rocket.body.pos)
        enginewasteddv += Math.abs(engineacc.dot(earth2rocket.c().normalize())) * dt
        var surfaceHeight = earth.body.pos.to(rocket.body.pos).length() - earth.radius
        airdensitycurrent = getAirDensity(surfaceHeight)
        //todo take into account rocket orientation in airstream
        var airflowalignment =  Math.abs(new Vector(0,1,0).rotate2d(rocket.body.direction).dot(relvel.c().normalize()))
        var dragcoefficient = lerp(0.8,0.05,airflowalignment)
        var airflowsurfacearea = lerp(20,5,airflowalignment)
        var dragforce = calcDrag(airdensitycurrent, relvel.length(),dragcoefficient,airflowsurfacearea)
        dragacc = new Vector(0,0,0)
        if(relvel.length() > 0){
            dragacc = relvel.c().normalize().scale(-1 * dragforce / rocket.body.mass)
        }
        dragwasteddv += dragacc.length() * dt
    
        var dist = Math.max(rocket.body.pos.to(earth.body.pos).length(),0.5)
        var gravityforce = gravityForce(earth.body.mass,rocket.body.mass,dist)
        var gravacc = rocket.body.pos.to(earth.body.pos).normalize().scale(gravityforce / rocket.body.mass)
        var acc = new Vector(0,0,0)
        acc.add(gravacc)
        acc.add(engineacc)
        acc.add(dragacc)
        acceleration = acc
    
    
        //https://www.youtube.com/watch?v=yGhfUcPjXuE&t=232s
        rocket.body.vel.add(acc.c().scale(dt * 0.5))
        rocket.body.pos.add(rocket.body.vel.c().scale(dt))
        rocket.body.vel.add(acc.c().scale(dt * 0.5))

    }else{
        rocket.orbitalParams.time += dt
        rocket.orbitalParams.time = rocket.orbitalParams.time % rocket.orbitalParams.orbitalperiod
        rocket.orbitalParams.trueanomaly = time2trueanomaly(rocket.orbitalParams.time,rocket.orbitalParams.semimajor,rocket.orbitalParams.eccentricity)
        var res = orbitParams2PosVel2(rocket.orbitalParams)
        rocket.body.pos = res.pos
        rocket.body.vel = res.vel
    }


    if(surfaceHeight < 0){
        if(relvel.length() >= 20){
            console.log('crash')
            console.log(`speed: ${rocket.body.vel.length()}`)
        }
        rocket.body.pos = earth.body.pos.to(rocket.body.pos).normalize().scale(earth.radius)
        rocket.body.vel = new Vector(0,0,0)
    }

    // var res = convertToOrbitalParameters(rocket.body.pos.c(),rocket.body.vel.c(),G * earth.body.mass)
    
}

function draw(){
    ctxt.clearRect(0,0,screensize.x,screensize.y)
    ctxt.fillStyle = 'black'
    var relvel = rocket.body.vel.c().sub(earth.body.vel)
    var earth2rocket = earth.body.pos.to(rocket.body.pos)
    var vspeed = relvel.dot(earth2rocket.c().normalize())
    var hspeed = relvel.dot(earth2rocket.c().normalize().rotate2d(0.25))
    var textpos = 0
    var spacing = 10
    var res = posAndVel2OrbitParams(rocket.body.pos,rocket.body.vel,G * earth.body.mass)
    var posvelback = orbitParams2PosVel2(res)
    var calcbackvspeed = posvelback.vel.dot(earth2rocket.c().normalize())
    var calcbackhspeed = posvelback.vel.dot(earth2rocket.c().normalize().rotate2d(0.25))

    ctxt.fillText(`surface height: ${Math.round(earth.body.pos.to(rocket.body.pos).length() - earth.radius )}`,10,textpos += spacing)
    ctxt.fillText(`direction: ${rocket.body.direction.toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`speed: ${relvel.length().toFixed(0)}`,10,textpos += spacing)
    ctxt.fillText(`calcbackspeed: ${posvelback.vel.length().toFixed(0)}`,10,textpos += spacing)
    ctxt.fillText(`hspeed: ${Math.round(hspeed).toFixed(0)}`,10,textpos += spacing)
    ctxt.fillText(`vspeed: ${Math.round(vspeed).toFixed(0)}`,10,textpos += spacing)
    ctxt.fillText(`calcbackhspeed: ${Math.round(calcbackhspeed).toFixed(0)}`,10,textpos += spacing)
    ctxt.fillText(`calcbackvspeed: ${Math.round(calcbackvspeed).toFixed(0)}`,10,textpos += spacing)
    textpos += spacing
    ctxt.fillText(`airdensity: ${(airdensitycurrent).toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`drag: ${(dragacc.length()).toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`drag wasted dv: ${dragwasteddv.toFixed(0)}`,10,textpos += spacing)
    ctxt.fillText(`engine wasted dv: ${enginewasteddv.toFixed(0)}`,10,textpos += spacing)
    var gravacc = gravityAcceleration(G,earth.body.mass,earth2rocket.length())
    var dv = tsiolkovsky(rocket.engine.exhaustvel, rocket.getWetMass(), rocket.getDryMass())
    ctxt.fillText(`remaining dv: ${dv.toFixed(0)}`,10,textpos += spacing)
    textpos += spacing
    ctxt.fillText(`throttle: ${rocket.engine.throttle.toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`accelaration: ${(acceleration.length() / 9.8).toFixed(1)}`,10,textpos += spacing)
    ctxt.fillText(`mass: ${(rocket.engine.mass + rocket.fuelContainer.getMass()).toFixed(0)}`,10,textpos += spacing)
    ctxt.fillText(`fuel: ${(rocket.fuelContainer.currentfuel).toFixed(0)}`,10,textpos += spacing)
    textpos += spacing
    ctxt.fillText(`apoaps: ${Math.round(res.apoaps - earth.radius)}`,10,textpos += spacing)
    ctxt.fillText(`periaps: ${Math.round(res.periaps - earth.radius)}`,10,textpos += spacing)
    ctxt.fillText(`eccentricity: ${res.eccentricity.toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`inclination: ${(res.inclination).toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`raan: ${(res.raan).toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`argofperi: ${(res.argofperigee).toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`trueanomaly: ${(res.trueanomaly).toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`calcback trueanomaly: ${posvelback.trueanomaly.toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`time: ${Math.round(res.time)}`,10,textpos += spacing)
    ctxt.fillText(`orbperiod: ${Math.round(res.orbitalperiod)}`,10,textpos += spacing)

    textpos += spacing
    ctxt.fillText(`timemultiplier: ${(timemultiplier).toFixed(2)}`,10,textpos += spacing)
    ctxt.fillText(`zoom: ${(zoom).toFixed(2)}`,10,textpos += spacing)

    textpos = 0
    ctxt.fillText('w s = throttle', 200, textpos += spacing)
    ctxt.fillText('a d = rotate', 200, textpos += spacing)
    ctxt.fillText('mousewheel = zoom', 200, textpos += spacing)
    ctxt.fillText(', and . = time warp', 200, textpos += spacing)
    ctxt.fillText('r = toggle onrails mode', 200, textpos += spacing)

    var apoapsnode = res.evec.c().normalize().scale(-res.apoaps)
    var periapsnode = res.evec.c().normalize().scale(res.periaps)
    var raannode = res.ascendingnode
    

    // camera.pos = rocket.body.pos.c()
    // camera.pos = rocket.body.pos.lerp(earth.body.pos,0.5)
    camera.moveTo(new Vector(0,0,0))
    camera.moveTo(rocket.body.pos)
    // camera.zoomTo(earth.radius * 4)
    camera.zoomTo(zoom * screensize.x)
    // camera.zoomTo(screensize.x * (earth.radius / screensize.x) * 4)
    var surfacepos = earth.body.pos.to(rocket.body.pos).normalize().scale(earth.radius)
    // camera.pos = surfacepos.lerp(rocket.body.pos,0.5)//halfway between surface and rocket
    // var spacerequired = surfacepos.to(rocket.body.pos).length()
    var spacerequired = earth.body.pos.to(rocket.body.pos).length()
    var screensrequired = spacerequired / screensize.y
    // camera.scale = new Vector(1,1).scale(Math.max(1,screensrequired * 2))
    // camera.scale = new Vector(5,5)
    var smoketrailscreenpositions:Vector[] = []
    
    
    
    var orbitpath = sampleOrbit(res,mu)
    camera.begin()
        smoketrailscreenpositions = smoketrail.map(v => camera.worldToScreen(v)) 
        orbitpath = orbitpath.map(v => camera.worldToScreen(v)) 
        // drawcooord(new Vector(0,100))
        // drawRocket(new Vector(0,0,0),rocket)
        var center = camera.worldToScreen(new Vector(0,0,0))
        var earthradiusscreen = camera.worldToScreen(new Vector(0,earth.radius,0))
        var rocketscreenpos = camera.worldToScreen(rocket.body.pos)
        periapsnode = camera.worldToScreen(periapsnode)
        apoapsnode = camera.worldToScreen(apoapsnode)
        raannode = camera.worldToScreen(raannode)
        var screenbackcalc = camera.worldToScreen(posvelback.pos)
    camera.end()
    
    ctxt.strokeStyle = 'blue'
    line(orbitpath)
    drawRocket(rocketscreenpos,rocket)
    ctxt.strokeStyle = 'black'
    strokecircle(center,center.to(earthradiusscreen).length())
    
    ctxt.fillStyle = 'red'
    for(var p of smoketrailscreenpositions){
        drawRect(p)
    }
    ctxt.fillStyle = 'black'
    drawcoordtext(apoapsnode,`apoaps ${(res.apoaps - earth.radius).toFixed()}`)
    drawcoordtext(periapsnode,`periaps ${(res.periaps - earth.radius).toFixed()}`)
    drawcoordtext(raannode,'raan')
    ctxt.fillStyle = 'purple'
    drawcoordtext(screenbackcalc,'backcalc')
}

function line(verts:Vector[]){
    ctxt.beginPath()
    ctxt.moveTo(verts[0].x,verts[0].y)
    for(var i = 1; i < verts.length;i++){
        ctxt.lineTo(verts[i].x,verts[i].y)
    }
    ctxt.closePath()
    ctxt.stroke()
}

function drawcoordtext(pos:Vector,text:string){
    ctxt.fillText(`${text}`,pos.x,pos.y + 20)
    drawRect(pos)
}

function drawcoord(pos:Vector){
    ctxt.fillText(`${pos.x} ${pos.y}`,pos.x,pos.y + 20)
    drawRect(pos)
}

function drawRect(pos:Vector){
    var width = 10
    var halfwidth = width / 2
    ctxt.fillRect(pos.x - halfwidth,pos.y- halfwidth,width,width)
}

function strokecircle(pos,radius){
    ctxt.beginPath()
    ctxt.ellipse(pos.x,pos.y,radius,radius,0,0,tau)
    ctxt.closePath()
    ctxt.stroke()
}

function drawRocket(pos:Vector,rocket:Rocket){
    var points = [
        new Vector(-10,10),
        new Vector(0,20),
        new Vector(10,10),
        new Vector(10,-20),
        new Vector(-10,-20),
    ]
    
    var exhaust = [
        new Vector(10,-20),
        new Vector(0,-20 + (rocket.fuelContainer.currentfuel > 0 ? lerp(rocket.engine.throttle,0,20) : 0)),
        new Vector(-10,-20),
    ]

    for(var point of points){
        point.rotate2d(rocket.body.direction)
    }
    for(var point of exhaust){
        point.rotate2d(rocket.body.direction)
    }

    ctxt.fillStyle = 'black'
    drawShape(points,pos)
    ctxt.fillStyle = 'red'
    drawShape(exhaust,pos)
}

function drawShape(points:Vector[],offset:Vector){
    ctxt.beginPath()
    ctxt.moveTo(points[0].x + offset.x, points[0].y + offset.y)
    for(var i = 1; i < points.length;i++){
        ctxt.lineTo(points[i].x + offset.x,points[i].y + offset.y)
    }
    ctxt.closePath()
    ctxt.fill()
}

function cacheOrbit(planet:BodyA,rocket:BodyA){
    
    //simulate orbit
    //guess for good timesteps,heuristic could be current speed,distance, or amount of angle change
    //ideally more samples at periaps
    //maybe use speed or distance travelled or kepplers law or something
    //save positions,also save speed, and save percentage completion or something so you can accurately snap a time/completion amount to the correct spot in the orbit
    
    //calc semimajor,minor,eccentricity
    //can do this by calculating height change between position

    //once total distance is known orbital period is calculated
    var relpos = planet.pos.to(rocket.pos)
    
    var angle = relpos.angle2d(new Vector(1,0))
    var angletraveled = 0
    var time = 0
    while(angletraveled < 1){
        objectStep(planet,rocket,1)
        //maybe check area covered kepplers law
        time += 1//would be better if timesteps corresponded to distance travveled or something, timepercentage completed
        relpos = planet.pos.to(rocket.pos)
        var newangle = relpos.angle2d(new Vector(1,0))
        var change = Math.abs(to(angle,newangle))
        if(change > 180){
            change = Math.abs(to(angle,newangle - 360))
        }
        angletraveled += change
        angle = newangle
        datapoints.push({
            relpos:relpos.c(),
            relspeed:rocket.vel.c().sub(planet.vel),
            time:time,
        })
    }

    //maybe do it twice first a rough one using anglecomplete to determine a rough orbitlength,speeding up deltatime if anglechange is less than 1 and decreasing dt if greater than 1
    //save orbitlength and orbitalperiod
    //than do a second more precise run where you can use the known distance to be traveled
    //having a precise apoaps and periaps is most important, looking at heightchange per second is a good heuristic to determine this

    var orbitalperiod = time
    var periaps = 0
    var apoaps = 0
    //complete orbit simulated
    //now find the highest and lowest point. (maybe even lerp)


    var datapoints = []
}

function objectStep(planet:BodyA,object:BodyA,dt:number){
    var dist = Math.max(object.pos.to(planet.pos).length(),0.5)
    var force = gravityForce(planet.mass,object.mass,dist)

    var acc = object.pos.to(planet.pos).normalize().scale(force / object.mass)
    object.vel.add(acc.scale(dt))
    object.pos.add(object.vel.c().scale(dt))
}

//try a second draw function for a closeup of a rocket
//simulate the rocket going around a few times and cache the path and statistics
//have a closeupview and an earth view

function tsiolkovsky(exhaustvel,wetmass,drymass){
    return exhaustvel * Math.log(wetmass / drymass)
}

function calcDrag(massdensity,flowvelocity,dragcoefficient,area){
    return 0.5 * massdensity * flowvelocity * flowvelocity * dragcoefficient * area
}

function calcSpeedForCircularOrbit(M,radius){
    return Math.pow(G * M * (1 / radius) ,0.5) 
}

function calcSpeedForEllipticalOrbit(M,radius,sma){

    // https://www.youtube.com/watch?v=000zDI2nmq8
    //can be used to calculate necessary speed for hohman transfer
    //mu = G * M
    var mu = G * M
    return Math.pow(mu * (2 / radius - 1 / sma), 0.5)

}

function gravityAcceleration(G,M,r){
    return (G * M) / (r * r)
}

function gravityForce(m1,m2,distance){
    return (G * m1 * m2) / (distance * distance)
}

// function calcOrbitParameters(pos:Vector,vel:Vector,G,M,m){
//     // https://wiki.kerbalspaceprogram.com/wiki/Tutorial:_Basic_Orbiting_(Math)
//     var mu = G * M
//     var r = pos.length()
//     var v = vel.length()

//     var l = m * r * v
//     var l2 = l * l
    
//     function heightat(angledeg){
//         return (l2 / (mu*m*m)) * (1 / (1 +  e * Math.cos(angledeg * deg2rad)))
//     }

//     var periaps = heightat(0)
//     var apoaps = heightat(180) 


//     // https://en.wikipedia.org/wiki/Orbital_elements
//     var semimajoraxis = (l2 / (mu*m*m)) * (1 / (1 - e * e))
//     var semiminoraxis = (l2 / (mu*m*m)) * Math.pow(1 / (1 - e * e),0.5)
//     var eccentricity = Math.pow(semimajoraxis * semimajoraxis - semiminoraxis * semiminoraxis,0.5) / semimajoraxis
//     var argumentofperiapsis
//     var trueanamoly


//     //3d stuff
//     // var inclination
//     // var longtitudeoftheascendingnode
    
    
    
//     return {
//         semimajoraxis,
//         eccentricity,
//         argumentofperiapsis,
//         trueanamoly
//     }
// }

// function calcOrbitParameters2(pos:Vector,vel:Vector,M,g){
//     // https://space.stackexchange.com/questions/2562/2d-orbital-path-from-state-vectors

//     var mu = M * g
//     var H = pos.cross(vel)
//     var h = H.length()
//     var E = vel.cross(H) / mu - pos / pos.length()
//     var e = E.length()
//     var a = (h * h) / (mu * (1 - e * e))
//     var w = Math.atan(E.y / E.x)
//     function d(T){
//         return a * (1 - e * e) / (1 + e * Math.cos(T + w))
//     }
//     var ta = 
//     var theta = 



// }

// function calcOrbitParameters3(pos:Vector,vel:Vector,M,g){
//     var mu = M * g
//     var speed = vel.length()
//     var r = pos.length()
//     var h = pos.cross(vel)
//     var K = new Vector(0,0,1)
//     var node = K.cross(h)
//     var E = pos.scale(speed * speed - mu / r).sub(vel.scale(pos.dot(vel))).scale(1/mu)
//     var e = E.length()



//     var w = Math.acos(node.dot(E) / (node.length() * e))
//     var v = Math.acos(E.dot(pos) / (e * r))

//     // https://space.stackexchange.com/questions/1904/how-to-programmatically-calculate-orbital-elements-using-position-velocity-vecto
// }

function calcPosVel(){

}

function getAirDensity(height){
    if(height > last(airdensityarray)[0]){
        return 0
    }
    if(height < first(airdensityarray)[0]){
        return first(airdensityarray)[1]
    }
    for(var i = 0; i < airdensityarray.length - 1;i++){
        if(height >= airdensityarray[i][0] && height < airdensityarray[i+1][0]){
            return map(height, airdensityarray[i][0], airdensityarray[i + 1][0], airdensityarray[i][1], airdensityarray[i+1][1])
        }
    }
    return 0
}


