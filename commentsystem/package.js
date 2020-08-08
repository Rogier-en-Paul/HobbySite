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
var closehoveronmouseleave = true;
var messageRegex = /@(?<targetid>[0-9]{1,6})/g;
class Message {
    constructor(id, text) {
        this.id = id;
        this.text = text;
        this.createdAt = new Date();
        this.upvotes = 0;
        this.downvotes = 0;
    }
    netUpvotes() {
        return this.upvotes - this.downvotes;
    }
}
class Mention {
    constructor(id, originalMessage, mentionedMessage) {
        this.id = id;
        this.originalMessage = originalMessage;
        this.mentionedMessage = mentionedMessage;
    }
}
function addMessage(text) {
    var result = messageRegex.exec(text);
    var newmessageid = messageidcounter++;
    var targetset = new Set();
    while (result != null) {
        var targetid = parseInt(result.groups.targetid);
        if (targetset.has(targetid) == false) {
            targetset.add(targetid);
            mentions.push(new Mention(mentionidcounter++, newmessageid, targetid));
        }
        result = messageRegex.exec(text);
    }
    messages.push(new Message(newmessageid, text));
    return newmessageid;
}
function renderMessage(id, previewLinks, onlinkClick) {
    var mentions = findMentions(id);
    var replies = findReplies(id);
    var message = findMessage(id);
    var sortedreplies = replies.map(a => findMessage(a.originalMessage)).sort((a, b) => (a.netUpvotes() - b.netUpvotes()) * -1);
    // var sortedreplies = replies.map(a => findMessage(a.originalMessage)).sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime())
    var replieselements = sortedreplies.map(rep => {
        var element = string2html(`<a style="margin-right:10px;" href="#${rep.id}">@${rep.id}</a>`);
        if (previewLinks) {
            addPreviewAndConversationLink(element, rep.id, onlinkClick);
        }
        return element;
    });
    var replaceresult = message.text.replace(messageRegex, (substring, p1) => {
        return `<a href="#${p1}" data-messageid="${p1}">${substring}</a>`;
    });
    var html = string2html(`
        <div style="border:1px solid black; margin:10px 0px; padding:10px; max-width:700px; max-height:200px; overflow:auto; background-color: white;">
            <a id="messageid" name="${message.id}" href="#${message.id}">${message.id}</a>
            <span id="upvotes" style="cursor:pointer;">up</span> <span id="upvotecounter">${message.upvotes - message.downvotes}</span> <span style="cursor:pointer;" id="downvotes">down</span> 
            <b>${moment(message.createdAt).fromNow()}</b>
            <span id="replies"></span>
            <pre id="textcontainer" style="font-family:Arial, Helvetica, sans-serif;">${replaceresult}</pre>
            <a href="#" id="replybtn">reply</a>
        </div>
    `);
    var upvotecounter = html.querySelector('#upvotecounter');
    html.querySelector('#upvotes').addEventListener('click', e => {
        message.upvotes++;
        renderMessages(false);
        // upvotecounter.innerHTML = `${message.upvotes - message.downvotes}`
    });
    html.querySelector('#downvotes').addEventListener('click', e => {
        message.downvotes++;
        renderMessages(false);
        // upvotecounter.innerHTML = `${message.upvotes - message.downvotes}`
    });
    html.querySelector('#replybtn').addEventListener('click', e => {
        e.preventDefault();
        textarea.value = `@${id} ` + textarea.value;
        textarea.focus();
    });
    var repliesContainer = html.querySelector('#replies');
    for (let element of replieselements) {
        repliesContainer.appendChild(element);
    }
    var mentionelements = Array.from(html.querySelectorAll('pre a'));
    for (let mention of mentionelements) {
        if (previewLinks) {
            addPreviewAndConversationLink(mention, parseInt(mention.dataset.messageid), onlinkClick);
        }
    }
    return html;
}
function addPreviewAndConversationLink(linkelement, targetmessageid, onlinkClick) {
    if (findMessage(targetmessageid) == null) {
        return;
    }
    else {
        linkelement.addEventListener('mouseenter', e => {
            setCursorFloater(linkelement, targetmessageid);
        });
        linkelement.addEventListener('mouseleave', e => {
            if (closehoveronmouseleave) {
                cursorfloater.style.display = 'none';
            }
        });
        linkelement.addEventListener('click', e => {
            e.preventDefault();
            onlinkClick(targetmessageid);
        });
    }
}
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="message.ts" />
//order replies by upvotes/relevance/createddate
//order messages by upvotes/relevance/createddate
function findMessage(messageid) {
    return messages.find(m => m.id == messageid);
}
function findReplies(messageid) {
    return mentions.filter(m => m.mentionedMessage == messageid);
}
function findMentions(messageid) {
    return mentions.filter(m => m.originalMessage == messageid);
}
var textarea = document.querySelector('#textmessage');
var sendbtn = document.querySelector('#sendbtn');
var messagecontainer = document.querySelector('#messagecontainer');
var cursorfloater = document.querySelector('#cursorfloater');
var conversationcontainer = document.querySelector('#conversationcontainer');
var messageidcounter = 1;
var messages = [];
var mentionidcounter = 0;
var mentions = [];
var conversationMessages = [];
moment.relativeTimeThreshold('s', 40);
moment.relativeTimeThreshold('ss', 3);
textarea.focus();
textarea.value = '@1 test comment';
sendMessage();
textarea.value = '@1 ';
sendbtn.addEventListener('click', e => {
    sendMessage();
});
function sendMessage() {
    addMessage(textarea.value);
    renderMessages(true);
    textarea.value = '';
}
function renderMessages(animate) {
    messagecontainer.innerHTML = '';
    // var sortedmessages = messages.slice().sort((a,b) => (a.netUpvotes() - b.netUpvotes()) * -1)
    var sortedmessages = messages.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    for (let i = 0; i < sortedmessages.length; i++) {
        const message = sortedmessages[i];
        var messagehtml = renderMessage(message.id, true, (linktarget) => {
            conversationMessages = [linktarget];
            renderConvo();
        });
        if (animate) {
            if (i == sortedmessages.length - 1) {
                messagehtml.classList.add('animate__animated', 'animate__fadeInDown');
            }
            else {
                // messagehtml.classList.add('animate__animated','animate__slideInDown')
            }
        }
        messagecontainer.prepend(messagehtml);
    }
}
function renderConvo() {
    conversationcontainer.innerHTML = '';
    for (let i = 0; i < conversationMessages.length; i++) {
        let messageid = conversationMessages[i];
        conversationcontainer.appendChild(renderMessage(messageid, true, (linktarget) => {
            conversationMessages.splice(i + 1);
            conversationMessages.push(linktarget);
            renderConvo();
        }));
    }
}
textarea.addEventListener('keydown', e => {
    if (e.key == 'Enter' && e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
document.addEventListener('click', e => {
    var target = e.target;
    if (target.closest('#cursorfloater') != cursorfloater) {
        cursorfloater.style.display = 'none';
    }
});
function setCursorFloater(poselement, targetMessage) {
    cursorfloater.style.display = '';
    var rect = poselement.getBoundingClientRect();
    cursorfloater.style.top = `${rect.top + window.pageYOffset + 5}px`;
    cursorfloater.style.left = `${rect.right + window.pageXOffset + 5}px`;
    cursorfloater.replaceChild(renderMessage(targetMessage, false, () => {
        console.log('hover message link');
    }), cursorfloater.firstChild);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy92ZWN0b3J4L3ZlY3Rvci50cyIsIm5vZGVfbW9kdWxlcy91dGlsc3gvdXRpbHMudHMiLCJtZXNzYWdlLnRzIiwibWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE1BQU07SUFHUixZQUFZLEdBQUcsSUFBYTtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBRUQsR0FBRyxDQUFDLFFBQXdDO1FBQ3hDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztZQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtTQUN4QjtRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxD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