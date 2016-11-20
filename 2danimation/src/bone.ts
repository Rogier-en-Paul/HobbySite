import Vector = require('./vector')
import EventHandler = require('./eventHandler')

class Bone{
    pos:Vector
    rotation:Vector
    vertices:Vector[]
    children:Bone[]
    parent:Bone

    constructor(pos:Vector){
        //sets not nescessary if copy is used
        this.pos = pos;
        this.rotation = new Vector(1, 0);
        this.vertices = [];
        this.children = [];
    }

    add(vector:Vector){
        this.pos.add(vector)
        for(var vertex of this.vertices)vertex.add(vector)
        for(var child of this.children)child.add(vector)
    }

    subtract(vector:Vector){
        this.pos.subtract(vector)
        for(var vertex of this.vertices)vertex.subtract(vector)
        for(var child of this.children)child.subtract(vector)
    }

    scale(scalar:number){
        this.pos.scale(scalar)
        for(var vertex of this.vertices)vertex.scale(scalar)
        for(var child of this.children)child.scale(scalar)
    }

    setRotation(r){
        this.rotate(-Math.atan2(this.rotation.y, this.rotation.x) + r)
        this.rotation = new Vector(1, 0).rotate(r);
    }

    rotate(r:number, center = this.pos){
        this.pos.rotate(r, center)
        this.rotation.rotate(r)
        for(var vertex of this.vertices)vertex.rotate(r,center)
        for(var child of this.children)child.rotate(r, center)
    }

    set(vector:Vector){
        var newSpot = vector
        if(this.parent)newSpot = this.parent.pos.copy().add(vector)
        var change = newSpot.copy().subtract(this.pos)

        this.pos.set(newSpot)
        for(var vertex of this.vertices)vertex.add(change)
        for(var child of this.children)child.add(change)
    }

    addChild(bone:Bone){
        bone.parent = this;
        this.children.push(bone)
    }

    draw(ctxt:CanvasRenderingContext2D){
        this.pos.draw(ctxt)
        for(var child of this.children)child.draw(ctxt);
    }

    copy():Bone{
        var bone = new Bone(this.pos.copy());
        bone.vertices = this.vertices.map((entry) => entry.copy())
        bone.rotation = this.rotation.copy()
        bone.children = this.children.map((entry) => entry.copy())
        for(var child of bone.children)child.parent = this;
        return bone
    }

    
}

export = Bone;