function Point(x,y){
    this.x = x;
    this.y = y;

}

Point.prototype.drawPoint = function(){
    var size = 10;
    ctxt.fillRect(this.x - size / 2 + 250, this.y - size / 2 + 250, size, size);
};


