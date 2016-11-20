import Vector = require('./Vector')
import Bezier = require('./bezier')
import Bone = require('./bone')
import EventHandler = require('./eventHandler')
import Polygon = require('./polygon')
import Animation = require('./animation')

class Rig{
    bone:Bone
    polygons:Polygon[]
    animations:Animation[]

    constructor(){
        this.animations = [];
        this.polygons = []
        EventHandler.subscribe('ticktock', (data) => {
            for(var animation of this.animations)animation.update(data.dt)
        })
    }

    draw(ctxt:CanvasRenderingContext2D){
        for(var polygon of this.polygons)polygon.stroke(ctxt)
    }

    copy():Rig{
        return null;
    }
}

export = Rig;