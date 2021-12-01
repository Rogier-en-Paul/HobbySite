class Camera{

    pos:Vector = new Vector(0,0)
    scale:Vector = new Vector(1,1)

    constructor(public ctxt:CanvasRenderingContext2D){
        
    }

    begin(){
        ctxt.save()
        var m = this.createMatrixScreen2World().inverse()
        ctxt.transform(m.a,m.b,m.c,m.d,m.e,m.f)
    }

    end(){
        ctxt.restore()
    }

    createMatrixScreen2World(){
        var a = new DOMMatrix([
            1,0,0,1,-screensize.x / 2,-screensize.y / 2
        ])
        
        var b = new DOMMatrix([
            this.scale.x,0,0,this.scale.y,this.pos.x,this.pos.y
        ])
        

        return b.multiply(a)
    }

    screen2world(pos:Vector):Vector{
        var dompoint = this.createMatrixScreen2World().transformPoint(new DOMPoint(pos.x,pos.y))
        return new Vector(dompoint.x,dompoint.y)
    }

    world2screen(pos:Vector):Vector{
        var dompoint = this.createMatrixScreen2World().inverse().transformPoint(new DOMPoint(pos.x,pos.y))
        return new Vector(dompoint.x,dompoint.y)
    }

}