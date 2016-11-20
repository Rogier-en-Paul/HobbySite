var canvas = <HTMLCanvasElement> document.getElementById('canvas')
var ctxt = canvas.getContext('2d')
var lastUpdate = Date.now();
var dt:number;
var pi = Math.PI

import Polygon = require('./polygon')
import Vector = require('./Vector')
import Bone = require('./bone')
import Utils = require('./utils')
import Bezier = require('./bezier')
import EventHandler = require('./eventHandler')
import Rig = require('./rig')
import Animation = require('./animation')

var canvasContainer:any = document.querySelector('#canvas-container')
canvas.width = canvasContainer.offsetWidth - 3
canvas.height = canvasContainer.offsetHeight - 3

var rig = new Rig()

//maybe keep default and use copy for posing and animating

var headMesh = new Polygon([
    new Vector(-50, 250),
    new Vector(0, 200),
    new Vector(50, 250)
])
rig.polygons.push(headMesh)

var spineMesh = new Polygon([
    new Vector(),
    new Vector(0, 100),
    new Vector(0, 200)
]);
rig.polygons.push(spineMesh)

var feetMesh = new Polygon([
    new Vector(-50, 0),
    new Vector(50, 0)
])
rig.polygons.push(feetMesh)

var feet = new Bone(new Vector());
var lowerArm = new Bone(new Vector());
feet.addChild(lowerArm)
var upperArm = new Bone(spineMesh.vertices[1].copy());
lowerArm.addChild(upperArm)
var head = new Bone(spineMesh.vertices[2].copy());
upperArm.addChild(head)
rig.bone = feet;

feet.vertices = feetMesh.vertices
lowerArm.vertices.push(spineMesh.vertices[0])
upperArm.vertices.push(spineMesh.vertices[1])
head.vertices.push(spineMesh.vertices[2])
head.vertices = head.vertices.concat(headMesh.vertices)


feet.set(new Vector(400, 400))
feet.setRotation(pi)

//feet position x, y
rig.animations.push(new Animation(feet,[
    new Vector(0,       400),//
    new Vector(0.33,    400),
    new Vector(0.66,    400),
    new Vector(1,       400),//
    new Vector(1.33,    400),
    new Vector(1.66,    600),
    new Vector(2,       600),//
    new Vector(2.33,    600),
    new Vector(2.66,    600),
    new Vector(3,       600),//
],(bone, y) =>{
    bone.set(new Vector(y, bone.pos.y))
}))

rig.animations.push(new Animation(feet,[
    new Vector(0,       400),//
    new Vector(0.33,    400),
    new Vector(0.66,    400),
    new Vector(1,       400),//
    new Vector(1.4,     200),
    new Vector(1.6,     200),
    new Vector(2,       400),//
    new Vector(2.33,    400),
    new Vector(2.66,    400),
    new Vector(3,       400),//
],(bone, y) =>{
    bone.set(new Vector(bone.pos.x, y)) 
}))

// lowerArm rotation
rig.animations.push(new Animation(lowerArm,[
    new Vector(0,       pi * (3 / 4)),//
    new Vector(0.2,     pi * (3 / 4)),
    new Vector(0.3,     pi / 2 + 0.2),
    new Vector(0.5,     pi / 2 + 0.2),//
    new Vector(0.6,     pi / 2 + 0.2),
    new Vector(0.7,     pi / 2+ 0.2),
    new Vector(1,       pi + 0.2),//
    new Vector(1.66,    pi + 0.2),
    new Vector(2.33,    pi * (1 / 4)),
    new Vector(3,       pi * (3 / 4)),//
],(bone, y) =>{
    bone.setRotation(y)
}))

//upperArm rotation
rig.animations.push(new Animation(upperArm,[
    new Vector(0,       pi * (5 / 4)),//
    new Vector(0.2,     pi * (5 / 4)),
    new Vector(0.3,     pi * (6 / 4)),
    new Vector(0.5,     pi * (6 / 4)),//
    new Vector(0.6,     pi * (6 / 4)),
    new Vector(0.7,     pi ),
    new Vector(1,       pi + 0.2),//
    new Vector(2.33,    pi * (5 / 4)),
    new Vector(2.66,    pi * (5 / 4)),
    new Vector(3,       pi * (5 / 4)),//
],(bone, y) =>{
    bone.setRotation(y)
}))
//head rotation
rig.animations.push(new Animation(head,[
    new Vector(0,       pi * (6 / 4)),//
    new Vector(0.2,     pi * (6 / 4)),
    new Vector(0.3,     pi * (4.5 / 4)),
    new Vector(0.5,     pi * (4.5 / 4)),//
    new Vector(0.6,     pi * (4.5 / 4)),
    new Vector(0.7,     pi * (4.5 / 4)),
    new Vector(1,       pi * (4.5 / 4)),//
    new Vector(2.33,    pi * (9 / 4)),
    new Vector(2.66,    pi * (6 / 4)),
    new Vector(3,       pi * (6 / 4)),//
],(bone, y) =>{
    bone.setRotation(y)
}))

setInterval(function(){
    var now = Date.now();
    dt = (now - lastUpdate) / 1000;
    lastUpdate = now;
    EventHandler.trigger('ticktock',{dt})
    draw();
    
}, 1000 / 60);

function draw(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    
    rig.draw(ctxt)
    feet.draw(ctxt);
}