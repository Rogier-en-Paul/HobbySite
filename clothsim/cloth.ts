class Anchor{
    pos:Vector = new Vector(0,0)
    vel:Vector = new Vector(0,0)
    acc:Vector = new Vector(0,0)
    mass:number = 1
    locked:boolean = false
    damping:number = 1

    constructor(data:Partial<Anchor>){
        Object.assign(this,data)
    }

    applyforce(dir:Vector,force:number){
        this.vel.add(dir.scale(force / this.mass))
    }

    update(dt){
        if(this.locked == false){
            this.vel.add(this.acc.c().scale(dt))

            this.vel.add(this.vel.c().scale(-1).scale(globaldampening * dt))


            this.pos.add(this.vel.c().scale(dt))
        }
    }
}

class Spring{
    length:number
    stiffness:number
    a:Anchor
    b:Anchor
    

    constructor(data:Partial<Spring>){
        Object.assign(this,data)
    }

    update(dt){
        var dist = this.a.pos.to(this.b.pos).length()
        var force = (this.length - dist) * -globalstiffness * dt// contracting positive, expanding negative
        this.a.applyforce(this.a.pos.to(this.b.pos).normalize(), force / 2)
        this.b.applyforce(this.b.pos.to(this.a.pos).normalize(), force / 2)
    }

    draw(){
        this.a.pos.draw(ctxt)
        this.b.pos.draw(ctxt)
        ctxt.beginPath()
        ctxt.moveTo(this.a.pos.x,this.a.pos.y)
        ctxt.lineTo(this.b.pos.x,this.b.pos.y)
        ctxt.stroke()
    }
}