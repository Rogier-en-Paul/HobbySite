import Vector = require('./vector')

class Polygon{
    vertices:Vector[];

    constructor(vertices:Vector[]){
        this.vertices = vertices
    }

    stroke(ctxt:CanvasRenderingContext2D){
        ctxt.beginPath();
        for(var vertex of this.vertices)ctxt.lineTo(vertex.x, vertex.y);
        ctxt.stroke();
    }

    strokeClose(ctxt:CanvasRenderingContext2D){
        ctxt.beginPath();
        for(var vertex of this.vertices)ctxt.lineTo(vertex.x, vertex.y);
        ctxt.closePath();
        ctxt.stroke();
    }

    fill(ctxt:CanvasRenderingContext2D){
        ctxt.beginPath();
        for(var vertex of this.vertices)ctxt.lineTo(vertex.x, vertex.y);
        ctxt.fill();
    }
}

export = Polygon;