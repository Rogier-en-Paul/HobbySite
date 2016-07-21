function QuadTree(posA, posB, maxDepth, parent) {
    this.parent = parent;
    this.aabb = new AABB(posA,posB);
    this.bucket = [];

    this.maxDepth = maxDepth;
    this.leave = true;

    this.nw = null;
    this.ne = null;
    this.sw = null;
    this.se = null;
}

QuadTree.prototype.insert = function(vector){
    var leave = this.vectorCollide(vector);

    if(leave.bucket.length >= 1){
        if(leave.maxDepth == 0)leave.bucket.push(vector);
        else{
            var middle = leave.aabb.posB.subtract(leave.aabb.posA).scale(0.5).add(leave.aabb.posA).floor();
            leave.nw = new QuadTree(leave.aabb.posA.clone(), middle.clone(), leave.maxDepth - 1, leave);
            leave.ne = new QuadTree(new Vector(middle.x,leave.aabb.posA.y), new Vector(leave.aabb.posB.x,middle.y), leave.maxDepth - 1, leave);
            leave.sw = new QuadTree(new Vector(leave.aabb.posA.x, middle.y), new Vector(middle.x, leave.aabb.posB.y), leave.maxDepth - 1, leave)
            leave.se = new QuadTree(middle.clone(), leave.aabb.posB.clone(), leave.maxDepth - 1, leave);
            leave.leave = false;
            leave.vectorCollide(leave.bucket[0]).insert(leave.bucket[0]);
            leave.vectorCollide(vector).insert(vector);
            leave.bucket = [];
        }
    }else leave.bucket[0] = vector;
}



QuadTree.prototype.delete = function(){

}

QuadTree.prototype.getClosests = function (vector, n){
    //maybe gif each tree a number because js doesnt support pointers but need a way to save if they have been checked
    var leave = this.vectorCollide(vector);
    if(leave.bucket.length >= n){
        leave.bucket.sort(function(a, b){
            return vector.distance(a) - vector.distance(b);
        });
        return leave.bucket.slice(0, n);
    }

    var vectors = []
    var growingAabb = leave.aabb.clone();
    var leaves = [];
    while(vectors.length < n){
        leaves = this.AABBCollide(growingAabb);
        vectors = [];
        for(var i = 0; i < leaves.length; i++){//assumes posA is top left
            growingAabb.posA.y = min(leaves[i].aabb.posA.y, growingAabb.posA.y);
            growingAabb.posA.x = min(leaves[i].aabb.posA.x, growingAabb.posA.x);
            growingAabb.posB.x = max(leaves[i].aabb.posB.x, growingAabb.posB.x);
            growingAabb.posB.y = max(leaves[i].aabb.posB.y, growingAabb.posB.y);
            vectors = vectors.concat(leaves[i].bucket);
        }

        // if(growingAabb.equals(this.aabb)){
        //     break;
        // }
    }
    vectors.sort(function(a, b){
        return vector.distance(a) - vector.distance(b);
    });
    leaves = this.circleCollide(new Circle(vector, vector.distance(vectors[n - 1])));
    vectors = [];
    for(var i = 0; i < leaves.length; i++){
        vectors = vectors.concat(leaves[i].bucket);
    }
    vectors.sort(function(a, b){
        return vector.distance(a) - vector.distance(b);
    });
    return vectors.slice(0, n)
};

QuadTree.prototype.AABBCollide = function(aabb){//returns all leave trees that collide with the parameter aabb
    //maybe call aabb range search
    //maybe need some other function in aabb and circle that returrns the exact vectors form this rough estimate
    var collidingLeaves = [];
    if(this.leave){
        collidingLeaves.push(this);
        return collidingLeaves;
    };
    if(this.nw.aabb.AABBCollide(aabb))collidingLeaves = collidingLeaves.concat(this.nw.AABBCollide(aabb))
    if(this.ne.aabb.AABBCollide(aabb))collidingLeaves = collidingLeaves.concat(this.ne.AABBCollide(aabb))
    if(this.sw.aabb.AABBCollide(aabb))collidingLeaves = collidingLeaves.concat(this.sw.AABBCollide(aabb))
    if(this.se.aabb.AABBCollide(aabb))collidingLeaves = collidingLeaves.concat(this.se.AABBCollide(aabb))

    return collidingLeaves;
}

QuadTree.prototype.circleCollide = function(circle){//returns all leave trees that collide with the parameter aabb
    var collidingLeaves = [];
    if(this.leave){
        collidingLeaves.push(this);
        return collidingLeaves;
    };
    if(this.nw.aabb.circleCollide(circle))collidingLeaves = collidingLeaves.concat(this.nw.circleCollide(circle))
    if(this.ne.aabb.circleCollide(circle))collidingLeaves = collidingLeaves.concat(this.ne.circleCollide(circle))
    if(this.sw.aabb.circleCollide(circle))collidingLeaves = collidingLeaves.concat(this.sw.circleCollide(circle))
    if(this.se.aabb.circleCollide(circle))collidingLeaves = collidingLeaves.concat(this.se.circleCollide(circle))

    return collidingLeaves;
}

QuadTree.prototype.vectorCollide = function(vector){
    if(this.leave) return this;
    if(this.ne.aabb.vectorCollide(vector))return this.ne.vectorCollide(vector)
    if(this.nw.aabb.vectorCollide(vector))return this.nw.vectorCollide(vector)
    if(this.sw.aabb.vectorCollide(vector))return this.sw.vectorCollide(vector)
    if(this.se.aabb.vectorCollide(vector))return this.se.vectorCollide(vector)
    return null;
}

QuadTree.prototype.getInRange = function (vector,range){

};

QuadTree.prototype.draw = function(){
    if(this.leave){
        var distance = this.aabb.posB.subtract(this.aabb.posA)
        ctxt.strokeRect(this.aabb.posA.x - 0.5, this.aabb.posA.y - 0.5, distance.x, distance.y);
    }else{
        this.nw.draw();
        this.ne.draw();
        this.sw.draw();
        this.se.draw();
    }
}
