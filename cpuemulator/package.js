class Vector {
    constructor(...vals) {
        this.vals = vals;
    }
    map(callback) {
        for (var i = 0; i < this.vals.length; i++) {
            callback(this.vals, i);
        }
        return this;
    }
    mul(v) {
        return this.map((arr, i) => arr[i] *= v.vals[i]);
    }
    div(v) {
        return this.map((arr, i) => arr[i] /= v.vals[i]);
    }
    add(v) {
        return this.map((arr, i) => arr[i] += v.vals[i]);
    }
    sub(v) {
        return this.map((arr, i) => arr[i] -= v.vals[i]);
    }
    scale(s) {
        return this.map((arr, i) => arr[i] *= s);
    }
    length() {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * arr[i]);
        return Math.pow(sum, 0.5);
    }
    normalize() {
        return this.scale(1 / this.length());
    }
    to(v) {
        return v.c().sub(this);
    }
    lerp(v, weight) {
        return this.c().add(this.to(v).scale(weight));
    }
    c() {
        return Vector.fromArray(this.vals.slice());
    }
    overwrite(v) {
        return this.map((arr, i) => arr[i] = v.vals[i]);
    }
    dot(v) {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * v.vals[i]);
        return sum;
    }
    loop(callback) {
        var counter = this.c();
        counter.vals.fill(0);
        while (counter.compare(this) == -1) {
            callback(counter);
            if (counter.incr(this)) {
                break;
            }
        }
    }
    compare(v) {
        for (var i = this.vals.length - 1; i >= 0; i--) {
            if (this.vals[i] < v.vals[i]) {
                continue;
            }
            else if (this.vals[i] == v.vals[i]) {
                return 0;
            }
            else {
                return 1;
            }
        }
        return -1;
    }
    incr(comparedTo) {
        for (var i = 0; i < this.vals.length; i++) {
            if ((this.vals[i] + 1) < comparedTo.vals[i]) {
                this.vals[i]++;
                return false;
            }
            else {
                this.vals[i] = 0;
            }
        }
        return true;
    }
    project(v) {
        return v.c().scale(this.dot(v) / v.dot(v));
    }
    get(i) {
        return this.vals[i];
    }
    set(i, val) {
        this.vals[i] = val;
    }
    get x() {
        return this.vals[0];
    }
    get y() {
        return this.vals[1];
    }
    get z() {
        return this.vals[2];
    }
    set x(val) {
        this.vals[0] = val;
    }
    set y(val) {
        this.vals[1] = val;
    }
    set z(val) {
        this.vals[2] = val;
    }
    draw(ctxt) {
        var width = 10;
        var halfwidth = width / 2;
        ctxt.fillRect(this.x - halfwidth, this.y - halfwidth, width, width);
    }
    cross(v) {
        var x = this.y * v.z - this.z * v.y;
        var y = this.z * v.x - this.x * v.z;
        var z = this.x * v.y - this.y * v.x;
        return new Vector(x, y, z);
    }
    static fromArray(vals) {
        var x = new Vector();
        x.vals = vals;
        return x;
    }
    loop2d(callback) {
        var counter = new Vector(0, 0);
        for (counter.x = 0; counter.x < this.x; counter.x++) {
            for (counter.y = 0; counter.y < this.y; counter.y++) {
                callback(counter);
            }
        }
    }
    loop3d(callback) {
        var counter = new Vector(0, 0, 0);
        for (counter.x = 0; counter.x < this.x; counter.x++) {
            for (counter.y = 0; counter.y < this.y; counter.y++) {
                for (counter.z = 0; counter.z < this.z; counter.z++) {
                    callback(counter);
                }
            }
        }
    }
}
// (window as any).devtoolsFormatters = [
//     {
//         header: function(obj, config){
//             if(!(obj instanceof Vector)){
//                 return null
//             }
//             if((obj.vals.length == 2)){
//                 return ["div",{style:""}, `x:${obj.x} y:${obj.y}`]
//             }
//             if((obj.vals.length == 3)){
//                 return ["div",{style:""}, `x:${obj.x} y:${obj.y} z:${obj.z}`]
//             }
//         },
//         hasBody: function(obj){
//             return false
//         },
//     }
// ]
/// <reference path="node_modules/vectorx/vector.ts" />
var TAU = Math.PI * 2;
function map(val, from1, from2, to1, to2) {
    return lerp(to1, to2, inverseLerp(val, from1, from2));
}
function inverseLerp(val, a, b) {
    return to(a, val) / to(a, b);
}
function inRange(min, max, value) {
    if (min > max) {
        var temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}
function min(a, b) {
    if (a < b)
        return a;
    return b;
}
function max(a, b) {
    if (a > b)
        return a;
    return b;
}
function clamp(val, min, max) {
    return this.max(this.min(val, max), min);
}
function rangeContain(a1, a2, b1, b2) {
    return max(a1, a2) >= max(b1, b2) && min(a1, a2) <= max(b1, b2);
}
function createNDimArray(dimensions, fill) {
    if (dimensions.length > 0) {
        function helper(dimensions) {
            var dim = dimensions[0];
            var rest = dimensions.slice(1);
            var newArray = new Array();
            for (var i = 0; i < dim; i++) {
                newArray[i] = helper(rest);
            }
            return newArray;
        }
        var array = helper(dimensions);
        var looper = new Vector(0, 0);
        looper.vals = dimensions;
        looper.loop((pos) => {
            setElement(array, pos.vals, fill(pos));
        });
        return array;
    }
    else {
        return undefined;
    }
}
function getElement(array, indices) {
    if (indices.length == 0) {
        return null;
    }
    else {
        return getElement(array[indices[0]], indices.slice(1));
    }
}
function setElement(array, pos, val) {
    if (pos.length == 1) {
        array[pos[0]] = val;
    }
    else {
        setElement(array[pos[0]], pos.slice(1), val);
    }
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}
function createCanvas(x, y) {
    var canvas = document.createElement('canvas');
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas);
    var ctxt = canvas.getContext('2d');
    return { ctxt: ctxt, canvas: canvas };
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function randomSpread(center, spread) {
    var half = spread / 2;
    return random(center - half, center + half);
}
var lastUpdate = Date.now();
function loop(callback) {
    var now = Date.now();
    callback(now - lastUpdate);
    lastUpdate = now;
    requestAnimationFrame(() => {
        loop(callback);
    });
}
function mod(number, modulus) {
    return ((number % modulus) + modulus) % modulus;
}
function* iter(n) {
    var i = 0;
    while (i < n)
        yield i++;
}
var keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
});
function getMoveInput() {
    var dir = new Vector(0, 0);
    if (keys[37] || keys[65])
        dir.x--; //left
    if (keys[38] || keys[87])
        dir.y++; //up
    if (keys[39] || keys[68])
        dir.x++; //right
    if (keys[40] || keys[83])
        dir.y--; //down
    return dir;
}
function getMoveInputYFlipped() {
    var input = getMoveInput();
    input.y *= -1;
    return input;
}
function getFiles(strings) {
    var promises = [];
    for (var string of strings) {
        var promise = fetch(string)
            .then(resp => resp.text())
            .then(text => text);
        promises.push(promise);
    }
    return Promise.all(promises);
}
function findbestIndex(list, evaluator) {
    if (list.length < 1) {
        return -1;
    }
    var bestIndex = 0;
    var bestscore = evaluator(list[0]);
    for (var i = 1; i < list.length; i++) {
        var score = evaluator(list[i]);
        if (score > bestscore) {
            bestscore = score;
            bestIndex = i;
        }
    }
    return bestIndex;
}
function createAndAppend(element, html) {
    var result = string2html(html);
    element.appendChild(result);
    return result;
}
function string2html(string) {
    var div = document.createElement('div');
    div.innerHTML = string;
    return div.children[0];
}
function line(ctxt, a, b) {
    ctxt.beginPath();
    ctxt.moveTo(a.x, a.y);
    ctxt.lineTo(b.x, b.y);
    ctxt.stroke();
}
function lerp(a, b, r) {
    return a + to(a, b) * r;
}
function to(a, b) {
    return b - a;
}
function swap(arr, a = 0, b = 1) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}
class RNG {
    constructor(seed) {
        this.seed = seed;
        this.mod = 4294967296;
        this.multiplier = 1664525;
        this.increment = 1013904223;
    }
    next() {
        this.seed = (this.multiplier * this.seed + this.increment) % this.mod;
        return this.seed;
    }
    norm() {
        return this.next() / this.mod;
    }
    range(min, max) {
        return this.norm() * to(min, max) + min;
    }
}
function last(arr) {
    return arr[arr.length - 1];
}
function findAndDelete(arr, item) {
    arr.splice(arr.findIndex(v => v == item), 1);
}
class StopWatch {
    constructor() {
        this.starttimestamp = Date.now();
        this.pausetimestamp = Date.now();
        this.pausetime = 0;
        this.paused = true;
    }
    get() {
        var currentamountpaused = 0;
        if (this.paused) {
            currentamountpaused = to(this.pausetimestamp, Date.now());
        }
        return to(this.starttimestamp, Date.now()) - (this.pausetime + currentamountpaused);
    }
    start() {
        this.paused = false;
        this.starttimestamp = Date.now();
        this.pausetime = 0;
    }
    continue() {
        if (this.paused) {
            this.paused = false;
            this.pausetime += to(this.pausetimestamp, Date.now());
        }
    }
    pause() {
        if (this.paused == false) {
            this.paused = true;
            this.pausetimestamp = Date.now();
        }
    }
    reset() {
        this.paused = true;
        this.starttimestamp = Date.now();
        this.pausetimestamp = Date.now();
        this.pausetime = 0;
    }
}
class Router {
    constructor() {
        this.listeners = [];
    }
    listen(regex, listener) {
        this.listeners.push(new RouteRegistration(regex, listener));
    }
    trigger(string) {
        for (var routeRegistration of this.listeners) {
            var result = routeRegistration.regex.exec(string);
            if (result != null) {
                routeRegistration.listener(result);
                break;
            }
        }
    }
    pushTrigger(url) {
        window.history.pushState(null, null, url);
        this.trigger(url);
    }
}
class RouteRegistration {
    constructor(regex, listener) {
        this.regex = regex;
        this.listener = listener;
    }
}
class Rule {
    constructor(message, cb) {
        this.message = message;
        this.cb = cb;
    }
}
class Ability {
    constructor(cb) {
        this.cb = cb;
        // ammo:number = 1
        // maxammo:number = 1
        // ammorechargerate:number = 1000
        // casttime:number = 2000
        // channelduration:number = 3000
        this.cooldown = 1000;
        this.lastfire = Date.now();
        this.rules = [
            new Rule('not ready yet', () => (this.lastfire + this.cooldown) < Date.now()),
        ];
        this.stopwatch = new StopWatch();
        this.ventingtime = 0;
        this.onCastFinished = new EventSystemVoid();
        this.shots = 0;
        this.firing = false;
    }
    //positive if you need to wait 0 or negative if you can call it
    timeTillNextPossibleActivation() {
        return to(Date.now(), this.lastfire + this.cooldown);
    }
    canActivate() {
        return this.rules.some(r => r.cb());
    }
    callActivate() {
        this.cb();
    }
    fire() {
        if (this.firing == false) {
            this.startfire();
        }
        else {
            this.holdfire();
        }
    }
    releasefire() {
        this.firing = false;
    }
    tapfire() {
        this.startfire();
        this.releasefire();
    }
    startfire() {
        if (this.rules.some(r => r.cb())) {
            this.firing = true;
            this.ventingtime = 0;
            this.stopwatch.start();
            this.ventingtime -= this.cooldown;
            this.shots = 1;
            this.lastfire = Date.now();
            this.cb();
        }
    }
    holdfire() {
        this.ventingtime += this.stopwatch.get();
        this.stopwatch.start();
        this.shots = Math.ceil(this.ventingtime / this.cooldown);
        this.ventingtime -= this.shots * this.cooldown;
        this.lastfire = Date.now();
        if (this.shots > 0) {
            this.cb();
        }
    }
}
var AnimType;
(function (AnimType) {
    AnimType[AnimType["once"] = 0] = "once";
    AnimType[AnimType["repeat"] = 1] = "repeat";
    AnimType[AnimType["pingpong"] = 2] = "pingpong";
    AnimType[AnimType["extend"] = 3] = "extend";
})(AnimType || (AnimType = {}));
class Anim {
    constructor() {
        this.animType = AnimType.once;
        this.reverse = false;
        this.duration = 1000;
        this.stopwatch = new StopWatch();
        this.begin = 0;
        this.end = 1;
    }
    get() {
        var cycles = this.stopwatch.get() / this.duration;
        switch (this.animType) {
            case AnimType.once:
                return clamp(lerp(this.begin, this.end, cycles), this.begin, this.end);
            case AnimType.repeat:
                return lerp(this.begin, this.end, mod(cycles, 1));
            case AnimType.pingpong:
                var pingpongcycle = mod(cycles, 2);
                if (pingpongcycle <= 1) {
                    return lerp(this.begin, this.end, pingpongcycle);
                }
                else {
                    return lerp(this.end, this.begin, pingpongcycle - 1);
                }
            case AnimType.extend:
                var distPerCycle = to(this.begin, this.end);
                return Math.floor(cycles) * distPerCycle + lerp(this.begin, this.end, mod(cycles, 1));
        }
    }
}
var Hor;
(function (Hor) {
    Hor[Hor["left"] = 0] = "left";
    Hor[Hor["middle"] = 1] = "middle";
    Hor[Hor["right"] = 2] = "right";
})(Hor || (Hor = {}));
var Vert;
(function (Vert) {
    Vert[Vert["bottom"] = 0] = "bottom";
    Vert[Vert["middle"] = 1] = "middle";
    Vert[Vert["top"] = 2] = "top";
})(Vert || (Vert = {}));
function createVector(x, y) {
    return new Vector(x * 0.5, y * 0.5);
}
var zero = new Vector(0, 0);
var one = new Vector(1, 1);
var minusone = new Vector(-1, -1);
var half = new Vector(0.5, 0.5);
var botleft = createVector(Hor.left, Vert.bottom);
var botmiddle = createVector(Hor.middle, Vert.bottom);
var botright = createVector(Hor.right, Vert.bottom);
var middleleft = createVector(Hor.left, Vert.middle);
var center = createVector(Hor.middle, Vert.middle);
var middleright = createVector(Hor.right, Vert.middle);
var topleft = createVector(Hor.left, Vert.top);
var topmiddle = createVector(Hor.middle, Vert.top);
var topright = createVector(Hor.right, Vert.top);
class BezierAnim extends Anim {
    constructor(controlPoints) {
        super();
        this.controlPoints = controlPoints;
        this.path = [];
        this.cacheControlPoints();
    }
    cacheControlPoints() {
        var precision = 11;
        this.path = Bezier.cacheSlopeX(precision, Bezier.computeWaypointsContinuously(precision, this.controlPoints));
    }
    getSmooth() {
        return Bezier.tween(this.get(), this.path).y;
    }
}
BezierAnim.in = [botleft, botmiddle];
BezierAnim.out = [topmiddle, topright];
BezierAnim.linear = [botleft, center, center, topright];
BezierAnim.easeInEaseOut = [...BezierAnim.in, ...BezierAnim.out];
BezierAnim.easeOut = [botleft, center, ...BezierAnim.out];
BezierAnim.easeIn = [...BezierAnim.in, center, topright];
class Bezier {
    constructor() {
    }
    static getBezierPoint(t, p0, p1, p2, p3) {
        var a = p0.lerp(p1, t);
        var b = p1.lerp(p2, t);
        var c = p2.lerp(p3, t);
        var d = a.lerp(b, t);
        var e = b.lerp(c, t);
        var res = d.lerp(e, t);
        return res;
    }
    static computeWaypoints(numberOfWaypoints, p0, p1, p2, p3) {
        var spaces = numberOfWaypoints - 1;
        var waypoints = [];
        for (var i = 0; i < numberOfWaypoints; i++) {
            waypoints.push(Bezier.getBezierPoint(i / spaces, p0, p1, p2, p3));
        }
        return waypoints;
    }
    static computeWaypointsContinuously(waypointsPerSection, controlpoints) {
        var waypoints = Bezier.computeWaypoints(10, controlpoints[0], controlpoints[1], controlpoints[2], controlpoints[3]);
        for (var i = 3; i < controlpoints.length - 3; i += 3) {
            var result = Bezier.computeWaypoints(waypointsPerSection, controlpoints[i], controlpoints[i + 1], controlpoints[i + 2], controlpoints[i + 3]);
            result.shift();
            waypoints = waypoints.concat(result);
        }
        return waypoints;
    }
    static calcLength(waypoints) {
        var length = 0;
        for (var i = 1; i < waypoints.length; i++) {
            length += waypoints[i].to(waypoints[i - 1]).length();
        }
        return length;
    }
    static tween(t, waypoints) {
        var lm1 = waypoints.length - 1;
        var low = Math.floor(lm1 * t);
        var high = Math.ceil(lm1 * t);
        return waypoints[low].lerp(waypoints[high], t * lm1 - Math.floor(t * lm1));
    }
    static constantDistanceWaypoints(waypoints, numberOfWaypoints) {
        var length = this.calcLength(waypoints);
        var spacing = length / (numberOfWaypoints - 1);
        var result = [first(waypoints).c()];
        var budget = 0;
        for (var i = 0; i < waypoints.length - 1; i++) {
            var a = waypoints[i];
            var b = waypoints[i + 1];
            var length = a.to(b).length();
            var remainingLength = budget;
            budget += length;
            var fits = Math.floor((remainingLength + length) / spacing);
            budget -= fits * spacing;
            for (var j = 1; j <= fits; j++) {
                result.push(a.lerp(b, (j * spacing - remainingLength) / length));
            }
        }
        result.push(last(waypoints).c());
        return result;
    }
    //points need to be guaranteed left to tight
    static cacheSlopeX(samplePoints, points) {
        var result = [];
        var spaces = samplePoints - 1;
        for (var i = 0; i < samplePoints; i++) {
            result.push(new Vector(lerp(first(points).x, last(points).x, i / spaces), 0));
        }
        var sectionIndex = 0;
        for (var point of result) {
            var a = points[sectionIndex];
            var b = points[sectionIndex + 1];
            while (!inRange(a.x, b.x, point.x)) {
                sectionIndex++;
                a = points[sectionIndex];
                b = points[sectionIndex + 1];
            }
            point.y = map(point.x, a.x, b.x, a.y, b.y);
        }
        return result;
    }
}
function first(arr) {
    return arr[0];
}
function cacheSin(precision) {
    for (var i = 0; i < precision; i++) {
        sinCache[i] = Math.sin((i / precision) * TAU);
    }
}
var sinCache = [];
cacheSin(360);
function sinCached(radians) {
    var percentage = mod(radians, TAU) / TAU;
    var abs = percentage * sinCache.length;
    var bot = Math.floor(abs);
    var top = Math.ceil(abs);
    var remains = abs - bot;
    return lerp(sinCache[bot], sinCache[top % sinCache.length], remains);
}
function cacheCos(precision) {
    for (var i = 0; i < precision; i++) {
        cosCache[i] = Math.cos((i / precision) * TAU);
    }
}
var cosCache = [];
cacheCos(360);
function cosCached(radians) {
    var percentage = mod(radians, TAU) / TAU;
    var abs = percentage * cosCache.length;
    var bot = Math.floor(abs);
    var top = Math.ceil(abs);
    var remains = abs - bot;
    return lerp(cosCache[bot], cosCache[top % cosCache.length], remains);
}
function rotate2d(v, rotations) {
    var s = sinCached(rotations * TAU);
    var c = cosCached(rotations * TAU);
    var x = v.x * c - v.y * s;
    var y = v.x * s + v.y * c;
    v.x = x;
    v.y = y;
    return v;
}
function rotate2dCenter(v, rotations, center) {
    v.sub(center);
    rotate2d(v, rotations);
    v.add(center);
    return v;
}
function loadImages(urls) {
    var promises = [];
    for (var url of urls) {
        promises.push(new Promise((res, rej) => {
            var image = new Image();
            image.onload = e => {
                res(image);
            };
            image.src = url;
        }));
    }
    return Promise.all(promises);
}
function convertImages2Imagedata(images) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var result = [];
    for (var img of images) {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        result.push(context.getImageData(0, 0, img.width, img.height));
    }
    return result;
}
function round(v) {
    return v.map((arr, i) => arr[i] = Math.round(arr[i]));
}
function floor(v) {
    return v.map((arr, i) => arr[i] = Math.floor(arr[i]));
}
function addrange(a, b) {
    for (var v of b) {
        a.push(v);
    }
}
function create2DArray(size, filler) {
    var result = new Array(size.y);
    for (var i = 0; i < size.y; i++) {
        result[i] = new Array(size.x);
    }
    size.loop2d(v => {
        result[v.y][v.x] = filler(v);
    });
    return result;
}
function contains(box, point) {
    return inRange(0, box.x, point.x) && inRange(0, box.y, point.y);
}
function get2DArraySize(arr) {
    return new Vector(arr[0].length, arr.length);
}
function index2D(arr, i) {
    return arr[i.y][i.x];
}
function copy2dArray(arr) {
    return create2DArray(get2DArraySize(arr), pos => index2D(arr, pos));
}
class Op {
    constructor(type, cb, size) {
        this.type = type;
        this.cb = cb;
        this.size = size;
        this.name = cb.name;
    }
}
var flag;
(function (flag) {
    flag[flag["negative"] = 0] = "negative";
    flag[flag["zero"] = 1] = "zero";
    flag[flag["carry"] = 2] = "carry";
})(flag || (flag = {}));
class CPUEmulator {
    constructor() {
        this.registers = [0, 0];
        this.ic = 0; //instruction counter
        this.stack = [];
        this.flags = [false, false, false];
        this.memory = [];
        this.ops = [];
        this.ops[OpT.noop] = new Op(OpT.noop, this.noop, 1);
        this.ops[OpT.load] = new Op(OpT.load, this.load, 3);
        this.ops[OpT.store] = new Op(OpT.store, this.store, 3);
        this.ops[OpT.storereg] = new Op(OpT.storereg, this.storereg, 1);
        this.ops[OpT.dref] = new Op(OpT.dref, this.dref, 3);
        this.ops[OpT.dreg] = new Op(OpT.dreg, this.dreg, 2);
        this.ops[OpT.drega] = new Op(OpT.drega, this.drega, 1);
        this.ops[OpT.dregb] = new Op(OpT.dregb, this.dregb, 1);
        this.ops[OpT.add] = new Op(OpT.add, this.add, 1);
        this.ops[OpT.sub] = new Op(OpT.sub, this.sub, 1);
        this.ops[OpT.mul] = new Op(OpT.mul, this.mul, 1);
        this.ops[OpT.div] = new Op(OpT.div, this.div, 1);
        this.ops[OpT.or] = new Op(OpT.or, this.or, 1);
        this.ops[OpT.and] = new Op(OpT.and, this.and, 1);
        this.ops[OpT.cmp] = new Op(OpT.cmp, this.cmp, 1);
        this.ops[OpT.jmp] = new Op(OpT.jmp, this.jmp, 1);
        this.ops[OpT.branch] = new Op(OpT.branch, this.branch, 3);
        this.ops[OpT.call] = new Op(OpT.call, this.call, 1);
        this.ops[OpT.ret] = new Op(OpT.ret, this.ret, 1);
        this.ops[OpT.print] = new Op(OpT.print, this.print, 1);
        this.ops[OpT.halt] = new Op(OpT.halt, this.halt, 1);
    }
    reset() {
        this.registers = [0, 0];
        this.ic = 0;
        this.stack = [];
        this.flags = [false, false, false];
    }
    exec() {
        cpu.ic = 0;
        for (var i = 0; i < 1000 && this.ic < this.memory.length; i++) {
            this.step();
        }
    }
    step() {
        if (this.ic < this.memory.length) {
            var opi = this.memory[this.ic];
            var op = this.ops[opi];
            op.cb.call(this);
            this.ic += op.size;
        }
    }
    noop() {
    }
    dref() {
        this.registers[this.memory[this.ic + 1]] = this.memory[this.memory[this.ic + 2]];
    }
    dreg() {
        this.registers[this.memory[this.ic + 1]] = this.memory[this.registers[this.ic + 1]];
    }
    drega() {
        this.registers[0] = this.memory[this.registers[0]];
    }
    dregb() {
        this.registers[1] = this.memory[this.registers[1]];
    }
    load() {
        this.registers[this.memory[this.ic + 1]] = this.memory[this.ic + 2];
    }
    store() {
        this.memory[this.memory[this.ic + 2]] = this.registers[this.memory[this.ic + 1]];
    }
    add() {
        this.registers[1] = this.registers[0] + this.registers[1];
    }
    sub() {
        this.registers[1] = this.registers[0] - this.registers[1];
    }
    mul() {
        this.registers[1] = this.registers[0] * this.registers[1];
    }
    div() {
        this.registers[1] = Math.floor(this.registers[0] / this.registers[1]);
    }
    or() {
        this.registers[1] = this.registers[0] | this.registers[1];
    }
    and() {
        this.registers[1] = this.registers[0] & this.registers[1];
    }
    cmp() {
        var res = this.registers[0] - this.registers[1];
        this.flags[flag.zero] = res == 0;
        this.flags[flag.negative] = res < 0;
    }
    branch() {
        if ((this.memory[this.ic + 1] == this.flags[flag.negative]) && this.memory[this.ic + 2] == (this.flags[flag.zero])) {
            this.ic = this.registers[1] - this.ops[OpT.branch].size;
        }
    }
    jmp() {
        this.ic = this.registers[1] - this.ops[OpT.jmp].size;
    }
    je() {
        if (!this.flags[flag.negative] && this.flags[flag.zero]) {
            this.jmp();
        }
    }
    jz() {
        this.je();
    }
    jne() {
        if (!this.flags[flag.negative] && !this.flags[flag.zero]) {
            this.jmp();
        }
    }
    jnz() {
        this.jne();
    }
    jg() {
        if (!this.flags[flag.negative] && !this.flags[flag.zero]) {
            this.jmp();
        }
    }
    print() {
        console.log(this.registers[1]);
    }
    jnle() {
        this.jg();
    }
    jge() {
        if (!this.flags[flag.negative] && this.flags[flag.zero]) {
            this.jmp();
        }
    }
    jnl() {
        this.jge();
    }
    jl() {
        if (this.flags[flag.negative] && !this.flags[flag.zero]) {
            this.jmp();
        }
    }
    jnge() {
        this.jl();
    }
    jle() {
        if (this.flags[flag.negative] && this.flags[flag.zero]) {
            this.jmp();
        }
    }
    jng() {
        this.jle();
    }
    call() {
        this.stack.push(this.ic);
        this.jmp();
    }
    ret() {
        this.ic = this.stack.pop();
    }
    halt() {
        this.ic = this.memory.length - 1;
    }
    storereg() {
        this.memory[this.registers[0]] = this.registers[1];
    }
}
class Param {
    constructor(drefCount, value) {
        this.drefCount = drefCount;
        this.value = value;
    }
    c() {
        return new Param(this.drefCount, this.value);
    }
}
var OpT;
(function (OpT) {
    OpT[OpT["noop"] = 0] = "noop";
    OpT[OpT["dref"] = 1] = "dref";
    OpT[OpT["dreg"] = 2] = "dreg";
    OpT[OpT["drega"] = 3] = "drega";
    OpT[OpT["dregb"] = 4] = "dregb";
    OpT[OpT["add"] = 5] = "add";
    OpT[OpT["sub"] = 6] = "sub";
    OpT[OpT["mul"] = 7] = "mul";
    OpT[OpT["div"] = 8] = "div";
    OpT[OpT["or"] = 9] = "or";
    OpT[OpT["and"] = 10] = "and";
    OpT[OpT["cmp"] = 11] = "cmp";
    OpT[OpT["jmp"] = 12] = "jmp";
    OpT[OpT["branch"] = 13] = "branch";
    OpT[OpT["call"] = 14] = "call";
    OpT[OpT["ret"] = 15] = "ret";
    OpT[OpT["load"] = 16] = "load";
    OpT[OpT["store"] = 17] = "store";
    OpT[OpT["storereg"] = 18] = "storereg";
    OpT[OpT["print"] = 19] = "print";
    OpT[OpT["halt"] = 20] = "halt";
})(OpT || (OpT = {}));
function gendrega1xn(n) {
    var res = [];
    for (var i = 0; i < n; i++) {
        res.push(OpT.drega);
    }
    return res;
}
function gendregb1xn(n) {
    var res = [];
    for (var i = 0; i < n; i++) {
        res.push(OpT.dregb);
    }
    return res;
}
function cdref3(reg, address) {
    return [OpT.dref, reg, address];
}
function move6(adr, value) {
    return [
        ...cload3(0, value.value),
        ...cstore3(0, adr.value)
    ];
}
function add12(aval, bval, dst) {
    return [
        ...cload3(0, aval.value),
        ...gendrega1xn(aval.drefCount),
        ...cload3(1, bval.value),
        ...gendregb1xn(bval.drefCount),
        ...cadd1(),
        ...cload3(0, dst.value),
        ...gendrega1xn(dst.drefCount),
        OpT.storereg,
    ];
}
function plusis12(adr, val) {
    var aval = adr.c();
    aval.drefCount++;
    return add12(aval, val, adr);
}
function incr12(adr) {
    return plusis12(adr, new Param(0, 1));
}
function cload3(reg, value) {
    return [OpT.load, reg, value];
}
function ccmp7(vala, valb) {
    return [
        ...cload3(0, vala.value),
        ...gendrega1xn(vala.drefCount),
        ...cload3(1, valb.value),
        ...gendregb1xn(valb.drefCount),
        ...ccmp1()
    ];
}
// JE/JZ	== =0
// JNE/JNZ	!= =!0
// JG/JNLE	>  !<=
// JGE/JNL	>= !<
// JL/JNGE	<  !>=
// JLE/JNG	<= !>
//00 >
//01 ==
//10 <
//11 <=
//01 >=
function cbranch6(to, negative, zero) {
    return [
        ...cload3(1, to.value),
        ...gendregb1xn(to.drefCount),
        OpT.branch,
        negative.value,
        zero.value,
    ];
}
function cjmp4(to) {
    return [
        ...cload3(1, to.value),
        ...gendregb1xn(to.drefCount),
        OpT.jmp,
    ];
}
function cload3param(reg, value) {
    return [OpT.load, reg.value, value.value];
}
function cadd1() {
    return [OpT.add];
}
function csub() {
    return [OpT.sub];
}
function cmul() {
    return [OpT.mul];
}
function cdiv() {
    return [OpT.div];
}
function cor() {
    return [OpT.or];
}
function cand() {
    return [OpT.and];
}
function ccmp1() {
    return [OpT.cmp];
}
function ccall(to) {
    return [OpT.call, to];
}
function cret() {
    return [OpT.ret];
}
function cnoop() {
    return [OpT.noop];
}
function cstore3(reg, adr) {
    return [OpT.store, reg, adr];
}
function cstorereg3(reg, adr) {
    return [OpT.store, reg, adr];
}
function cprint4(val) {
    return [
        ...cload3(1, val.value),
        ...gendregb1xn(val.drefCount),
        OpT.print
    ];
}
function cstore3param(reg, adr) {
    return [OpT.store, reg.value, adr.value];
}
function cdregb() {
    return [
        OpT.dregb
    ];
}
function chalt1() {
    return [OpT.halt];
}
class Op2 {
    constructor(cb, size) {
        this.cb = cb;
        this.size = size;
    }
}
var fakeparam = new Param(0, 0);
var opsmap = new Map();
opsmap.set('mul', new Op2(cmul, cmul().length)); //mul regb = rega * regb
opsmap.set('div', new Op2(cdiv, cdiv().length)); //div regb = rega / regb
opsmap.set('sub', new Op2(csub, csub().length)); //sub regb = rega - regb
opsmap.set('load', new Op2(cload3param, cload3param(fakeparam, fakeparam).length)); //reg,val load val into reg
opsmap.set('store', new Op2(cstore3param, cstore3param(fakeparam, fakeparam).length)); //reg,adr store register at adres
opsmap.set('and', new Op2(cand, cand().length)); //regb = rega & regb
opsmap.set('or', new Op2(cor, cor().length)); //regb = rega | regb
opsmap.set('dregb', new Op2(cdregb, cdregb().length)); //dreference value in register b
opsmap.set('set', new Op2(move6, move6(fakeparam, fakeparam).length)); //adr,value sets value at adres
opsmap.set('add', new Op2(add12, add12(fakeparam, fakeparam, fakeparam).length)); //adr,val adds val to adres
opsmap.set('plusis', new Op2(plusis12, plusis12(fakeparam, fakeparam).length)); //adr,val adds val to adres
opsmap.set('incr', new Op2(incr12, incr12(fakeparam).length)); //adr adds 1 to adres
opsmap.set('cmp', new Op2(ccmp7, ccmp7(fakeparam, fakeparam).length)); //vala,valb compares 2 values and sets flags
opsmap.set('branch', new Op2(cbranch6, cbranch6(fakeparam, fakeparam, fakeparam).length)); //to,negative,zero go to address if flags are set
opsmap.set('jmp', new Op2(cjmp4, cjmp4(fakeparam).length)); //to go to addres
opsmap.set('noop', new Op2(cnoop, cnoop().length)); //do nothing
opsmap.set('print', new Op2(cprint4, cprint4(fakeparam).length)); //print value
opsmap.set('halt', new Op2(chalt1, chalt1().length)); //stop program
class AssemblyRet {
    constructor() {
        this.binary = [];
        this.sourcemap = new Map();
        this.sourcemapString = new Map();
        this.datamap = new Set();
    }
}
function assemble(text) {
    var result = new AssemblyRet();
    var rows = text.split(/\r?\n/);
    var labels = new Map();
    var inCommentMode = false;
    var parsedrows = rows.map(r => r.trim()).filter(v => v != '' && v[0] != '#').map(s => parserow(s));
    result.parsedRows = parsedrows;
    // maps from binarylinenumber to assembly linenumber
    var memcounter = 0;
    for (var i = 0; i < parsedrows.length; i++) {
        var row = parsedrows[i];
        if (row.haslabel) {
            labels.set(row.label, memcounter);
        }
        result.sourcemap.set(memcounter, i);
        result.sourcemapString.set(memcounter, row.row);
        if (row.isOp) {
            memcounter += row.op.size;
        }
        else {
            var splitted = row.data.split(',');
            var datasize = splitted[0] == '' ? 0 : splitted.length;
            for (var j = 0; j < datasize; j++) {
                result.datamap.add(memcounter + j);
            }
            memcounter += datasize;
        }
        var drefs = countdrefs(row.data);
        if (['plusis' /* incr*/].findIndex(v => v == row.opcode) != -1) {
            memcounter += drefs[0] * 2; // + 1 is already accounted for
            memcounter += drefs[1];
        }
        else {
            memcounter += drefs.reduce((p, c) => p + c, 0);
        }
        // debugger
    }
    for (var row of parsedrows) {
        var dataparams = parseParameters(row.data, labels);
        if (row.isOp) {
            var code = row.op.cb.call(null, ...dataparams); //parse data
            result.binary.push(...code);
        }
        else {
            result.binary.push(...dataparams.map(dp => dp.value));
        }
    }
    return result;
}
function parseParameters(parameters, labels) {
    var result = [];
    for (var param of parameters.split(',')) {
        var drefCount = 0;
        var paramtext = '';
        for (var i = 0; i < param.length; i++) {
            if (param[i] == '*') {
                drefCount++;
            }
            else {
                paramtext = param.substr(i);
                break;
            }
        }
        if (labels.has(paramtext)) {
            result.push(new Param(drefCount, labels.get(paramtext)));
        }
        else {
            result.push(new Param(drefCount, parseInt(paramtext)));
        }
    }
    return result;
}
function countdrefs(parameters) {
    var res = [];
    for (var param of parameters.split(',')) {
        res.push((param.match(/\*/g) || []).length);
    }
    return res;
}
class ParsedRow {
    constructor() {
        this.haslabel = false;
        this.label = '';
        this.isOp = false;
        this.opcode = '';
        this.data = '';
        this.op = null;
    }
}
function parserow(row) {
    var res = new ParsedRow();
    res.row = row;
    var splittedrow = row.split(' ');
    var i = 0;
    if (splittedrow[i][0] == '@') {
        res.haslabel = true;
        res.label = splittedrow[0].substring(1);
        i++;
    }
    if (/^[a-z]+;$/.test(splittedrow[i])) {
        res.isOp = true;
        res.opcode = splittedrow[i].substr(0, splittedrow[i].length - 1);
        i++;
    }
    if (i == splittedrow.length - 1) {
        res.data = splittedrow[i];
    }
    res.op = opsmap.get(res.opcode);
    return res;
}
var asseblycodetabledata = [
    ['opcode', 'parameters', 'explantion'],
    ['mul', '', 'regb = rega * regb'],
    ['div', '', 'regb = rega / regb'],
    ['sub', '', 'regb = rega - regb'],
    ['load', 'reg,val', 'load val into reg'],
    ['store', 'reg,adr', 'store register at adres'],
    ['and', '', 'regb = rega & regb'],
    ['or', '', 'regb = rega | regb'],
    ['dregb', '', 'dreference value in register b'],
    ['set', 'adr,value', 'sets value at adres'],
    ['add', 'adr,value', 'adds val to adres'],
    ['incr', 'adr', 'adds 1 to adres'],
    ['cmp', 'vala,valb', ' compares 2 values and sets flags'],
    ['branch', 'to,negativeflag,zeroflag', 'go to address if flags are set'],
    ['jmp', 'to', 'go to address'],
    ['noop', '', 'do nothing'],
    ['print', 'value', 'print value'],
    ['halt', '', 'stop program'],
];
var machinecodetabledata = [
    ['machine code', 'instruction name', 'size', 'parameters', 'explanation'],
    ['0', 'noop', '1', '', 'do nothing'],
    ['1', 'dref', '3', 'reg,adr', ''],
    ['2', 'dreg', '2', 'reg', 'dereferences value in specified register'],
    ['3', 'drega', '1', '', 'dereferences value in register a'],
    ['4', 'dregb', '1', '', 'dereferences value in register b'],
    ['5', 'add', '1', '', '+'],
    ['6', 'sub', '1', '', '-'],
    ['7', 'mul', '1', '', '*'],
    ['8', 'div', '1', '', '/'],
    ['9', 'or', '1', '', '|'],
    ['10', 'and', '1', '', '&'],
    ['11', 'cmp', '1', '', 'rega - regb and sets flags'],
    ['12', 'jmp', '1', '', 'jumps to address in register b'],
    ['13', 'branch', '3', 'negflag,zeroflag', 'jumps to address in register b if flags match the given parameters'],
    ['14', 'call', '1', '', ''],
    ['15', 'ret', '1', '', ''],
    ['16', 'load', '3', 'register,val', 'loads value in specified register'],
    ['17', 'store', '3', 'register,adr', 'stores specified register at address'],
    ['18', 'print', '1', '', 'prints value in register b'],
    ['19', 'halt', '1', '', 'jumps to end of memory'],
];
class Table {
    constructor(columns) {
        this.headerRows = [];
        this.columns = columns;
        this.element = string2html(`
            <table>
                <thead>
                </thead>
                <tbody></tbody>
            </table>`);
        this.head = this.element.querySelector('thead');
        this.body = this.element.querySelector('tbody');
        this.addHeader();
    }
    addHeader() {
        for (var header of this.columns[0].headerRenderers) {
            var row = document.createElement('tr');
            this.headerRows.push(row);
            this.head.appendChild(row);
        }
        for (var column of this.columns) {
            for (let i = 0; i < column.headerRenderers.length; i++) {
                var headerRenderer = column.headerRenderers[i];
                var cell = this.createTableHeadCell(this.headerRows[i]);
                cell.appendChild(headerRenderer());
            }
        }
    }
    load(objects) {
        this.body.innerHTML = '';
        for (let i = 0; i < objects.length; i++) {
            var object = objects[i];
            var row = document.createElement('tr');
            this.body.appendChild(row);
            for (var column of this.columns) {
                var cell = document.createElement('td');
                row.appendChild(cell);
                cell.appendChild(column.renderer(object, i));
            }
        }
    }
    createTableHeadCell(row) {
        var td = document.createElement('th');
        row.appendChild(td);
        return td;
    }
}
class Column {
    constructor(headerRenderers, renderer) {
        this.headerRenderers = headerRenderers;
        this.renderer = renderer;
    }
}
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="cpuemulator.ts" />
/// <reference path="assembler.ts" />
/// <reference path="explanation.ts" />
/// <reference path="projectutils.ts" />
//debug fib
//debug fib assembly (gaat iets fout met pointers in add)
//disableable button
var cpu = new CPUEmulator();
var assemblyArea = query('#assembly');
var linenumberArea = query('#linenumber');
var opnameArea = query('#opname');
var srcassemblyArea = query('#srcassembly');
var instructionpointerArea = query('#instructionpointer');
var binaryArea = query('#binary');
var compile = query('#compile');
var run = query('#run');
var step = query('#step');
var negativeflag = query('#negativeflag');
var zeroflag = query('#zeroflag');
var carryflag = query('#carryflag');
var registera = query('#registera');
var registerb = query('#registerb');
var instructioncounter = query('#instructioncounter');
var currentinstruction = query('#currentinstruction');
var assemblytablecontainer = query('#assemblytablecontainer');
var machinecodetablecontainer = query('#machinecodetablecontainer');
var icsetbutton = query('#icsetbutton');
var memsetbutton = query('#setmembtn');
var flagsetbutton = query('#flagsetbutton');
var registersetbutton = query('#registersetbutton');
var assemblyret = null;
disableAbleButton(icsetbutton, [instructioncounter]);
disableAbleButton(flagsetbutton, [negativeflag, zeroflag, carryflag]);
disableAbleButton(registersetbutton, [registera, registerb]);
disableAbleButton(memsetbutton, [binaryArea]);
syncscrollbars(binaryArea, [linenumberArea, opnameArea, instructionpointerArea, srcassemblyArea,]);
document.addEventListener('keydown', e => {
    if (e.code == 'F10') {
        e.preventDefault();
        cpu.step();
        updateinput();
    }
});
compile.addEventListener('click', () => {
    execcompile();
    updateinput();
});
run.addEventListener('click', () => {
    cpu.exec();
    updateinput();
});
step.addEventListener('click', () => {
    cpu.step();
    updateinput();
});
memsetbutton.addEventListener('click', () => {
    cpu.memory = binaryArea.value.split('\n').map(v => parseInt(v));
    updatememarea();
});
icsetbutton.addEventListener('click', () => {
    if (Number.isInteger(instructioncounter.valueAsNumber)) {
        cpu.ic = instructioncounter.valueAsNumber;
    }
    else {
        cpu.ic = 0;
    }
    updateinput();
});
flagsetbutton.addEventListener('click', () => {
    cpu.flags[flag.carry] = carryflag.checked;
    cpu.flags[flag.negative] = negativeflag.checked;
    cpu.flags[flag.zero] = zeroflag.checked;
    updateinput();
});
registersetbutton.addEventListener('click', () => {
    cpu.registers[0] = registera.valueAsNumber;
    cpu.registers[1] = registerb.valueAsNumber;
    updateinput();
});
function execcompile() {
    assemblyret = assemble(assemblyArea.value);
    cpu.memory = assemblyret.binary;
    cpu.reset();
}
function updateinput() {
    var bin = cpu.memory;
    linenumberArea.value = bin.map((v, i) => i.toString()).join('\n');
    var textip = bin.map(() => '');
    textip[cpu.ic] = '=>';
    instructionpointerArea.value = textip.join('\n');
    updatememarea();
    var textsrcassembly = bin.map(() => '');
    assemblyret.sourcemap.forEach((v, k) => {
        textsrcassembly[k] = assemblyret.parsedRows[v].row;
    });
    srcassemblyArea.value = textsrcassembly.join('\n');
    var textop = bin.map((v, i) => '');
    for (var i = 0; i < bin.length;) {
        if (assemblyret.datamap.has(i)) {
            i++;
            continue;
        }
        var op = cpu.ops[bin[i]];
        textop[i] = op.name;
        i += op.size;
    }
    opnameArea.value = textop.join('\n');
    negativeflag.checked = cpu.flags[flag.negative];
    zeroflag.checked = cpu.flags[flag.zero];
    carryflag.checked = cpu.flags[flag.carry];
    registera.value = cpu.registers[0].toString();
    registerb.value = cpu.registers[1].toString();
    instructioncounter.value = cpu.ic.toString();
    if (cpu.ic >= cpu.memory.length) {
        currentinstruction.value = 'noop';
    }
    else {
        currentinstruction.value = cpu.ops[cpu.memory[cpu.ic]].name;
    }
}
function updatememarea() {
    var bin = cpu.memory;
    var textbin = bin.map((v, i) => v.toString());
    binaryArea.value = textbin.join('\n');
}
fetch('./test.as')
    .then(res => res.text())
    .then(text => {
    //     assemblyArea.value = `plusis; *i,**1
    // @i 0`
    assemblyArea.value = text;
    execcompile();
    updateinput();
});
fib();
function fib() {
    var fibs = [1, 1];
    for (var i = 2; i < 10; i++) {
        fibs.push(fibs[i - 1] + fibs[i - 2]);
    }
    return fibs;
}
var assemblytable = new Table([
    new Column([], (arr, i) => {
        var el = document.createElement('span');
        el.innerText = arr[0];
        return el;
    }), new Column([], (arr, i) => {
        var el = document.createElement('span');
        el.innerText = arr[1];
        return el;
    }), new Column([], (arr, i) => {
        var el = document.createElement('span');
        el.innerText = arr[2];
        return el;
    })
]);
assemblytablecontainer.appendChild(assemblytable.element);
assemblytable.load(asseblycodetabledata);
var machinecodetable = new Table([
    new Column([], (arr, i) => {
        var el = document.createElement('span');
        el.innerText = arr[0];
        return el;
    }), new Column([], (arr, i) => {
        var el = document.createElement('span');
        el.innerText = arr[1];
        return el;
    }), new Column([], (arr, i) => {
        var el = document.createElement('span');
        el.innerText = arr[2];
        return el;
    }), new Column([], (arr, i) => {
        var el = document.createElement('span');
        el.innerText = arr[3];
        return el;
    }), new Column([], (arr, i) => {
        var el = document.createElement('span');
        el.innerText = arr[4];
        return el;
    })
]);
machinecodetablecontainer.appendChild(machinecodetable.element);
machinecodetable.load(machinecodetabledata);
function query(string) {
    return document.querySelector(string);
}
function syncscrollbars(src, dst) {
    src.addEventListener('scroll', e => {
        for (var d of dst) {
            d.scrollTop = src.scrollTop;
        }
    });
}
function disableAbleButton(button, inputs) {
    button.addEventListener('click', () => {
        button.disabled = true;
    });
    inputs.forEach(v => {
        v.addEventListener('input', () => {
            button.disabled = false;
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy92ZWN0b3J4L3ZlY3Rvci50cyIsIm5vZGVfbW9kdWxlcy91dGlsc3gvdXRpbHMudHMiLCJjcHVlbXVsYXRvci50cyIsImFzc2VtYmxlci50cyIsImV4cGxhbmF0aW9uLnRzIiwicHJvamVjdHV0aWxzLnRzIiwibWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUdJLFlBQVksR0FBRyxJQUFhO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsUUFBd0M7UUFDeEMsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQyxDQUFDO1lBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3pCLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxLQUFLLENBQUMsQ0FBUTtRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFRCxNQUFNO1FBQ0YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFRCxTQUFTO1FBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0lBQ3hDLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBUTtRQUNQLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRCxJQUFJLENBQUMsQ0FBUSxFQUFDLE1BQWE7UUFDdkIsTUFBTSxDQUFD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QUEscUJBQXFCO1FBQzNCLFVBQUssR0FBRyxFQUFFLENBQUE7UUFDVixVQUFLLEdBQUcsQ0FBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzNCLFdBQU0sR0FBb0IsRUFBRSxDQUFBO1FBQzVCLFFBQUcsR0FBUSxFQUFFLENBQUE7UUFHVCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUNwRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDcEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFFRCxJQUFJO1FBQ0EsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDVixHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ2YsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJO1FBQ0EsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUM7WUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDOUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN0QixFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNoQixJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUE7UUFDdEIsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJO0lBRUosQ0FBQztJQUVELElBQUk7UUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDcEYsQ0FBQztJQUVELElBQUk7UUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdkYsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3RELENBQUM7SUFFRCxLQUFLO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN0RCxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ3ZFLENBQUM7SUFHRCxLQUFLO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3BGLENBQUM7SUFHRCxHQUFHO1FBQ0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDN0QsQ0FBQztJQUdELEdBQUc7UUFDQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM3RCxDQUFDO0lBR0QsR0FBRztRQUNDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzdELENBQUM7SUFHRCxHQUFHO1FBQ0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3pFLENBQUM7SUFHRCxFQUFFO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDN0QsQ0FBQztJQUdELEdBQUc7UUFDQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM3RCxDQUFDO0lBRUQsR0FBRztRQUNDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFBO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7SUFDdkMsQ0FBQztJQUdELE1BQU07UUFDRixFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBYSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQ2pJLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDM0QsQ0FBQztJQUNMLENBQUM7SUFFRCxHQUFHO1FBQ0MsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQTtJQUN4RCxDQUFDO0lBRUQsRUFBRTtRQUNFLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQ3BELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNkLENBQUM7SUFDTCxDQUFDO0lBRUQsRUFBRTtRQUNFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUNiLENBQUM7SUFFRCxHQUFHO1FBQ0MsRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUNyRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDZCxDQUFDO0lBQ0wsQ0FBQztJQUVELEdBQUc7UUFDQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7SUFDZCxDQUFDO0lBRUQsRUFBRTtRQUNFLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFDckQsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ2QsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUlELElBQUk7UUFDQSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDYixDQUFDO0lBRUQsR0FBRztRQUNDLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQ3BELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNkLENBQUM7SUFDTCxDQUFDO0lBRUQsR0FBRztRQUNDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUNkLENBQUM7SUFFRCxFQUFFO1FBQ0UsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJ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