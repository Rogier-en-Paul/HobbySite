var canvas = document.getElementById("mycanvas");
var ctxt = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var boids = generateBoids(30);

setInterval(function () {
    update();
}, 1000 / 60);

function update(){
    ctxt.clearRect(0, 0, width, height);
    updateBoids(boids)
}

function generateBoids(n){
    var boids = [];
    for(var i = 0; i < n; i++){
        boids.push(new Boid(Math.random() * width,Math.random() * height))
    }
}

function updateBoids(boids){
    boids.forEach(function(boid){
        boid.update();
    });
}