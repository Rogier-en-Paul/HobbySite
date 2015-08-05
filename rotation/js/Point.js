function Point(x,y){
    this.x = x;
    this.y = y;
    this.rotation = 0;
}

Point.prototype.drawPoint = function(ctxt){
    var size = 10;
    ctxt.fillRect(this.x - size / 2, this.y - size / 2, size, size);
};

Point.prototype.rotate = function(){

};
