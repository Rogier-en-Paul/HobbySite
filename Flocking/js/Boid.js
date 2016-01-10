function Boid(x,y){
    this.position = new Vector(x,y);
    this.speed = new Vector(5,0);
    this.nOfNeighbours = 4;
    this.turnspeed = 0.1;
    this.neighbourRadius = 40;
    this.desiredSeparation = 10;
}

Boid.prototype.update = function(){
    this.speed.add(this.calcSeparationForce());
    this.speed.add(this.calcCohesionForce());
    this.speed.align();//todo still doesnt work
    this.position.add(this.speed);
    this.position.x %= width;
    this.position.y %= height;
    this.draw();
};

Boid.prototype.draw = function(){
    ctxt.fillRect(this.position.x,this.position.y,10,10);
    var normal = this.speed.normalize();
    Boid.drawLine(this.position.x + 5,this.position.y + 5, normal.x * 10, normal.y * 10);
};

Boid.prototype.calcSeparationForce = function(){
    var averagePosition = Boid.calcAveragePosition(this.getBoidsInRange(boids, this.desiredSeparation));
    var distanceToAveragePosition = this.position.subtract(averagePosition);
    if(distanceToAveragePosition < this.desiredSeparation){
        var seperationForce = 1 / distanceToAveragePosition.calcLength();
        return seperationForce.rotate(2 * Math.PI);
    }
    return new Vector(0,0);
};

Boid.prototype.calcCohesionForce = function(){
    var averagePosition = Boid.calcAveragePosition(this.getBoidsInRange(boids, this.neighbourRadius));
    var distanceToAveragePosition = this.position.subtract(averagePosition);
    if(distanceToAveragePosition < this.neighbourRadius){
        return 1 / distanceToAveragePosition.calcLength();
    }
    return new Vector(0,0);
};

Boid.prototype.align = function(){
    var averageHeading = Boid.calcAverageHeading(this.getBoidsInRange(this.getNeighbours(),60));
    var myAngle = this.position.calcAngle();
    var difference = averageHeading - myAngle;
    if(difference > this.turnspeed){
        return this.turnspeed;
    }
    return difference;
};

Boid.prototype.getNeighbours = function(boids){
    boids.sort(function(boid1, boid2){
        var distanceToBoid1 = position.calcDistance(boid1.position);
        var distanceToBoid2 = position.calcDistance(boid2.position);
        if(distanceToBoid1 > distanceToBoid2){
            return 1;
        } else if(distanceToBoid1 < distanceToBoid2){
            return -1;
        }
        return 0;
    });


    return boids.splice(0,this.nOfNeighbours + 1);
    //todo remove yourself from neighbours
};

//this could be done faster since the boids passed to this function originate from getNeighbour and those are sorted by distance from the method calling Boid
Boid.prototype.getBoidsInRange = function(boids,range){
    var closeBoids = [];
    boids.forEach(function(boid){
        if(this.position.calcDistance(boid.position < range)){
            closeBoids.push(boid);
        }
    })
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

Boid.drawLine = function(x1,y1,x2,y2){
    ctxt.beginPath();
    ctxt.moveTo(x1, y1);
    ctxt.lineTo(x2, y2);
    ctxt.stroke();
};