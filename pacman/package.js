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
class Table {
    constructor(columns) {
        this.headerRows = [];
        this.columns = columns;
        this.element = string2html(`
            <table class="table table-bordered table-striped">
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
class BoxEvent {
    constructor(val, old) {
        this.val = val;
        this.old = old;
    }
}
class Box {
    constructor(value) {
        this.onchange = new EventSystem();
        this.value = value;
    }
    get() {
        return this.value;
    }
    set(value) {
        this.continueSet(value, new PEvent(new BoxEvent(value, this.value)));
    }
    continueSet(value, e) {
        this.oldValue = this.value;
        this.value = value;
        e.val.old = this.oldValue;
        e.val.val = this.value;
        if (this.oldValue != value) {
            this.continueTrigger(e);
        }
    }
    continueTrigger(e) {
        this.onchange.continueTrigger(e);
    }
    trigger() {
        this.continueTrigger(new PEvent(new BoxEvent(this.value, this.oldValue)));
    }
}
class PEvent {
    constructor(val) {
        this.val = val;
        this.cbset = new Set();
    }
    static create(val) {
        var e = new PEvent(val);
        return e;
    }
}
class EventSystem {
    constructor() {
        this.cbs = [];
    }
    listen(cb) {
        this.cbs.push(cb);
        return cb;
    }
    trigger(val) {
        this.continueTrigger(new PEvent(val));
    }
    continueTrigger(e) {
        for (var cb of this.cbs) {
            if (e.cbset.has(cb))
                continue;
            e.cbset.add(cb);
            cb(e);
        }
    }
}
class Pacman {
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
        this.speed = 7;
        this.prefferedDir = new Vector(1, 0);
    }
    draw() {
        if (vectorequal(this.dir, right)) {
            pacmananimation.sprite.rotations = 0;
        }
        else if (vectorequal(this.dir, down)) {
            pacmananimation.sprite.rotations = 0.25;
        }
        else if (vectorequal(this.dir, left)) {
            pacmananimation.sprite.rotations = 0.5;
        }
        else if (vectorequal(this.dir, up)) {
            pacmananimation.sprite.rotations = 0.75;
        }
        pacmananimation.draw(ctxt, floor(this.pos.c().mul(tilesize).sub(tilesize.c().scale(0.5))), tilesize);
    }
}
var GhostState;
(function (GhostState) {
    GhostState[GhostState["normal"] = 0] = "normal";
    GhostState[GhostState["eaten"] = 1] = "eaten";
    GhostState[GhostState["fleeing"] = 2] = "fleeing";
})(GhostState || (GhostState = {}));
class Ghost {
    constructor(pos, color, sprite, scattertile, target) {
        this.pos = pos;
        this.color = color;
        this.sprite = sprite;
        this.scattertile = scattertile;
        this.target = target;
        this.state = GhostState.normal;
        this.dir = new Vector(1, 0);
        this.originalColor = [...color];
    }
    getspeed() {
        if (this.state == GhostState.eaten) {
            return 12;
        }
        else if (this.state == GhostState.fleeing) {
            return 3;
        }
        else if (this.state == GhostState.normal) {
            return 6;
        }
    }
    getTarget() {
        if (this.state == GhostState.eaten) {
            return ghostretreatpoint.c();
        }
        else if (this.state == GhostState.fleeing) {
            return [new Vector(0, 0), new Vector(levelsize.x, levelsize.y), new Vector(levelsize.x, 0), new Vector(0, levelsize.y)][Math.floor(random(0, 4))];
        }
        else {
            if (scattermode) {
                return this.scattertile;
            }
            else {
                return this.target();
            }
        }
    }
    draw() {
        if (this.state == GhostState.fleeing) {
            arrayoverwrite([0, 0, 255], this.color);
        }
        else if (this.state == GhostState.normal) {
            arrayoverwrite(this.originalColor, this.color);
        }
        else if (this.state == GhostState.eaten) {
            arrayoverwrite([0, 0, 0], this.color);
        }
        this.sprite.draw(gfx, floor(this.pos.c().mul(tilesize).sub(tilesize.c().scale(0.5))));
    }
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
function convertImageData2board(image) {
    return createNDimArray([image.height, image.width], pos => {
        var i = index(pos.y, pos.x, image.width);
        var color = image.data.slice(i, i + 3);
        return colorsrgb.findIndex(crgb => arrayequal(crgb, color));
    });
}
function index(x, y, width) {
    return y * (width * 4) + x * 4;
}
function arrayequal(a, b) {
    return arrayequalL(a, b, a.length);
}
function arrayequalL(a, b, length) {
    for (var i = 0; i < length; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}
function arrayoverwrite(src, dst) {
    for (var i = 0; i < src.length; i++) {
        dst[i] = src[i];
    }
}
function vectorequal(a, b) {
    return arrayequal(a.vals, b.vals);
}
function fillrect(v) {
    ctxt.fillRect(v.x * tilesize.x, v.y * tilesize.y, tilesize.x, tilesize.y);
}
function fillrectCenteredGrid(v) {
    var halfsize = tilesize.c().scale(0.5);
    ctxt.fillRect(v.x * tilesize.x - halfsize.x, v.y * tilesize.y - halfsize.y, tilesize.x, tilesize.y);
}
function filrect(v, size) {
    ctxt.fillRect(v.x, v.y, size.x, size.y);
}
function round(v) {
    return v.map((arr, i) => arr[i] = Math.round(arr[i]));
}
function floor(v) {
    return v.map((arr, i) => arr[i] = Math.floor(arr[i]));
}
function getQuadrant(pos) {
    var floor = pos.c().map((arr, i) => arr[i] = Math.floor(arr[i]));
    var pc = pos.c().sub(floor).sub(new Vector(0.5, 0.5));
    if (Math.abs(pc.x) > Math.abs(pc.y)) {
        if (pc.x > 0) {
            return Direction.east;
        }
        else {
            return Direction.west;
        }
    }
    else {
        if (pc.y > 0) {
            return Direction.south;
        }
        else {
            return Direction.north;
        }
    }
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
function boxcontain(box, point) {
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
var up = new Vector(0, -1);
var right = new Vector(1, 0);
var down = new Vector(0, 1);
var left = new Vector(-1, 0);
// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function RGBtoHSV(r, g, b, out) {
    var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h, s = (max === 0 ? 0 : d / max), v = max / 255;
    switch (max) {
        case min:
            h = 0;
            break;
        case r:
            h = (g - b) + d * (g < b ? 6 : 0);
            h /= 6 * d;
            break;
        case g:
            h = (b - r) + d * 2;
            h /= 6 * d;
            break;
        case b:
            h = (r - g) + d * 4;
            h /= 6 * d;
            break;
    }
    out[0] = h;
    out[1] = s;
    out[2] = v;
}
function HSVtoRGB(h, s, v, out) {
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    out[0] = Math.round(r * 255);
    out[1] = Math.round(g * 255);
    out[2] = Math.round(b * 255);
}
// https://www.youtube.com/watch?v=Ky0sV9pua-E
class RuleTileRule {
    constructor(sprite, grid) {
        this.sprite = sprite;
        this.grid = grid;
    }
}
class RuleTile {
    constructor(wallnumber, ignorenumber, emptynumber, voidnumber, unfilledtilenumber) {
        this.wallnumber = wallnumber;
        this.ignorenumber = ignorenumber;
        this.emptynumber = emptynumber;
        this.voidnumber = voidnumber;
        this.unfilledtilenumber = unfilledtilenumber;
        this.rules = [];
    }
    genSpriteGrid() {
        var result = create2DArray(get2DArraySize(this.tilegrid), pos => {
            if (index2D(this.tilegrid, pos) != this.wallnumber) {
                return null;
            }
            else {
                var rule = this.rules.find(r => this.positionPassesRule(pos, r));
                if (rule == null)
                    return null;
                else
                    return rule.sprite;
            }
        });
        return result;
    }
    positionPassesRule(pos, ruleTileRule) {
        var result = true;
        new Vector(3, 3).loop2d(v => {
            var relpos = v.c().add(new Vector(-1, -1));
            var abspos = pos.c().add(relpos);
            var requirement = index2D(ruleTileRule.grid, v);
            //-1 other
            //-2 empty
            //1 wall
            //2 highground
            var tiletype = this.voidnumber;
            if (boxcontain(get2DArraySize(this.tilegrid).sub(one), abspos)) {
                tiletype = index2D(this.tilegrid, abspos);
            }
            if (requirement == -1) {
                return; //continue
            }
            else if (requirement == -2) {
                if (tiletype == this.unfilledtilenumber) {
                    return;
                }
                else {
                    //goto end and break
                }
            }
            else if (requirement == -1) {
                return; //continue
            }
            else {
                if (tiletype == requirement) {
                    return; //continue
                }
                else {
                    //goto end and break
                }
            }
            result = false;
            v.y = 3;
            v.x = 3;
            return;
        });
        return result;
    }
}
//blockcorner * 4
//wallcorner * 4
//edgewallcorner * 4
//wall * 4
//edgewall * 4
//inner * 1
function createRotatedSprites(image, grid, xflipped = false, yflipped = false) {
    var sprites = [];
    for (var i = 0; i < 4; i++) {
        var rotatedcopy = rotateMatrix(copy2dArray(grid), i);
        sprites.push(new RuleTileRule(new Sprite(ImageView.fromImage(image), i * 0.25, xflipped, yflipped), rotatedcopy));
    }
    return sprites;
}
function rotateMatrix(arr, nineties) {
    return create2DArray(get2DArraySize(arr), pos => {
        var rotatedpos = round(rotate2dCenter(pos.c(), nineties * -0.25, one));
        return index2D(arr, rotatedpos);
    });
}
class ImageView {
    constructor(image, spos, ssize) {
        this.image = image;
        this.spos = spos;
        this.ssize = ssize;
    }
    draw(dpos, dsize) {
        ctxt.drawImage(this.image, this.spos.x, this.spos.y, this.ssize.x, this.ssize.y, dpos.x, dpos.y, dsize.x, dsize.y);
    }
    static fromImage(image) {
        return new ImageView(image, zero.c(), new Vector(image.width, image.height));
    }
}
class Sprite {
    constructor(imageView, rotations = 0, xflipped = false, yflipped = false) {
        this.imageView = imageView;
        this.rotations = rotations;
        this.xflipped = xflipped;
        this.yflipped = yflipped;
    }
    static fromImage(image, rot = 0, xflipped = false, yflipped = false) {
        return new Sprite(ImageView.fromImage(image), rot, xflipped, yflipped);
    }
    c() {
        return new Sprite(this.imageView, this.rotations, this.xflipped, this.yflipped);
    }
    rot(rot) {
        this.rotations += rot;
        return this;
    }
    draw(ctxt, pos, size) {
        var center = pos.c().add(size.c().scale(0.5));
        ctxt.save();
        var xflip = this.xflipped ? -1 : 1;
        var yflip = this.yflipped ? -1 : 1;
        ctxt.translate(center.x, center.y);
        ctxt.rotate(this.rotations * TAU);
        ctxt.scale(xflip, yflip);
        ctxt.translate(-center.x, -center.y);
        this.imageView.draw(pos, size);
        ctxt.restore();
    }
}
function disectAtlas(rows, columns, imageSize, padding, offset) {
    var posses = [];
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var pos = new Vector(0, 0);
            pos.add(offset);
            pos.add(padding).mul(new Vector(j, i));
            pos.add(imageSize).mul(new Vector(j, i));
            posses.push(pos);
        }
    }
    return posses;
}
function disectSimpleImageRow(colums, size) {
    return disectAtlas(1, colums, size, zero, zero);
}
class AtlasAnimation {
    constructor(positions, sprite, size) {
        this.positions = positions;
        this.sprite = sprite;
        this.size = size;
        this.anim = new Anim();
        this.anim.stopwatch.start();
        this.anim.begin = 0;
        this.anim.end = 1;
        this.anim.duration = 1000;
        this.anim.animType = AnimType.repeat;
        this.sprite.imageView.ssize = this.size;
    }
    draw(ctxt, pos, size) {
        if (this.positions.length > 0) {
            var i = Math.min(Math.floor(this.anim.get() * this.positions.length), this.positions.length - 1);
            this.sprite.imageView.spos = this.positions[i];
            this.sprite.draw(ctxt, pos, size);
        }
    }
}
class TextureSampler {
    constructor(image) {
        this.imagedata = convertImages2Imagedata([image])[0];
    }
    sample(p, out) {
        var i = this.index(p.x, p.y);
        out[0] = this.imagedata.data[i + 0];
        out[1] = this.imagedata.data[i + 1];
        out[2] = this.imagedata.data[i + 2];
        out[3] = this.imagedata.data[i + 3];
    }
    index(x, y) {
        return (this.imagedata.width * y + x) * 4;
    }
}
function alphablend(a, dst) {
    var x = a[3] / 255;
    dst[0] = lerp(dst[0], a[0], x);
    dst[1] = lerp(dst[1], a[1], x);
    dst[2] = lerp(dst[2], a[2], x);
}
function colorReplace(input, fromcolor, tocolor, output) {
    if (arrayequalL(input, fromcolor, 3)) {
        arrayoverwrite(tocolor, output);
    }
}
class AdvancedSprite {
    constructor(image, shader) {
        this.image = image;
        this.shader = shader;
    }
    draw(gfx, pos) {
        var pixelbuffer = [0, 0, 0, 0];
        var abs = zero.c();
        new Vector(this.image.width, this.image.height).loop2d(rel => {
            abs.overwrite(rel).add(pos);
            this.shader(rel, abs, pixelbuffer);
            gfx.putPixel(abs.x, abs.y, pixelbuffer);
        });
    }
}
class Graphics {
    constructor(ctxt) {
        this.ctxt = ctxt;
        this.ctxt = ctxt;
    }
    load() {
        this.imageData = this.ctxt.getImageData(0, 0, this.ctxt.canvas.width, this.ctxt.canvas.height);
    }
    flush() {
        this.ctxt.putImageData(this.imageData, 0, 0);
    }
    putPixel(x, y, vals) {
        var i = this.index(x, y);
        var data = this.imageData.data;
        data[i] = vals[0];
        data[i + 1] = vals[1];
        data[i + 2] = vals[2];
        data[i + 3] = vals[3];
    }
    getPixel(x, y, dst) {
        var i = this.index(x, y);
        var data = this.imageData.data;
        dst[0] = data[i];
        dst[1] = data[i + 1];
        dst[2] = data[i + 2];
        dst[3] = data[i + 3];
    }
    getWidth() {
        return this.ctxt.canvas.width;
    }
    getHeight() {
        return this.ctxt.canvas.height;
    }
    index(x, y) {
        return (this.getWidth() * y + x) * 4;
    }
}
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />
/// <reference path="pacman.ts" />
/// <reference path="ghost.ts" />
/// <reference path="projectutils.ts" />
/// <reference path="ruleTile.ts" />
/// <reference path="ruleTile.ts" />
/// <reference path="atlas.ts" />
/// <reference path="graphics.ts" />
//sound
//sprites
//animations
//wall adaptive sprites
//score
//scatter
//fleeing
//eating ghosts
//ghosts spawning and returning to ghost house
var levelsize = new Vector(28, 36);
var tilesize = new Vector(16, 16);
var screensize = levelsize.c().mul(tilesize);
var crret = createCanvas(screensize.x, screensize.y);
var canvas = crret.canvas;
var ctxt = crret.ctxt;
ctxt.imageSmoothingEnabled = false;
var colors = ['black', 'white', 'blue', 'red', 'yellow', 'pink'];
var colorsrgb = [[0, 0, 0], [255, 255, 255], [0, 38, 255], [255, 0, 0], [255, 216, 0], [255, 61, 229]];
var Tiletype;
(function (Tiletype) {
    Tiletype[Tiletype["wall"] = 0] = "wall";
    Tiletype[Tiletype["blank"] = 1] = "blank";
    Tiletype[Tiletype["powerup"] = 2] = "powerup";
    Tiletype[Tiletype["fruit"] = 3] = "fruit";
    Tiletype[Tiletype["dot"] = 4] = "dot";
    Tiletype[Tiletype["highround"] = 5] = "highround";
})(Tiletype || (Tiletype = {}));
var score = 0;
var highscore = 0;
var dotseaten = 0;
var amountofdots = 0;
var scattermode = false;
var blinky;
var pinky;
var inky;
var clyde;
var ghosts;
var ghostretreatpoint = new Vector(13, 14);
var pacman;
var board;
var onPacmanDead = new EventSystem();
var ghostsound = new Howl({
    src: ['./res/ghostsound.mp3'],
    loop: true,
    volume: 0.25,
});
var ghostfleeing = new Howl({
    src: ['./res/ghostfleeing.mp3'],
    loop: true,
    volume: 0.25,
    mute: true,
});
var pacmaneat = new Howl({
    src: ['./res/pacmaneat.mp3'],
    loop: true,
    mute: true,
});
pacmaneat.play();
ghostsound.play();
ghostfleeing.play();
var timeouthandle = -1;
var ruleTile = new RuleTile(1, -1, -2, 2, 0);
var spritegrid;
var gfx = new Graphics(ctxt);
document.addEventListener('keydown', e => {
    pacman.prefferedDir.x = 0;
    pacman.prefferedDir.y = 0;
    if (e.key == 'w') {
        pacman.prefferedDir.y = -1;
    }
    else if (e.key == 's') {
        pacman.prefferedDir.y = 1;
    }
    else if (e.key == 'a') {
        pacman.prefferedDir.x = -1;
    }
    else if (e.key == 'd') {
        pacman.prefferedDir.x = 1;
    }
});
// var temp = [0,0,0,0]
// var asprite = new AdvancedSprite(images[13], (rel,abs,out) => {
//     sampler.sample(rel,out)
//     colorReplace(out,[255,255,255],[0,255,0],out)
//     // HSVtoRGB(mod(1 * (abs.x + abs.y) * 0.01,1),1,1,out)
//     // alphablend(temp,out)
// })
var images;
function reset() {
    board = convertImageData2board(convertImages2Imagedata(images.slice(0, 1))[0]);
    pacman = new Pacman(new Vector(13.5, 26.5), new Vector(1, 0));
    var sampler = new TextureSampler(images[14]);
    blinky = new Ghost(new Vector(12.5, 14.5), [255, 0, 0], new AdvancedSprite(images[14], (rel, abs, out) => {
        sampler.sample(rel, out);
        colorReplace(out, [255, 0, 0], blinky.color, out);
    }), new Vector(levelsize.x - 3, 0), () => { return pacman.pos.c(); });
    pinky = new Ghost(new Vector(13.5, 14.5), [255, 156, 206], new AdvancedSprite(images[14], (rel, abs, out) => {
        sampler.sample(rel, out);
        colorReplace(out, [255, 0, 0], pinky.color, out);
    }), new Vector(2, 0), () => { return pacman.pos.c().add(pacman.dir.c().scale(4)); });
    inky = new Ghost(new Vector(14.5, 14.5), [49, 255, 255], new AdvancedSprite(images[14], (rel, abs, out) => {
        sampler.sample(rel, out);
        colorReplace(out, [255, 0, 0], inky.color, out);
    }), new Vector(levelsize.x - 1, levelsize.y), () => {
        var ahead = pacman.pos.c().add(pacman.dir.c().scale(2));
        return blinky.pos.c().add(blinky.pos.to(ahead).scale(2));
    });
    clyde = new Ghost(new Vector(15.5, 14.5), [255, 206, 49], new AdvancedSprite(images[14], (rel, abs, out) => {
        sampler.sample(rel, out);
        colorReplace(out, [255, 0, 0], clyde.color, out);
    }), new Vector(0, levelsize.y), () => { return clyde.pos.to(pacman.pos).length() > 8 ? pacman.pos.c() : clyde.scattertile; });
    ghosts = [blinky, pinky, inky, clyde];
    score = 0;
}
var pacmananimation;
loadImages([
    './res/level1.png',
    './res/boxcorner.png',
    './res/closedwall.png',
    './res/corner.png',
    './res/filled.png',
    './res/junction.png',
    './res/openwall.png',
    './res/boxjunction.png',
    './res/innerboxcorner.png',
    './res/ghostwallcorner.png',
    './res/ghostwallend.png',
    './res/ghostdoor.png',
    './res/pacman.png',
    './res/test.png',
    './res/ghost.png'
]).then(pimages => {
    images = pimages;
    pacmananimation = new AtlasAnimation(disectSimpleImageRow(4, new Vector(26, 26)), Sprite.fromImage(images[12]), new Vector(26, 26));
    pacmananimation.anim.animType = AnimType.repeat;
    pacmananimation.anim.duration = 200;
    reset();
    ruleTile.tilegrid = createNDimArray([board.length, board[0].length], v => {
        switch (board[v.x][v.y]) {
            case Tiletype.wall:
                return 1;
            case Tiletype.highround:
                return 2;
            default:
                return 0;
        }
    });
    ruleTile.rules = [];
    //-1 ignore
    //-2 empty
    //1 wallnumber
    //2 highground
    addrange(ruleTile.rules, createRotatedSprites(images[1], [
        [-2, -2, -2],
        [-2, -1, 1],
        [-2, 1, 1],
    ]));
    addrange(ruleTile.rules, createRotatedSprites(images[2], [
        [-1, 2, -1],
        [1, -1, 1],
        [-1, -2, -1],
    ]));
    addrange(ruleTile.rules, createRotatedSprites(images[3], [
        [2, 2, 2],
        [2, -1, 1],
        [2, 1, -2],
    ]));
    ruleTile.rules.push(new RuleTileRule(new Sprite(ImageView.fromImage(images[4]), -1, false, false), [
        [1, 1, 1],
        [1, -1, 1],
        [1, 1, 1],
    ]));
    addrange(ruleTile.rules, createRotatedSprites(images[5], [
        [2, 2, 2],
        [1, -1, 1],
        [-2, 1, 1],
    ]));
    addrange(ruleTile.rules, createRotatedSprites(images[5], [
        [2, 2, 2],
        [1, -1, 1],
        [1, 1, -2],
    ], true, false));
    addrange(ruleTile.rules, createRotatedSprites(images[6], [
        [1, 1, 1],
        [1, -1, 1],
        [-1, -2, -1],
    ]));
    addrange(ruleTile.rules, createRotatedSprites(images[8], [
        [1, 1, 1],
        [1, -1, 1],
        [1, 1, -2],
    ]));
    addrange(ruleTile.rules, createRotatedSprites(images[1], [
        [-2, -2, -2],
        [-2, -1, 1],
        [-2, 1, 2],
    ]));
    addrange(ruleTile.rules, createRotatedSprites(images[2], [
        [2, 2, 2],
        [1, -1, 2],
        [-2, -2, 2],
    ]));
    addrange(ruleTile.rules, createRotatedSprites(images[2], [
        [2, 2, 2],
        [2, -1, 1],
        [2, -2, -2],
    ]));
    spritegrid = ruleTile.genSpriteGrid();
    spriteBox(Sprite.fromImage(images[2], 0.5), Sprite.fromImage(images[9]), new Vector(10, 15), new Vector(7, 4));
    spritegrid[15][13] = Sprite.fromImage(images[11]);
    spritegrid[15][14] = Sprite.fromImage(images[11]);
    spritegrid[15][12] = Sprite.fromImage(images[10], 0, true);
    spritegrid[15][15] = Sprite.fromImage(images[10]);
    amountofdots = countDots();
    scattermodedelayon();
    function scattermodedelayon() {
        setTimeout(() => {
            scattermode = true;
            scattermodedelayoff();
        }, 12000);
    }
    function scattermodedelayoff() {
        setTimeout(() => {
            scattermode = false;
            scattermodedelayon();
        }, 5000);
    }
    var loopfunc = (dt) => {
        dt /= 1000;
        dt = clamp(dt, 0, 1 / 100);
        //begin pacman
        var posibillities = getMovePossibilities(floor(pacman.pos.c()));
        var olddir = pacman.dir.c();
        var dirlookup = pacman.prefferedDir.c().add(new Vector(1, 1));
        var olddir = pacman.dir.c();
        if (!isCornering(olddir, pacman.prefferedDir)) {
            if (posibillities[dirs[dirlookup.y][dirlookup.x]]) {
                pacman.dir.overwrite(pacman.prefferedDir);
            }
        }
        var travel = pacman.dir.c().scale(pacman.speed * dt);
        if (isGoingToCrossTileCenterOrOnCenter(pacman.pos, travel)) {
            if (posibillities[dirs[dirlookup.y][dirlookup.x]]) {
                pacman.dir.overwrite(pacman.prefferedDir);
            }
            modifyTravelForCorners(pacman.pos, travel, olddir, pacman.prefferedDir);
        }
        pacman.pos.add(travel); //move pacman
        pacman.pos.map((arr, i) => arr[i] = mod(arr[i], levelsize.vals[i])); //wrap around map
        keeponrail(pacman.pos, pacman.dir);
        for (var i = 0; i < 4; i++) {
            if (arrayequal(dirvecs[i].vals, pacman.dir.vals) && getQuadrant(pacman.pos) == i && posibillities[i] == false) {
                pacman.pos.vals[(i + 1) % 2] = Math.floor(pacman.pos.vals[(i + 1) % 2]) + 0.5;
            }
        }
        var pacmanroundpos = floor(pacman.pos.c());
        var currenttile = board[pacmanroundpos.y][pacmanroundpos.x];
        if (currenttile == Tiletype.dot) {
            board[pacmanroundpos.y][pacmanroundpos.x] = Tiletype.blank;
            score += 10;
            pacmaneat.mute(false);
            clearTimeout(timeouthandle);
            timeouthandle = setTimeout(() => {
                pacmaneat.mute(true);
            }, 200);
        }
        else if (currenttile == Tiletype.fruit) {
            board[pacmanroundpos.y][pacmanroundpos.x] = Tiletype.blank;
            score += 100;
        }
        else if (currenttile == Tiletype.powerup) {
            board[pacmanroundpos.y][pacmanroundpos.x] = Tiletype.blank;
            ghosts.forEach(g => {
                if (g.state == GhostState.normal) {
                    g.state = GhostState.fleeing;
                }
            });
            ghostfleeing.mute(false);
            ghostsound.mute(true);
            setTimeout(() => {
                ghostfleeing.mute(true);
                ghostsound.mute(false);
                ghosts.forEach(g => {
                    if (g.state == GhostState.fleeing) {
                        g.state = GhostState.normal;
                    }
                });
            }, 12000);
            score += 50;
        }
        //end pacman
        //begin ghosts
        for (var ghost of ghosts) {
            var travel = ghost.dir.c().scale(ghost.getspeed() * dt);
            if (isGoingToCrossTileCenterOrOnCenter(ghost.pos, travel)) {
                var posibillities = getMovePossibilities(floor(ghost.pos.c()));
                var reversedir = ghost.dir.c().scale(-1).add(new Vector(1, 1));
                posibillities[dirs[reversedir.y][reversedir.x]] = false;
                var target = ghost.getTarget();
                var bestindex = findbest(posibillities.map((v, i) => i).filter(i => posibillities[i]), i => {
                    return -ghost.pos.c().add(dirvecs[i]).to(target).length();
                });
                var olddir = ghost.dir.c();
                var newdir = dirvecs[bestindex];
                ghost.dir.overwrite(newdir);
                travel = ghost.dir.c().scale(ghost.getspeed() * dt);
                modifyTravelForCorners(ghost.pos, travel, olddir, newdir);
            }
            ghost.pos.add(travel); //move ghost
            ghost.pos.map((arr, i) => arr[i] = mod(arr[i], levelsize.vals[i])); //wrap around map
            keeponrail(ghost.pos, ghost.dir);
            if (vectorequal(round(ghost.pos.c()), pacmanroundpos)) {
                onPacmanDead.trigger(0);
            }
        }
        //end ghosts
        for (var ghost of ghosts) {
            if (vectorequal(floor(ghost.pos.c()), floor(pacman.pos.c()))) {
                if (ghost.state == GhostState.fleeing) {
                    ghost.state = GhostState.eaten;
                }
                else if (ghost.state == GhostState.normal) {
                    reset();
                }
            }
            if (ghost.state == GhostState.eaten && vectorequal(floor(ghost.pos.c()), ghostretreatpoint)) {
                ghost.state = GhostState.normal;
            }
        }
        ctxt.clearRect(0, 0, screensize.x, screensize.y);
        drawboard(board);
        pacman.draw();
        gfx.load();
        ghosts.forEach(g => g.draw());
        gfx.putPixel(0, 0, [255, 255, 255, 255]);
        gfx.flush();
    };
    loop(loopfunc);
});
var Direction;
(function (Direction) {
    Direction[Direction["north"] = 0] = "north";
    Direction[Direction["east"] = 1] = "east";
    Direction[Direction["south"] = 2] = "south";
    Direction[Direction["west"] = 3] = "west";
})(Direction || (Direction = {}));
var dirvecs = [new Vector(0, -1), new Vector(1, 0), new Vector(0, 1), new Vector(-1, 0),];
var dirs = [
    [-1, 0, -1],
    [3, -1, 1],
    [-1, 2, -1],
];
function getMovePossibilities(pos) {
    var result = new Array(4);
    for (var i = 0; i < dirvecs.length; i++) {
        var c = pos.c().add(dirvecs[i]);
        if (inRange(0, levelsize.x - 1, c.x) && inRange(0, levelsize.y - 1, c.y)) {
            result[i] = board[c.y][c.x] != Tiletype.wall;
        }
        else {
            result[i] = true;
        }
    }
    return result;
}
function drawboard(board) {
    levelsize.loop2d(v => {
        var sprite = index2D(spritegrid, v);
        var abspos = v.c().mul(tilesize);
        if (sprite) {
            sprite.draw(ctxt, abspos, tilesize);
        }
        else {
            var tiletype = index2D(board, v);
            ctxt.fillStyle = 'black';
            fillrect(v);
            if (tiletype == Tiletype.blank) {
                //nothing
            }
            else if (tiletype == Tiletype.dot) {
                ctxt.fillStyle = 'yellow';
                drawdot(v, new Vector(4, 4));
            }
            else if (tiletype == Tiletype.fruit) {
                ctxt.fillStyle = 'red';
                drawdot(v, new Vector(6, 6));
            }
            else if (tiletype == Tiletype.powerup) {
                ctxt.fillStyle = 'blue';
                drawdot(v, new Vector(6, 6));
            }
        }
    });
}
function drawdot(v, size) {
    filrect(v.c().mul(tilesize).add(tilesize.c().scale(0.5)).sub(size.c().scale(0.5)), size);
}
function vecToTileCenter(v) {
    return v.c().sub(floor(v.c())).sub(new Vector(0.5, 0.5)).scale(-1);
}
function countDots() {
    var count = 0;
    new Vector(board[0].length, board.length).loop2d(v => {
        if (board[v.y][v.x] == Tiletype.dot) {
            count++;
        }
    });
    return count;
}
function keeponrail(pos, dir) {
    if (dir.x != 0) {
        pos.y = Math.floor(pos.y) + 0.5;
    }
    else if (dir.y != 0) {
        pos.x = Math.floor(pos.x) + 0.5;
    }
}
function isGoingToCrossTileCenterOrOnCenter(pos, travel) {
    if (vecToTileCenter(pos).length() == 0) {
        return true;
    }
    var enoughlength = travel.length() >= vecToTileCenter(pos).length();
    var rightdirection = vecToTileCenter(pos).normalize().dot(travel.c().normalize()) > 0.9;
    return enoughlength && rightdirection;
}
function findbest(list, evaluator) {
    return list[findbestIndex(list, evaluator)];
}
function setMagnitude(v, length) {
    return v.normalize().scale(length);
}
function isCornering(olddir, newdir) {
    return Math.abs(olddir.dot(newdir)) < 0.1;
}
function modifyTravelForCorners(pos, travel, olddir, newdir) {
    if (isCornering(olddir, newdir)) {
        setMagnitude(travel, travel.length() - vecToTileCenter(pos).length());
    }
    return travel;
}
function spriteBox(straight, corner, topleft, size) {
    var bottomright = topleft.c().add(size);
    var topright = new Vector(bottomright.x, topleft.y);
    var bottomleft = new Vector(topleft.x, bottomright.y);
    spriteLine2(straight, topleft, topright);
    spriteLine2(straight.c().rot(0.25), topright, bottomright);
    spriteLine2(straight.c().rot(0.5), bottomright, bottomleft);
    spriteLine2(straight.c().rot(0.75), bottomleft, topleft);
    spritegrid[topleft.y][topleft.x] = corner;
    spritegrid[topright.y][topright.x] = corner.c().rot(0.25);
    spritegrid[bottomright.y][bottomright.x] = corner.c().rot(0.5);
    spritegrid[bottomleft.y][bottomleft.x] = corner.c().rot(0.75);
}
function spriteLine2(sprite, start, end) {
    spriteLine(sprite, start, start.to(end).normalize(), start.to(end).length());
}
function spriteLine(sprite, start, dir, length) {
    for (var i = 0; i <= length; i++) {
        var abs = start.c().add(dir.c().scale(i));
        spritegrid[abs.y][abs.x] = sprite;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy92ZWN0b3J4L3ZlY3Rvci50cyIsIm5vZGVfbW9kdWxlcy91dGlsc3gvdXRpbHMudHMiLCJub2RlX21vZHVsZXMvZXZlbnRzeXN0ZW14L0V2ZW50U3lzdGVtLnRzIiwicGFjbWFuLnRzIiwiZ2hvc3QudHMiLCJwcm9qZWN0dXRpbHMudHMiLCJydWxlVGlsZS50cyIsImF0bGFzLnRzIiwiZ3JhcGhpY3MudHMiLCJtYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBR0ksWUFBWSxHQUFHLElBQWE7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDcEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxRQUF3QztRQUN4QyxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDLENBQUM7WUFDdEMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDekIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyxDQUFRO1FBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVELFNBQVM7UUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDeEMsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFRO1FBQ1AsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7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TSxDQUFDLEtBQUssQ0FBQztZQUNkLENBQUM7WUFBQSxJQUFJLENBQUEsQ0FBQztnQkFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixDQUFDO1FBQ0YsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDVixDQUFDO0lBRUQsT0FBTyxDQUFDLENBQVE7UUFDYixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN2QixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVEsRUFBQyxHQUFVO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN2QixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdkIsQ0FBQztJQUVELElBQUksQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLENBQUMsQ0FBQyxHQUFHO1FBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7SUFDdEIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDLEdBQUc7UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtJQUN0QixDQUFDO0lBRUQsSUFBSSxDQUFDLENB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QUssQ0FBQztZQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxLQUFLLENBQUM7UUFDL0MsS0FBSyxDQUFDO1lBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLEtBQUssQ0FBQztJQUNuRCxDQUFDO0lBQ0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFBQSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFFRCxrQkFBa0IsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFRLEVBQUMsR0FBWTtJQUN2RCxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNkLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztR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LENBQUMsRUFBQyxDQUFDLEVBQUMsSUFBYTtRQUN0QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQTtRQUM5QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3pCLENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxHQUFZO1FBQ3JCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFBO1FBQzlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDeEIsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO0lBQ2pD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QUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFO1FBQy9GLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZCLFlBQVksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsR0FBRyxDQUFDLENBQUE7SUFDaEQsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQTtJQUMvRCxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2xHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZCLFlBQVksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsR0FBRyxDQUFDLENBQUE7SUFDL0MsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUE7SUFDOUUsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLEVBQUMsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRTtRQUM5RixPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQTtRQUN2QixZQUFZLENBQUMsR0FBRyxFQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzlDLENBQUMsQ0FBQyxFQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLEVBQUU7UUFDNUMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2RCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDNUQsQ0FBQyxDQUFDLENBQUE7SUFDRixLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxFQUFFLENBQUMsRUFBQyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFO1FBQy9GLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZCLFlBQVksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsR0FBRyxDQUFDLENBQUE7SUFDL0MsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFBO0lBQ3ZILE1BQU0sR0FBRyxDQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLEtBQUssR0FBRyxDQUFDLENBQUE7QUFDYixDQUFDO0FBQ0QsSUFBSSxlQUE4QixDQUFBO0FBQ2xDLFVBQVUsQ0FBQztJQUNYLGtCQUFrQjtJQUNsQixxQkFBcUI7SUFDckIsc0JBQXNCO0lBQ3RCLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQix1QkFBdUI7SUFDdkIsMEJBQTBCO0lBQzFCLDJCQUEyQjtJQUMzQix3QkFBd0I7SUFDeEIscUJBQXFCO0lBQ3JCLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsaUJBQWlCO0NBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDZCxNQUFNLEdBQUcsT0FBTyxDQUFBO0lBQ2hCLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUMvSCxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFBO0lBQy9DLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQTtJQUNuQyxLQUFLLEVBQUUsQ0FBQTtJQUNQLFFBQVEsQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkUsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssUUFBUSxDQUFDLElBQUk7Z0JBQ2QsTUFBTSxDQUFDLENBQUMsQ0FBQTtZQUNaLEtBQUssUUFBUSxDQUFDLFNBQVM7Z0JBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDWjtnQkFDSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQTtJQUNGLFFBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO0lBQ25CLFdBQVc7SUFDWCxVQUFVO0lBQ1YsY0FBYztJQUNkLGNBQWM7SUFFZCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2IsQ0FBQyxDQUFDLENBQUE7SUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVixDQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2IsQ0FBQyxDQUFDLENBQUE7SUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDbkQsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUNiLENBQUMsQ0FBQyxDQUFBO0lBQ0gsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLEVBQUM7UUFDM0YsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDYixDQUFDLENBQUMsQ0FBQTtJQUNILFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNuRCxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1YsQ0FBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2IsQ0FBQyxDQUFDLENBQUE7SUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDbkQsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUNiLEVBQUMsSUFBSSxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDZCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDbkQsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7S0FDYixDQUFDLENBQUMsQ0FBQTtJQUNILFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNuRCxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1YsQ0FBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1YsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2QsQ0FBQyxDQUFDLENBQUE7SUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2IsQ0FBQyxDQUFDLENBQUE7SUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDbkQsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2IsQ0FBQyxDQUFDLENBQUE7SUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDbkQsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLENBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2IsQ0FBQyxDQUFDLENBQUE7SUFFSCxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3JDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsRUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUks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QUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN2QyxJQUFJLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxJQUFJLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNwRCxXQUFXLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUN4QyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDMUQsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQzNELFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN4RCxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUE7SUFDekMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN6RCxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzlELFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDakUsQ0FBQztBQUVELHFCQUFxQixNQUFhLEVBQUMsS0FBWSxFQUFDLEdBQVU7SUFDdEQsVUFBVSxDQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDN0UsQ0FBQztBQUVELG9CQUFvQixNQUFhLEVBQUMsS0FBWSxFQUFDLEdBQVUsRUFBQyxNQUFhO0lBQ25FLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDLENBQUM7UUFDNUIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDekMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFBO0lBQ3JDLENBQUM7QUFDTCxDQUFDIn0=