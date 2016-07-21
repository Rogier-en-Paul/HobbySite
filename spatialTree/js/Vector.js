function Vector(x,y){
    this.x = x;
    this.y = y;
}

Vector.prototype.project = function(vector){//projects parameter on this
    return this.scale(this.dot(vector) / this.dot(this))
}

Vector.prototype.weightedAverage = function(vector, weight){
    return this.scale(1 - weight).add(vector.scale(weight));
}

Vector.prototype.dot = function(vector){
    return this.x * vector.x + this.y * vector.y;
}

Vector.prototype.subtract = function(vector){
    var x = this.x - vector.x;
    var y = this.y - vector.y;
    return new Vector(x, y)
};

Vector.prototype.add = function(vector){
    var x = this.x + vector.x;
    var y = this.y + vector.y;
    return new Vector(x, y);
};

Vector.prototype.closest = function(vectors){
    if(vectors.length == 0)return null;
    var champ = vectors[0];
    var champDistance = this.distance(vectors[0]);
    for(var i = 1; i < vectors.length; i++){
        var distance = this.distance(vector[i]);
        if(distance < champDistance){
            champ = vectors[i];
            champDistance = distance;
        }
    }
    return champ;
}

Vector.prototype.distance = function(vector){
    return this.subtract(vector).length();
}

Vector.prototype.length = function(){
    return Math.pow(this.x * this.x + this.y * this.y, 0.5);
}

Vector.prototype.scale = function(scalar){
    return new Vector(this.x * scalar, this.y * scalar);
};

Vector.prototype.floor = function(){
    return new Vector(Math.floor(this.x), Math.floor(this.y))
}

Vector.prototype.equals = function(vector){
    return vector.x == this.x && vector.y == this.y;
};

Vector.prototype.clone = function(){
    return new Vector(this.x, this.y);
};

Vector.prototype.draw = function(){
    var width = 4;
    var halfwidth = width / 2;
    ctxt.fillRect(this.x - halfwidth, this.y - halfwidth, width, width)
}
