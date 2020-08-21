
enum Hor {left,middle,right}
enum Vert {bottom,middle,top}
function createVector(x:Hor,y:Vert):Vector{
    return new Vector(x * 0.5,y * 0.5)
}

var botleft = createVector(Hor.left,Vert.bottom)
var botmiddle = createVector(Hor.middle,Vert.bottom)
var botright = createVector(Hor.right,Vert.bottom)
var middleleft = createVector(Hor.left,Vert.middle)
var center = createVector(Hor.middle,Vert.middle)
var middleright = createVector(Hor.right,Vert.middle)
var topleft = createVector(Hor.left,Vert.top)
var topmiddle = createVector(Hor.middle,Vert.top)
var topright = createVector(Hor.right,Vert.top)

class BezierAnim extends Anim{
    private path:Vector[] = []

    constructor(public controlPoints:Vector[]){
        super()
        this.cacheControlPoints()
    }

    cacheControlPoints(){
        var precision = 11
        this.path = Bezier.cacheSlopeX(precision,Bezier.computeWaypointsContinuously(precision,this.controlPoints))
    }

    getSmooth(){
        return Bezier.tween(this.get(),this.path).y
    }

    getSmoothAt(time:number){
        return Bezier.tween(time,this.path).y
    }

    static in = [botleft,botmiddle]
    static out = [topmiddle,topright]

    static linear = [botleft,center,center,topright]
    static easeInEaseOut = [...BezierAnim.in,...BezierAnim.out]
    static easeOut = [botleft,center,...BezierAnim.out]
    static easeIn = [...BezierAnim.in,center,topright]
}



class Bezier{
    constructor(){

    }

    static getBezierPoint(t:number,p0:Vector,p1:Vector,p2:Vector,p3:Vector):Vector{
        var a = p0.lerp(p1,t)
        var b = p1.lerp(p2,t)
        var c = p2.lerp(p3,t)
        var d = a.lerp(b,t)
        var e = b.lerp(c,t)
        var res = d.lerp(e,t)
        return res
    }

    static computeWaypoints(numberOfWaypoints:number,p0:Vector,p1:Vector,p2:Vector,p3:Vector){
        var spaces = numberOfWaypoints - 1
        var waypoints:Vector[] = [];
        for(var i = 0; i < numberOfWaypoints; i++){
            waypoints.push(Bezier.getBezierPoint(i / spaces, p0,p1,p2,p3))
        }
        return waypoints;
    }

    static computeWaypointsContinuously(waypointsPerSection:number,controlpoints:Vector[]):Vector[]{
        var waypoints:Vector[] = Bezier.computeWaypoints(10,controlpoints[0],controlpoints[1],controlpoints[2],controlpoints[3])
        for(var i = 3; i < controlpoints.length - 3; i += 3){
            var result = Bezier.computeWaypoints(waypointsPerSection,controlpoints[i],controlpoints[i + 1],controlpoints[i + 2],controlpoints[i + 3])
            result.shift()
            waypoints = waypoints.concat(result)
        }
        return waypoints
    }

    static calcLength(waypoints:Vector[]){
        var length = 0;
        for(var i = 1; i < waypoints.length; i++){
            length += waypoints[i].to(waypoints[i - 1]).length()
        }
        return length;
    }

    static tween(t:number, waypoints:Vector[]){
        var lm1 = waypoints.length - 1;
        var low = Math.floor(lm1 * t)
        var high = Math.ceil(lm1 * t)
        return waypoints[low].lerp(waypoints[high],t*lm1 - Math.floor(t*lm1))
    }

    static constantDistanceWaypoints(waypoints:Vector[],numberOfWaypoints:number){
        var length = this.calcLength(waypoints);
        var spacing = length / (numberOfWaypoints - 1)
        var result:Vector[] = [first(waypoints).c()]
        
        var budget = 0
        for(var i = 0; i < waypoints.length - 1; i++){
            var a = waypoints[i]
            var b = waypoints[i + 1]
            var length = a.to(b).length()
            var remainingLength = budget
            budget += length
            var fits = Math.floor((remainingLength + length) / spacing) 
            budget -= fits * spacing
            for(var j = 1; j <= fits; j++){
                result.push(a.lerp(b,(j * spacing - remainingLength) / length))
            }
        }
        result.push(last(waypoints).c())
        return result
    }

    //points need to be guaranteed left to tight
    static cacheSlopeX(samplePoints:number,points:Vector[]):Vector[]{
        var result = []
        var spaces = samplePoints - 1;
        for(var i = 0; i < samplePoints; i++){
            result.push(new Vector(lerp(first(points).x, last(points).x, i / spaces), 0))
        }
        var sectionIndex = 0
        for(var point of result){
            var a = points[sectionIndex]
            var b = points[sectionIndex + 1]
            while(!inRange(a.x,b.x,point.x)){
                sectionIndex++
                a = points[sectionIndex]
                b = points[sectionIndex + 1]
            }
            point.y = map(point.x,a.x,b.x,a.y,b.y)
        }
        return result
    }
}