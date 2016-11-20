import Bone = require('./bone')
import Vector = require('./vector')
import Bezier = require('./bezier')

class Animation{//deformer
    animationPoint:number
    bone:Bone
    graph:Vector[]
    property:(bone:Bone, y:number) => void

    constructor(bone:Bone, graph:Vector[], property:(bone:Bone, y:number) => void){
        this.animationPoint = 0;
        this.graph = graph;
        this.bone = bone;
        this.property = property;
    }

    update(dt:number){
        this.animationPoint += dt
        this.animationPoint %= this.graph[this.graph.length -1].x;
        
        this.property(this.bone, Bezier.pathFindRoot(this.animationPoint, this.graph))
        // this.property(this.bone, Bezier.pathquerp(this.animationPoint / this.graph[this.graph.length -1].x, this.graph))
    }
}

export = Animation