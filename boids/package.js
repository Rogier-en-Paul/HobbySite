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
    var front = boid.speed.c().normalize().scale(size);
    var backleft = rotate2d(boid.speed.c().normalize(), 0.4).scale(size);
    var backright = rotate2d(boid.speed.c().normalize(), -0.4).scale(size);
    drawTriangle(boid.pos.c().add(front), boid.pos.c().add(backright), boid.pos.c().add(backleft));
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
var screensize = new Vector(document.documentElement.clientWidth, document.documentElement.clientHeight - 4);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy91dGlsc3gvdXRpbHMudHMiLCJub2RlX21vZHVsZXMvdmVjdG9yeC92ZWN0b3IudHMiLCJib2lkLnRzIiwidXRpbHMudHMiLCJwcm9qZWN0dXRpbHMudHMiLCJtYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVEQUF1RDtBQUd2RCxhQUFhLElBQVksRUFBRSxNQUFjLEVBQUUsS0FBYSxFQUFFLE1BQWMsRUFBRSxLQUFhO0lBQ25GLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQzNFLENBQUM7QUFFRCxpQkFBaUIsR0FBVyxFQUFFLEdBQVcsRUFBRSxLQUFhO0lBQ3BELEVBQUUsQ0FBQSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQSxDQUFDO1FBQ1YsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2YsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNWLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDZixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLEdBQUcsQ0FBQztBQUN4QyxDQUFDO0FBRUQsYUFBYSxDQUFTLEVBQUUsQ0FBUztJQUM3QixFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQUVELGFBQWEsQ0FBUyxFQUFFLENBQVM7SUFDN0IsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbEIsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNiLENBQUM7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QUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsQ0FBQztZQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUN6QixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsS0FBSyxDQUFDLENBQVE7UUFDVixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBRUQsTUFBTTtRQUNGLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsU0FBUztRQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQVE7UUFDUCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQsSUFBSSxDQUFDLENBQVEsRUFBQyxNQUFhO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDakQsQ0FBQztJQUVELENBQUM7UUFDRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDOUMsQ0FBQztJQUVELFNBQVMsQ0FBQyxDQUFRO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FB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QUFDLENBQUMsRUFBRSxDQUFBO0FBQ3BDLENBQUM7QUFFRCxrQkFBa0IsSUFBUztJQUN2QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7SUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQTtJQUNSLElBQUksQ0FBQyxLQUFLLENBQUE7SUFDVixJQUFJLElBQUksR0FBRyxDQUFDLENBQUE7SUFDWixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNsRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbkUsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDckUsWUFBWSxDQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQzdCLENBQUE7QUFDTCxDQUFDO0FBRUQsdUJBQXVCLElBQVM7SUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsUUFBUSxDQUFDLENBQUE7SUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsVUFBVSxDQUFDLENBQUE7SUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsUUFBUSxDQUFDLENBQUE7QUFDN0IsQ0FBQztBQUVE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RSxJQUFJLHdCQUF3QixHQUFHLHlCQUF5QixDQUFDLElBQUksRUFBQyxRQUFRLENBQUMsQ0FBQTtRQUN2RSxJQUFJLDRCQUE0QixHQUFHLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2xFLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzdDLEVBQUUsQ0FBQSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFDdEMsUUFBUSxHQUFHLHdCQUF3QixDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2xJLENBQUM7UUFFRCxFQUFFLENBQUEsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQ3RDLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdEksQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLDRCQUE0QixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFDMUMsUUFBUSxHQUFHLDRCQUE0QixDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLE1BQU0sRUFBRSxFQUFD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TUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBQ0QsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3RILE1BQU0sQ0FBQyxHQUFHLENBQUE7QUFDZCxDQUFDO0FBRUQsb0JBQW9CLEtBQVk7SUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNyRyxDQUFDIn0=