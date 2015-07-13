function Point(x,y){
    this.x = x;
    this.y = y;

    this. drawPoint = function(ctxt){
        var size = 10;
        ctxt.fillRect(this.x - size/2, this.y-size/2, size, size);
    }
}
