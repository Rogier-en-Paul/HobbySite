function Boid(x,y){
    this.position = new Vector(x,y);
    this.nOfNeighbours = 4;
}

Boid.prototype.update = function(){
    this.separate();
    this.align();
    this.cohese();
    this.draw();
};

Boid.prototype.draw = function(){
    ctxt.fillRect(x,y,10,10)
};

Boid.prototype.getNeighbours = function(boids){
    var closestNeighbours = [];
    boids.forEach(function(boid){
        for(var i = 0; i < closestNeighbours.length; i++){

        }
    });
};

Boid.prototype.separate = function(){

};

Boid.prototype.cohese = function(){

};

Boid.prototype.align = function(){
    this.getBoidsInRange()
};

Boid.prototype.calcHeading = function(){
    Math.atan(this.position.y / this.position.x)
};

Boid.calcAveragePosition = function(boids){
    var average = new Vector(0,0);
    boids.forEach(function(boid){
        average.add(boid.position);
    });
    return average.scale(1 / boids.length);
};

Boid.calcAverageHeading = function(boids){
    var average = 0;
    boids.forEach(function(boid){
        average += boid.calcHeading();
    });
    return average / boids.length;
};

Boid.prototype.getBoidsInRange = function(boids,range){
    var closeBoids = [];
    boids.forEach(function(boid){
        if(this.position.distance(boid.position < range)){
            closeBoids.push(boid);
        }
    })
};