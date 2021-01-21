class Sprite{
    id:number
    
    constructor(public img:HTMLImageElement, public rotations:number,public ctxt:CanvasRenderingContext2D){

    }

    draw(pos:Vector,tilesieze:Vector){
        this.ctxt.save()
        this.ctxt.rotate(this.rotations * TAU)

        this.ctxt.drawImage(this.img,pos.x,pos.y,tilesieze.x,tilesieze.y)
        this.ctxt.restore()
    }

    static rotated(img:HTMLImageElement,ctxt:CanvasRenderingContext2D){
        return [
            new Sprite(img,0,ctxt),
            new Sprite(img,0.25,ctxt),
            new Sprite(img,0.5,ctxt),
            new Sprite(img,0.75,ctxt),
        ]
        
    }

}

function drawImage(img:HTMLImageElement,ctxt:CanvasRenderingContext2D,pos:Vector,size:Vector,rotations){
    ctxt.save()
    var offset = pos.c().add(size.c().scale(0.5))
    ctxt.translate(offset.x,offset.y)
    ctxt.rotate(rotations * TAU)
    ctxt.translate(-offset.x,-offset.y)
    ctxt.drawImage(img,pos.x,pos.y,size.x,size.y)
    ctxt.restore()
}