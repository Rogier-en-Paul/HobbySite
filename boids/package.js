/// <reference path="node_modules/vectorx/vector.ts" />
function map(val1, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((val1 - start1) / (stop1 - start1));
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
        this.cooldown = 1000;
        this.lastfire = Date.now();
        this.rules = [
            new Rule('not ready yet', () => (this.lastfire + this.cooldown) < Date.now())
        ];
        this.onCastFinished = new EventSystemVoid();
    }
    tryfire() {
        if (this.rules.some(r => r.cb())) {
            this.cb();
            this.lastfire = Date.now();
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
        this.path = [];
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
class Boid {
    constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
    }
}
function cacheBoid(boid) {
    boid.cachepos = boid.pos.c();
    boid.cachespeed = boid.speed.c();
}
function drawBoid(boid) {
    ctxt.beginPath();
    boid.pos;
    boid.speed;
    var size = 5;
    var oldleft = boid.cacheLeft;
    var oldright = boid.cacheRight;
    var front = boid.speed.c().normalize().scale(size);
    var backleft = rotate2d(boid.speed.c().normalize(), 0.4).scale(size);
    var backright = rotate2d(boid.speed.c().normalize(), -0.4).scale(size);
    boid.cacheLeft = boid.pos.c().add(backleft);
    boid.cacheRight = boid.pos.c().add(backright);
    if (oldleft != null) {
        var dist = oldright.to(boid.pos.c().add(backright)).length();
        if (dist <= 50) {
            drawPolygon([
                oldleft,
                oldright,
                boid.pos.c().add(backright),
                boid.pos.c().add(backleft),
            ]);
        }
    }
    drawTriangle(boid.pos.c().add(front), boid.pos.c().add(backright), boid.pos.c().add(backleft));
}
function drawPolygon(points) {
    ctxt.beginPath();
    ctxt.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctxt.lineTo(points[i].x, points[i].y);
    }
    ctxt.closePath();
    ctxt.fill();
}
function debugDrawBoid(boid) {
    circle(boid.pos, seprange);
    circle(boid.pos, alignrange);
    circle(boid.pos, cohrange);
}
function circle(center, radius) {
    ctxt.beginPath();
    ctxt.arc(center.x, center.y, radius, 0, TAU);
    ctxt.stroke();
}
function getBoidsInSight(self, maxangle, radius) {
    var res = [];
    for (var boid of boids) {
        if (self == boid) {
            continue;
        }
        if (self.cachepos.to(boid.cachepos).length() <= radius && self.cachespeed.c().normalize().dot(self.cachepos.to(boid.cachepos).normalize()) >= map(maxangle, 0, 0.5, 1, -1)) {
            res.push(boid);
        }
    }
    return res;
}
function rotate2d(v, rots) {
    var cost = Math.cos(rots * TAU);
    var sint = Math.sin(rots * TAU);
    var x = v.x * cost - v.y * sint;
    var y = v.y * cost + v.x * sint;
    v.x = x;
    v.y = y;
    return v;
}
function drawTriangle(a, b, c) {
    ctxt.beginPath();
    ctxt.moveTo(a.x, a.y);
    ctxt.lineTo(b.x, b.y);
    ctxt.lineTo(c.x, c.y);
    ctxt.closePath();
    ctxt.fill();
}
function map2(val, from1, from2, to1, to2) {
    return lerp(inverseLerp(val, from1, from2), to1, to2);
}
function inverseLerp(val, a, b) {
    return to(a, val) / to(a, b);
}
function clampMagnitude(v, min, max) {
    if (v.length() > max) {
        return setMagnitude(v, max);
    }
    else if (v.length() < min) {
        return setMagnitude(v, min);
    }
    else {
        return v;
    }
}
function setMagnitude(v, magnitude) {
    return v.scale(magnitude / v.length());
}
RNG.prototype.norm = function () {
    return this.next() / this.mod;
};
RNG.prototype.range = function (min, max) {
    return this.norm() * to(min, max) + min;
};
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="boid.ts" />
/// <reference path="utils.ts" />
/// <reference path="projectutils.ts" />
var screensize = new Vector(document.documentElement.clientWidth, document.documentElement.clientHeight);
var crret = createCanvas(screensize.x, screensize.y);
var canvas = crret.canvas;
var ctxt = crret.ctxt;
var TAU = Math.PI * 2;
var cohrange = 200;
var seprange = 50;
var alignrange = 150;
var rng = new RNG(0);
var boids = [];
var speed = 100;
for (var i = 0; i < 100; i++) {
    boids.push(new Boid(new Vector(rng.range(0, screensize.x), rng.range(0, screensize.y)), new Vector(rng.norm(), rng.norm()).sub(new Vector(0.5, 0.5)).normalize().scale(speed)));
}
var mousepos = screensize.c().scale(0.5);
document.addEventListener('mousemove', e => {
    mousepos = getMousePos(canvas, e);
});
var mousedown = false;
document.addEventListener('mousedown', () => {
    mousedown = true;
});
document.addEventListener('mouseup', () => {
    mousedown = false;
});
var backgroundanim = new Anim();
backgroundanim.animType = AnimType.repeat;
backgroundanim.stopwatch.start();
backgroundanim.begin = 0;
backgroundanim.end = 360;
backgroundanim.duration = 60 * 1000;
ctxt.fillRect(0, 0, screensize.x, screensize.y);
var windstrength = 40;
var winddirectionanim = new Anim();
winddirectionanim.animType = AnimType.repeat;
winddirectionanim.stopwatch.start();
winddirectionanim.begin = 0;
winddirectionanim.end = 1;
winddirectionanim.duration = 10 * 1000;
loop((dt) => {
    dt /= 1000;
    dt = clamp(dt, 0.002, 0.10);
    // ctxt.clearRect(0,0,screensize.x,screensize.y)
    ctxt.fillStyle = `hsl(${backgroundanim.get()},100%,50%)`;
    for (var boid of boids) {
        cacheBoid(boid);
    }
    // if(mousedown){
    //     debugger
    // }
    for (var boid of boids) {
        var acc = new Vector(0, 0);
        var sepforce = new Vector(0, 0);
        var cohforce = new Vector(0, 0);
        var aliforce = new Vector(0, 0);
        var dist2AverageNeighbourCoh = calcDist2AverageNeighbour(boid, cohrange);
        var dist2AverageNeighbourSep = calcDist2AverageNeighbour(boid, seprange);
        var averageDirectionOfNeighbours = calcDirectionOfNeighbours(boid);
        var dst2mousepos = boid.cachepos.to(mousepos);
        if (dist2AverageNeighbourCoh.length() > 0) {
            cohforce = dist2AverageNeighbourCoh.c().normalize().scale(clamp(map(dist2AverageNeighbourCoh.length(), 0, cohrange, 50, 20), 0, 50));
        }
        if (dist2AverageNeighbourSep.length() > 0) {
            sepforce = dist2AverageNeighbourSep.c().normalize().scale(clamp(map(dist2AverageNeighbourSep.length(), 40, seprange, -100, 0), -100, 0));
        }
        if (averageDirectionOfNeighbours.length() > 0) {
            aliforce = averageDirectionOfNeighbours.c().normalize().scale(clamp(map(averageDirectionOfNeighbours.length(), 0, 1, 40, 80), 0, 80));
        }
        if (dst2mousepos.length() > 0) {
            acc.add(dst2mousepos.c().normalize().scale(clamp(map(dst2mousepos.length(), 130, 150, -300, 0), -300, 0)));
        }
        acc.add(sepforce);
        acc.add(cohforce);
        acc.add(aliforce);
        acc.add(rotate2d(new Vector(0, -1), winddirectionanim.get()).scale(windstrength));
        clampMagnitude(acc, 0, 300);
        boid.speed.add(acc.scale(dt));
        clampMagnitude(boid.speed, 10, 130);
        boid.pos.add(boid.speed.c().scale(dt));
        boid.pos.x = mod(boid.pos.x, screensize.x);
        boid.pos.y = mod(boid.pos.y, screensize.y);
    }
    for (var boid of boids) {
        drawBoid(boid);
    }
    // debugDrawBoid(boids[0])
});
function calcDist2AverageNeighbour(self, lookradius) {
    var boids = getBoidsInSight(self, 0.25, lookradius);
    if (boids.length == 0) {
        return new Vector(0, 0);
    }
    var avg = calcAvgPos(boids);
    var dir = self.cachepos.to(avg);
    return dir;
}
function calcDirectionOfNeighbours(self) {
    var boids = getBoidsInSight(self, 3 / 8, alignrange);
    if (boids.length == 0) {
        return new Vector(0, 0);
    }
    var avg = boids.reduce((acc, boid) => acc.add(boid.cachespeed.c().normalize()), new Vector(0, 0)).scale(1 / boids.length);
    return avg;
}
function calcAvgPos(boids) {
    return boids.reduce((acc, boid) => acc.add(boid.cachepos), new Vector(0, 0)).scale(1 / boids.length);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy91dGlsc3gvdXRpbHMudHMiLCJub2RlX21vZHVsZXMvdmVjdG9yeC92ZWN0b3IudHMiLCJib2lkLnRzIiwidXRpbHMudHMiLCJwcm9qZWN0dXRpbHMudHMiLCJtYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVEQUF1RDtBQUd2RCxTQUFTLEdBQUcsQ0FBQyxJQUFZLEVBQUUsTUFBYyxFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQUUsS0FBYTtJQUNuRixPQUFPLE1BQU0sR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDM0UsQ0FBQztBQUlELFNBQVMsT0FBTyxDQUFDLEdBQVcsRUFBRSxHQUFXLEVBQUUsS0FBYTtJQUNwRCxJQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUM7UUFDVCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUM7UUFDZixHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ1YsR0FBRyxHQUFHLElBQUksQ0FBQztLQUNkO0lBQ0QsT0FBTyxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxHQUFHLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsR0FBRyxDQUFDLENBQVMsRUFBRSxDQUFTO0lBQzdCLElBQUcsQ0FBQyxHQUFHLENBQUM7UUFBQyxPQUFPLENBQUMsQ0FBQztJQUNsQixPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFFRCxTQUFTLEdBQUcsQ0FBQyxDQUFTLEVBQUUsQ0FBUztJQUM3QixJQUFHLENBQUMsR0FBRyxDQUFDO1FBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEIsT0FBTyxDQUFDLENBQUM7QUFDYixDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsR0FBVyxFQUFFLEdBQVcsRUFBRSxHQUFXO0lB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LEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsS0FBSyxDQUFDLENBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMzQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQVE7UUFDUCxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFRLEVBQUMsTUFBYTtRQUN2QixPQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxH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