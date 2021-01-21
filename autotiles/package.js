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
    floor() {
        return this.map((arr, i) => arr[i] = Math.floor(arr[i]));
    }
    ceil() {
        return this.map((arr, i) => arr[i] = Math.ceil(arr[i]));
    }
    round() {
        return this.map((arr, i) => arr[i] = Math.round(arr[i]));
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
class Store {
    constructor() {
        this.map = new Map();
        this.counter = 0;
    }
    get(id) {
        return this.map.get(id);
    }
    add(item) {
        item.id = this.counter++;
        this.map.set(item.id, item);
        return item;
    }
    list() {
        return Array.from(this.map.values());
    }
    remove(id) {
        var val = this.map.get(id);
        this.map.delete(id);
        return val;
    }
}
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
function startMouseListen(localcanvas) {
    var mousepos = new Vector(0, 0);
    var oldmousepos = new Vector(0, 0);
    document.addEventListener('mousemove', (e) => {
        oldmousepos.overwrite(mousepos);
        mousepos.overwrite(getMousePos(localcanvas, e));
    });
    return [mousepos, oldmousepos];
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
var lastUpdate = Date.now();
function loop(callback) {
    var now = Date.now();
    callback((now - lastUpdate) / 1000);
    lastUpdate = now;
    requestAnimationFrame(() => {
        loop(callback);
    });
}
function mod(number, modulus) {
    return ((number % modulus) + modulus) % modulus;
}
var keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});
function getMoveInput() {
    var dir = new Vector(0, 0);
    if (keys['a'])
        dir.x--; //left
    if (keys['w'])
        dir.y++; //up
    if (keys['d'])
        dir.x++; //right
    if (keys['s'])
        dir.y--; //down
    return dir;
}
function getMoveInputYFlipped() {
    var input = getMoveInput();
    input.y *= -1;
    return input;
}
function loadTextFiles(strings) {
    var promises = [];
    for (var string of strings) {
        var promise = fetch(string)
            .then(resp => resp.text())
            .then(text => text);
        promises.push(promise);
    }
    return Promise.all(promises);
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
function string2html(string) {
    var div = document.createElement('div');
    div.innerHTML = string;
    return div.children[0];
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
function first(arr) {
    return arr[0];
}
function last(arr) {
    return arr[arr.length - 1];
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
function get2DArraySize(arr) {
    return new Vector(arr[0].length, arr.length);
}
function index2D(arr, i) {
    return arr[i.x][i.y];
}
function copy2dArray(arr) {
    return create2DArray(get2DArraySize(arr), pos => index2D(arr, pos));
}
function round(number, decimals) {
    var mul = Math.pow(10, decimals);
    return Math.round(number * mul) / mul;
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
        this.onCastFinished = new EventSystem();
        this.shots = 0;
        this.firing = false;
    }
    //positive if you need to wait 0 or negative if you can call it
    timeTillNextPossibleActivation() {
        return to(Date.now(), this.lastfire + this.cooldown);
    }
    canActivate() {
        return this.rules.every(r => r.cb());
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
class Rect {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    collidePoint(point) {
        for (var i = 0; i < this.min.vals.length; i++) {
            if (!inRange(this.min.vals[i], this.max.vals[i], point.vals[i])) {
                return false;
            }
        }
        return true;
    }
    size() {
        return this.min.to(this.max);
    }
    collideBox(other) {
        for (var i = 0; i < 2; i++) {
            if (!rangeOverlap(this.min[i], this.max[i], other.min[i], other.max[i])) {
                return false;
            }
        }
        return true;
    }
    getPoint(relativePos) {
        return this.min.c().add(this.size().mul(relativePos));
    }
    draw(ctxt) {
        var size = this.size();
        ctxt.fillRect(this.min.x, this.min.y, size.x, size.y);
    }
    move(pos) {
        var size = this.size();
        this.min = pos;
        this.max = this.min.c().add(size);
    }
    loop(callback) {
        var temp = this.max.c();
        this.size().loop(v2 => {
            temp.overwrite(v2);
            temp.add(this.min);
            callback(temp);
        });
    }
}
function rangeOverlap(range1A, range1B, range2A, range2B) {
    return range1A <= range2B && range2A <= range1B;
}
class EventQueue {
    constructor() {
        this.idcounter = 0;
        this.onProcessFinished = new EventSystem();
        this.listeners = [];
        this.events = [];
    }
    listen(type, cb) {
        var id = this.idcounter++;
        this.listeners.push({
            id: id,
            type: type,
            cb,
        });
        return id;
    }
    listenOnce(type, cb) {
        let id = this.listen(type, (data) => {
            this.unlisten(id);
            cb(data);
        });
        return id;
    }
    unlisten(id) {
        var index = this.listeners.findIndex(o => o.id == id);
        this.listeners.splice(index, 1);
    }
    process() {
        while (this.events.length > 0) {
            let current = this.events.shift();
            var listeners = this.listeners.filter(l => l.type == current.type);
            for (var listener of listeners) {
                listener.cb(current.data);
            }
        }
        this.onProcessFinished.trigger(0);
    }
    add(type, data) {
        this.events.push({
            type: type,
            data: data,
        });
    }
    addAndTrigger(type, data) {
        this.add(type, data);
        this.process();
    }
}
class EventSystem {
    constructor() {
        this.idcounter = 0;
    }
    listen(cb) {
        var listener = {
            id: this.idcounter++,
            cb: cb,
        };
        this.listeners.push(listener);
        return listener.id;
    }
    unlisten(id) {
        var index = this.listeners.findIndex(o => o.id == id);
        this.listeners.splice(index, 1);
    }
    trigger(val) {
        for (var listener of this.listeners) {
            listener.cb(val);
        }
    }
}
var Directions;
(function (Directions) {
    Directions[Directions["tl"] = 0] = "tl";
    Directions[Directions["tm"] = 1] = "tm";
    Directions[Directions["tr"] = 2] = "tr";
    Directions[Directions["ml"] = 3] = "ml";
    Directions[Directions["mm"] = 4] = "mm";
    Directions[Directions["mr"] = 5] = "mr";
    Directions[Directions["bl"] = 6] = "bl";
    Directions[Directions["bm"] = 7] = "bm";
    Directions[Directions["br"] = 8] = "br";
})(Directions || (Directions = {}));
var dir2vecmap = new Map();
dir2vecmap.set(Directions.tl, new Vector(-1, -1));
dir2vecmap.set(Directions.tm, new Vector(0, -1));
dir2vecmap.set(Directions.tr, new Vector(1, -1));
dir2vecmap.set(Directions.ml, new Vector(-1, 0));
dir2vecmap.set(Directions.mm, new Vector(0, 0));
dir2vecmap.set(Directions.mr, new Vector(1, 0));
dir2vecmap.set(Directions.bl, new Vector(-1, 1));
dir2vecmap.set(Directions.bm, new Vector(0, 1));
dir2vecmap.set(Directions.br, new Vector(1, 1));
var vec2dirmap = new Map();
for (var [dir, vec] of dir2vecmap) {
    vec2dirmap.set(hashVector(vec), dir);
}
function rotate90(v) {
    return new Vector(-v.y, v.x);
}
function rotate180(v) {
    return new Vector(-v.x, -v.y);
}
function rotate270(v) {
    return new Vector(v.y, -v.x);
}
function rotateDirection90(d) {
    var v = dir2vecmap.get(d);
    var rotted = rotate90(v);
    return vec2dirmap.get(hashVector(rotted));
}
class RuleTile {
    constructor(tileid, cb) {
        this.tileid = tileid;
        this.cb = cb;
    }
}
function normalRule(tileid, setofpositionwithids) {
    return new RuleTile(tileid, (neighbours) => {
        return checkdirections(setofpositionwithids, neighbours);
    });
}
function rotated(tileids, setofpositionwithids) {
    var res = [];
    let zero = setofpositionwithids;
    let _90 = rotateDirectionMap(zero);
    let _180 = rotateDirectionMap(_90);
    let _270 = rotateDirectionMap(_180);
    res.push(new RuleTile(tileids[0], (neighbours) => {
        return checkdirections(zero, neighbours);
    }));
    res.push(new RuleTile(tileids[1], (neighbours) => {
        return checkdirections(_90, neighbours);
    }));
    res.push(new RuleTile(tileids[2], (neighbours) => {
        return checkdirections(_180, neighbours);
    }));
    res.push(new RuleTile(tileids[3], (neighbours) => {
        return checkdirections(_270, neighbours);
    }));
    return res;
}
function mirrorX(tileid, setofpositionwithids) {
    var map = mirrorXDirectionMap(setofpositionwithids);
    var original = new RuleTile(tileid, (neighbours) => {
        return checkdirections(setofpositionwithids, neighbours);
    });
    var res = new RuleTile(tileid, (neighbours) => {
        return checkdirections(map, neighbours);
    });
    return [original, res];
}
function mirrorY(tileid, setofpositionwithids) {
    var map = mirrorYDirectionMap(setofpositionwithids);
    var original = new RuleTile(tileid, (neighbours) => {
        return checkdirections(setofpositionwithids, neighbours);
    });
    var res = new RuleTile(tileid, (neighbours) => {
        return checkdirections(map, neighbours);
    });
    return [original, res];
}
class AutoTiler {
    constructor() {
        this.tiles = [];
        this.input = new List2D2();
        this.vertices = new List2D2();
        this.edges = new List2D2();
        this.output = new List2D2();
    }
    processAll() {
        this.vertices.loop2d(v => {
            this.processTile2(v);
        });
    }
    processTile(v) {
        var neighbours = this.getNeighbours(v);
        var firsttile = this.tiles.find(r => r.cb(neighbours));
        if (firsttile) {
            this.output.set(v, firsttile.tileid);
        }
    }
    processTile2(v) {
        var neighbours = this.getVertexNeighbours(v);
        var firsttile = this.tiles.find(r => r.cb(neighbours));
        if (firsttile) {
            this.output.set(v, firsttile.tileid);
        }
    }
    processAround(pos) {
        var dirs = [new Vector(-1, -1), new Vector(0, -1), new Vector(0, 0), new Vector(-1, 0)];
        for (var direction of dirs) {
            var abspos = pos.c().add(direction);
            this.processTile2(abspos);
        }
    }
    getNeighbours(pos) {
        var res = new Map();
        for (var [key, value] of dir2vecmap) {
            res.set(key, 0); //guarantees the void neigbhours are set to 0
        }
        for (var [alias, direction] of dir2vecmap.entries()) {
            var abspos = pos.c().add(direction);
            res.set(alias, this.input.get(abspos));
        }
        return res;
    }
    getVertexNeighbours(pos) {
        var res = new Map();
        for (var [key, value] of dir2vecmap) {
            res.set(key, 0); //guarantees the void neigbhours are set to 0
        }
        // res.set(Directions.mm,this.input.get(pos))
        var vertexneighbours = [new Vector(0, 0), new Vector(1, 0), new Vector(0, 1), new Vector(1, 1),];
        var vertexdirections = [Directions.tl, Directions.tr, Directions.bl, Directions.br];
        for (var i = 0; i < vertexneighbours.length; i++) {
            res.set(vertexdirections[i], this.vertices.get(pos.c().add(vertexneighbours[i])));
        }
        return res;
    }
    getEdgeNeighbours(pos) {
        var res = new Map();
        for (var [key, value] of dir2vecmap) {
            res.set(key, 0); //guarantees the void neigbhours are set to 0
        }
        var topleftedges = this.edges.get(pos);
        var botleft = this.edges.get(pos.c().add(new Vector(1, 0)));
        var topright = this.edges.get(pos.c().add(new Vector(0, 1)));
        res.set(Directions.tm, topleftedges[0]);
        res.set(Directions.mr, topright[1]);
        res.set(Directions.ml, topleftedges[1]);
        res.set(Directions.bm, botleft[0]);
        return res;
    }
}
function mirrorXDirectionMap(setofpositionwithids) {
    var newmap = new Map();
    for (var [dir, id] of setofpositionwithids) {
        var vdir = dir2vecmap.get(dir).c();
        vdir.x = -vdir.x;
        var mirrordir = vec2dirmap.get(hashVector(vdir));
        newmap.set(mirrordir, id);
    }
    return newmap;
}
function mirrorYDirectionMap(setofpositionwithids) {
    var newmap = new Map();
    for (var [dir, id] of setofpositionwithids) {
        var vdir = dir2vecmap.get(dir).c();
        vdir.y = -vdir.y;
        var mirrordir = vec2dirmap.get(hashVector(vdir));
        newmap.set(mirrordir, id);
    }
    return newmap;
}
function rotateDirectionMap(setofpositionwithids) {
    var newmap = new Map();
    for (var [dir, id] of setofpositionwithids) {
        newmap.set(rotateDirection90(dir), id);
    }
    return newmap;
}
function checkdirections(checks, neighbours) {
    return Array.from(checks.entries()).every(([key, value]) => { var _a; return (((_a = neighbours.get(key)) !== null && _a !== void 0 ? _a : 0) == value); });
}
function hashVector(v) {
    return v.x + v.y * 1000;
}
function write2D(arr, v, val) {
    arr[v.y][v.x] = val;
    return arr;
}
function read2D(arr, v) {
    return arr[v.y][v.x];
}
function loadImagesCO(urls) {
    var promises = [];
    for (var url of urls) {
        promises.push(new Promise((res, rej) => {
            var image = new Image();
            image.crossOrigin = 'anonymous';
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
class List {
    constructor() {
        this.arr = new Array(10);
        this.negsize = 0;
        this.possize = 0;
        this._2Dsize = new Rect(new Vector(0, 0), new Vector(0, 0));
    }
    // _2Dcapacity = new Rect(new Vector(-10,-10),new Vector(10,10))
    get(index) {
        if (this.isInBounds(index)) {
            return this.arr[this.IndexRel2abs(index)];
        }
        else {
            throw "out of bounds";
        }
    }
    get2d(index) {
        if (this._2Dsize.collidePoint(index)) {
        }
        else {
            //throw
        }
        var index2 = this._2Dtoo1D(index);
        return this.get(index2);
    }
    set(val, index) {
        this.oldnegsize = this.negsize;
        this.oldpossize = this.possize;
        if (index < 0) {
            this.negsize = Math.max(Math.abs(index), this.negsize);
        }
        else {
            this.possize = Math.max(index, this.possize);
        }
        this.checkResize();
        var absindex = this.IndexRel2abs(index);
        this.arr[absindex] = val;
    }
    start() {
        return -this.negsize;
    }
    set2d(index, val) {
        if (this._2Dsize.collidePoint(index)) {
            var index2 = this._2Dtoo1D(index);
            return this.set(val, index2);
        }
        else {
            //create boundingbox with current 2dsize and index position
            var newboundingbox = this.expandBoundingBox(index);
            this.set2dSize(newboundingbox);
            // this.resize()
            //increase 2d boundingbox size
            //create new list
            //write old data to the new list
        }
    }
    expandBoundingBox(newpoint) {
        return new Rect(new Vector(Math.min(newpoint.x, this._2Dsize.min.x), Math.min(newpoint.y, this._2Dsize.min.y)), new Vector(Math.max(newpoint.x, this._2Dsize.max.x), Math.max(newpoint.y, this._2Dsize.max.y)));
    }
    set2dSize(newboundingbox) {
        var oldsize = this._2Dsize.size();
        var newsize = newboundingbox.size();
        var newarray = new Array(newsize.x * newsize.y);
        oldsize.loop2d(v => {
            newarray[v.y * newsize.x + v.x] = this.get2d(v);
        });
        this.negsize = Math.abs(Math.min(newboundingbox.min.x, 0)) * Math.abs(Math.min(newboundingbox.min.y, 0));
        this.possize = Math.max(newboundingbox.max.x, 1) * Math.max(newboundingbox.max.y, 1);
        this._2Dsize = newboundingbox;
        this.arr = newarray;
    }
    containeditems(v) {
        return v.x * (v.y + 1);
    }
    length() {
        return this.negsize + this.possize;
    }
    isInBounds(relindex) {
        return inRange(-this.negsize, this.possize - 1, relindex);
    }
    checkResize() {
        if ((this.negsize + this.possize) > this.arr.length) {
            this.resize((this.negsize + this.possize) * 2);
        }
    }
    resize(newsize) {
        var newarray = new Array(newsize);
        //copy all positive values to the beginning
        arrcopy(this.arr, 0, newarray, 0, this.oldpossize);
        //copy all negative values to the end
        arrcopy(this.arr, this.arr.length - this.oldnegsize, newarray, newarray.length - this.oldnegsize, this.oldnegsize);
    }
    IndexRel2abs(index) {
        return mod(index, this.arr.length);
    }
    _2Dtoo1D(v) {
        return v.y * this._2Dsize.size().x + v.x;
    }
}
class List2D {
    constructor(dimensions, fill) {
        this.dimensions = dimensions;
        this.arr = [];
        this.arr = new Array(dimensions.x * dimensions.y);
        this.arr.fill(fill);
    }
    get(index) {
        return this.arr[this.index2Dto1D(index)];
    }
    set(index, val) {
        this.arr[this.index2Dto1D(index)] = val;
    }
    index2Dto1D(index) {
        return index.y * this.dimensions.x + index.x;
    }
    toGrid() {
        var res = create2DArray(this.dimensions, (pos) => this.get(pos));
        return res;
    }
    checkIndex(index) {
        return index.x < this.dimensions.x && index.y < this.dimensions.y;
    }
    resize(dimensions) {
        var newa = new List2D(dimensions, null);
        var capped = new Vector(Math.min(this.dimensions.x, dimensions.x), Math.min(this.dimensions.y, dimensions.y));
        capped.loop2d(v => {
            newa.set(v, this.get(v));
        });
        this.dimensions = newa.dimensions;
        this.arr = newa.arr;
    }
}
function arrcopy(src, srcstart, dst, dststart, length) {
    for (var i = 0; i < length; i++) {
        dst[dststart + i] = src[srcstart + i];
    }
}
class Sprite {
    constructor(img, rotations, ctxt) {
        this.img = img;
        this.rotations = rotations;
        this.ctxt = ctxt;
    }
    draw(pos, tilesieze) {
        this.ctxt.save();
        this.ctxt.rotate(this.rotations * TAU);
        this.ctxt.drawImage(this.img, pos.x, pos.y, tilesieze.x, tilesieze.y);
        this.ctxt.restore();
    }
    static rotated(img, ctxt) {
        return [
            new Sprite(img, 0, ctxt),
            new Sprite(img, 0.25, ctxt),
            new Sprite(img, 0.5, ctxt),
            new Sprite(img, 0.75, ctxt),
        ];
    }
}
function drawImage(img, ctxt, pos, size, rotations) {
    ctxt.save();
    var offset = pos.c().add(size.c().scale(0.5));
    ctxt.translate(offset.x, offset.y);
    ctxt.rotate(rotations * TAU);
    ctxt.translate(-offset.x, -offset.y);
    ctxt.drawImage(img, pos.x, pos.y, size.x, size.y);
    ctxt.restore();
}
class Camera {
    constructor(ctxt) {
        this.ctxt = ctxt;
        this.pos = new Vector(0, 0);
        this.scale = new Vector(1, 1);
    }
    begin() {
        ctxt.save();
        var m = this.createMatrixScreen2World().inverse();
        ctxt.transform(m.a, m.b, m.c, m.d, m.e, m.f);
    }
    end() {
        ctxt.restore();
    }
    createMatrixScreen2World() {
        var a = new DOMMatrix([
            1, 0, 0, 1, -screensize.x / 2, -screensize.y / 2
        ]);
        var b = new DOMMatrix([
            this.scale.x, 0, 0, this.scale.y, this.pos.x, this.pos.y
        ]);
        return b.multiply(a);
    }
    screen2world(pos) {
        var dompoint = this.createMatrixScreen2World().transformPoint(new DOMPoint(pos.x, pos.y));
        return new Vector(dompoint.x, dompoint.y);
    }
    world2screen(pos) {
        var dompoint = this.createMatrixScreen2World().inverse().transformPoint(new DOMPoint(pos.x, pos.y));
        return new Vector(dompoint.x, dompoint.y);
    }
}
class List2D2 {
    constructor() {
        this.list = new NegativeList();
        this.bounding = new Rect(new Vector(-5, -5), new Vector(5, 5));
        var size = this.bounding.size();
        this.list.resize(size.x * size.y);
    }
    loop2d(cb) {
        var index = new Vector(0, 0);
        for (index.x = this.list.start(); index.x < this.list.end(); index.x++) {
            var list = this.list.get(index.x);
            if (list != null) {
                for (index.y = list.start(); index.y < list.end(); index.y++) {
                    cb(index, list.get(index.y));
                }
            }
        }
    }
    isInBounds(index) {
        return inRange(this.bounding.min.x, this.bounding.max.x - 1, index.x) &&
            inRange(this.bounding.min.y, this.bounding.max.y - 1, index.y);
    }
    get(index) {
        var _a, _b;
        return (_b = (_a = this.list.get(index.x)) === null || _a === void 0 ? void 0 : _a.get(index.y)) !== null && _b !== void 0 ? _b : null;
    }
    set(index, val) {
        if (this.list.get(index.x) == null) {
            this.list.set(new NegativeList(), index.x);
        }
        this.list.get(index.x).set(val, index.y);
        // this.bounding.min.x = Math.min()
        // this.bounding.min.y
        // this.bounding.max.x
        // this.bounding.max.y
    }
}
class NegativeList {
    constructor() {
        this.arr = new Array(10);
        this.negsize = 0;
        this.possize = 0;
    }
    get(index) {
        if (this.isInBounds(index)) {
            return this.arr[this.IndexRel2abs(index)];
        }
        else {
            return null;
        }
    }
    set(val, index) {
        this.oldnegsize = this.negsize;
        this.oldpossize = this.possize;
        if (index < 0) {
            this.negsize = Math.max(Math.abs(index), this.negsize);
        }
        else {
            this.possize = Math.max(index + 1, this.possize);
        }
        this.checkResize();
        var absindex = this.IndexRel2abs(index);
        this.arr[absindex] = val;
    }
    start() {
        return -this.negsize;
    }
    end() {
        return this.possize;
    }
    length() {
        return this.negsize + this.possize;
    }
    isInBounds(relindex) {
        return inRange(-this.negsize, this.possize - 1, relindex);
    }
    checkResize() {
        if ((this.negsize + this.possize) > this.arr.length) {
            this.resize((this.negsize + this.possize) * 2);
        }
    }
    resize(newsize) {
        var newarray = new Array(newsize);
        //copy all positive values to the beginning
        arrcopy(this.arr, 0, newarray, 0, this.oldpossize);
        //copy all negative values to the end
        arrcopy(this.arr, this.arr.length - this.oldnegsize, newarray, newarray.length - this.oldnegsize, this.oldnegsize);
        this.arr = newarray;
    }
    IndexRel2abs(index) {
        return mod(index, this.arr.length);
    }
}
class GrowList {
}
/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/ability.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="autotile.ts" />
/// <reference path="projectutils.ts" />
/// <reference path="list.ts" />
/// <reference path="sprite.ts" />
/// <reference path="camera.ts" />
/// <reference path="2dgrowlist.ts" />
var colors = ['white', 'red', 'blue', 'purple', 'pink', 'orange', 'yellow', 'green', 'cyan', 'brown', 'coral', 'crimson', 'deeppink', 'violet', 'black', 'lawngreen', 'lightgreen'];
var screensize = new Vector(document.documentElement.clientWidth, document.documentElement.clientHeight);
var crret = createCanvas(screensize.x, screensize.y);
var canvas = crret.canvas;
var ctxt = crret.ctxt;
var camera = new Camera(ctxt);
camera.pos = new Vector(0, 0);
camera.scale = new Vector(1, 1);
ctxt.imageSmoothingEnabled = false;
var tilesize = new Vector(32, 32);
//take a list of tiles in order each tile has a rule that looks at its surroundings
//the first tile that passes it's rule gets placed at that spot else leave unchanged/zero
var PaintMode;
(function (PaintMode) {
    PaintMode[PaintMode["erase"] = 0] = "erase";
    PaintMode[PaintMode["fill"] = 1] = "fill";
})(PaintMode || (PaintMode = {}));
var paintmode = PaintMode.fill;
var [mousepos, oldmousepos] = startMouseListen(canvas);
var imagenames = ['void', 'surrounded', 'cornertl', 'openwalltm', 'ml1neighbour', 'alone', '2neighboursopposite', 'error', 'filled', 'boxcorner', 'boxinnercorner', 'openwall', 'diagonal'];
loadImages(imagenames.map(image => `res/${image}.png`)).then(images => {
    var autotiler = new AutoTiler();
    // autotiler.vertices.set(new Vector(0,0),1)
    var spritestore = new Store();
    var filled = spritestore.add(new Sprite(images[8], 0, ctxt));
    var voidsprite = spritestore.add(new Sprite(images[0], 0, ctxt));
    // var surroundSprite = spritestore.add(new Sprite(images[1],0,ctxt)) 
    // var cornersprites = Sprite.rotated(images[2],ctxt).map(s => spritestore.add(s))
    // var threeneighbours = Sprite.rotated(images[3],ctxt).map(s => spritestore.add(s))
    // var oneneighbour = Sprite.rotated(images[4],ctxt).map(s => spritestore.add(s))
    // var twoneigboursoppositevert = spritestore.add(new Sprite(images[6],0.25,ctxt))
    // var twoneigboursoppositehor = spritestore.add(new Sprite(images[6],0,ctxt))
    // var alone = spritestore.add(new Sprite(images[5],0,ctxt)) 
    var error = spritestore.add(new Sprite(images[7], 0, ctxt));
    var boxcorner = Sprite.rotated(images[9], ctxt).map(s => spritestore.add(s));
    var boxinnercorner = Sprite.rotated(images[10], ctxt).map(s => spritestore.add(s));
    var openwall = Sprite.rotated(images[11], ctxt).map(s => spritestore.add(s));
    var diagonal = Sprite.rotated(images[12], ctxt).map(s => spritestore.add(s));
    // autotiler.setup(new List2D( new Vector(100,50),0))
    // var savedinput =  localStorage.getItem('input')
    // if(savedinput != null){
    //     var res = JSON.parse(savedinput)
    //     autotiler.input.arr = res.arr
    // }
    // autotiler.tiles = [
    //     normalRule(voidsprite.id,new Map([[Directions.mm,0]])),
    //     normalRule(surroundSprite.id, new Map([[Directions.ml,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,1],[Directions.mm,1]])),//surrounded by cardinal directions/ center piece
    //     ...rotated(cornersprites.map(s => s.id), new Map([[Directions.ml,0],[Directions.tm,0],[Directions.mr,1],[Directions.bm,1],[Directions.mm,1]])),//tl corner piece
    //     ...rotated(threeneighbours.map(s => s.id), new Map([[Directions.ml,1],[Directions.tm,0],[Directions.mr,1],[Directions.bm,1],[Directions.mm,1]])),//tm 3 neighbours wall piece
    //     ...rotated(oneneighbour.map(s => s.id), new Map([[Directions.ml,0],[Directions.tm,0],[Directions.mr,1],[Directions.bm,0],[Directions.mm,1]])),//ml 1 neighbour
    //     normalRule(twoneigboursoppositevert.id, new Map([[Directions.ml,0],[Directions.tm,1],[Directions.mr,0],[Directions.bm,1],[Directions.mm,1]])),// 2 neighbours opposite vertical
    //     normalRule(twoneigboursoppositehor.id, new Map([[Directions.ml,1],[Directions.tm,0],[Directions.mr,1],[Directions.bm,0],[Directions.mm,1]])),// 2 neighbours opposite horizontal
    //     normalRule(alone.id, new Map([[Directions.ml,0],[Directions.tm,0],[Directions.mr,0],[Directions.bm,0],[Directions.mm,1]])),//alone
    //     normalRule(error.id, new Map([[Directions.mm,1]])),//default catch rule (something went wrong if you see this one)
    // ]
    // autotiler.tiles = [
    //     // normalRule(voidsprite.id,new Map([[Directions.mm,0]])),
    //     normalRule(filled.id,new Map([[Directions.mm,0]])),
    //     ...rotated(boxinnercorner.map(s => s.id), new Map([[Directions.ml,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,1],[Directions.bl,0],[Directions.tl,1],[Directions.tr,1],[Directions.br,1],[Directions.mm,1]])),
    //     normalRule(filled.id,new Map([[Directions.ml,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,1],[Directions.tl,1],[Directions.tr,1],[Directions.bl,1],[Directions.br,1],[Directions.mm,1]])),
    //     ...rotated(boxcorner.map(s => s.id), new Map([[Directions.ml,0],[Directions.tm,0],[Directions.mr,1],[Directions.bm,1],[Directions.br,1],[Directions.mm,1]])),
    //     ...rotated(openwall.map(s => s.id), new Map([[Directions.ml,1],[Directions.tl,1],[Directions.tr,1],[Directions.tm,1],[Directions.mr,1],[Directions.bm,0],[Directions.mm,1]])),
    //     normalRule(error.id, new Map([[Directions.mm,1]])),
    // ]
    autotiler.tiles = [
        normalRule(filled.id, new Map([[Directions.tl, 0], [Directions.tr, 0], [Directions.bl, 0], [Directions.br, 0]])),
        normalRule(filled.id, new Map([[Directions.tl, 1], [Directions.tr, 1], [Directions.bl, 1], [Directions.br, 1]])),
        ...rotated(boxcorner.map(s => s.id), new Map([[Directions.tl, 0], [Directions.tr, 0], [Directions.bl, 0], [Directions.br, 1]])),
        ...rotated(boxinnercorner.map(s => s.id), new Map([[Directions.tl, 1], [Directions.tr, 1], [Directions.bl, 0], [Directions.br, 1]])),
        ...rotated(openwall.map(s => s.id), new Map([[Directions.tl, 1], [Directions.tr, 1], [Directions.bl, 0], [Directions.br, 0]])),
        ...rotated(diagonal.map(s => s.id), new Map([[Directions.tl, 1], [Directions.tr, 0], [Directions.bl, 0], [Directions.br, 1]])),
        normalRule(error.id, new Map([]))
    ];
    autotiler.processAll();
    // document.addEventListener('mousedown', e => {
    //     var pos = getGridMousePos()
    //     if(autotiler.input.get(pos) == 1){
    //         paintmode = PaintMode.erase
    //     }else{
    //         paintmode = PaintMode.fill
    //     }
    //     autotiler.input.set(pos,1 - autotiler.input.get(pos))
    //     autotiler.processAround(pos)
    //     localStorage.setItem('input',JSON.stringify(autotiler.input))
    // })
    // document.addEventListener('mousemove', e => {
    //     var pos = getGridMousePos()
    //     if(e.buttons == 1){
    //         var old = autotiler.input.get(pos)
    //         if(paintmode == PaintMode.fill){
    //             autotiler.input.set(pos,1)
    //         }else{
    //             autotiler.input.set(pos,0)
    //         }
    //         if(old != autotiler.input.get(pos)){
    //             autotiler.processAround(pos)
    //             localStorage.setItem('input',JSON.stringify(autotiler.input))
    //         }
    //     }
    // })
    document.addEventListener('mousedown', e => {
        var pos = getVertexMousePos(mousepos);
        if (autotiler.vertices.get(pos) == 1) {
            paintmode = PaintMode.erase;
        }
        else {
            paintmode = PaintMode.fill;
        }
        paintEdge(pos);
    });
    document.addEventListener('mousemove', e => {
        var oldpos = getVertexMousePos(oldmousepos);
        var newpos = getVertexMousePos(mousepos);
        if (e.buttons == 1) {
            // paintEdge(newpos)
            fullLine(oldpos, newpos).forEach(pos => paintEdge(pos));
        }
    });
    function line(a, b) {
        var res = [];
        var a2b = a.to(b);
        var diagonaldistance = Math.max(Math.abs(a2b.x), Math.abs(a2b.y));
        for (var step = 0; step <= diagonaldistance; step++) {
            var r = diagonaldistance == 0 ? 0 : step / diagonaldistance;
            res.push(a.lerp(b, r).round());
        }
        return res;
    }
    function fullLine(a, b) {
        var a2b = a.to(b);
        var dist = new Vector(Math.abs(a2b.x), Math.abs(a2b.y));
        var sign = new Vector(Math.sign(a2b.x), Math.sign(a2b.y));
        var current = a.c();
        var res = [current.c()];
        for (var x = 0, y = 0; x < dist.x || y < dist.y;) {
            if ((0.5 + x) / dist.x < (0.5 + y) / dist.y) {
                current.x += sign.x;
                x++;
            }
            else {
                current.y += sign.y;
                y++;
            }
            res.push(current.c());
        }
        return res;
    }
    function paintEdge(pos) {
        var old = autotiler.vertices.get(pos);
        if (paintmode == PaintMode.fill) {
            autotiler.vertices.set(pos, 1);
        }
        else {
            autotiler.vertices.set(pos, 0);
        }
        if (old != autotiler.vertices.get(pos)) {
            autotiler.processAround(pos);
            // localStorage.setItem('input',JSON.stringify(autotiler.input))
        }
    }
    document.addEventListener('wheel', e => {
        camera.scale.scale(1 + e.deltaY * 0.001);
    });
    loop((dt) => {
        var worldmousepos = camera.screen2world(mousepos);
        ctxt.fillStyle = 'black';
        ctxt.fillRect(0, 0, screensize.x, screensize.y);
        camera.pos.add(getMoveInputYFlipped().scale(500).scale(camera.scale.x).scale(dt));
        camera.begin();
        renderGrid(autotiler.output);
        ctxt.fillStyle = 'grey';
        if (keys['x']) {
            ctxt.strokeStyle = 'grey';
            drawGrid(ctxt, tilesize);
        }
        // drawgridcell(getGridMousePos())
        drawVertexPos(getVertexMousePos(mousepos));
        camera.end();
    });
    function renderGrid(grid) {
        grid.loop2d((v, tileid) => {
            var sprite = spritestore.get(tileid !== null && tileid !== void 0 ? tileid : 0);
            drawImage(sprite.img, ctxt, v.c().mul(tilesize), tilesize, sprite.rotations);
        });
    }
});
function getGridMousePos(mousepos) {
    return abs2grid(camera.screen2world(mousepos));
}
function getVertexMousePos(mousepos) {
    return camera.screen2world(mousepos).c().div(tilesize).round();
}
function drawgridcell(gridpos) {
    var pos = gridpos.c().mul(tilesize);
    ctxt.fillRect(pos.x, pos.y, tilesize.x, tilesize.y);
}
function drawVertexPos(vertexpos) {
    var pos = vertexpos.c().mul(tilesize);
    var half = tilesize.c().scale(0.5);
    ctxt.fillRect(pos.x - half.x, pos.y - half.y, tilesize.x, tilesize.y);
}
function abs2grid(abs) {
    return abs.c().div(tilesize).floor();
}
function drawGrid(ctxt, tilesize) {
    ctxt.beginPath();
    screensize.c().div(tilesize).ceil().loop2d(v => {
        var pos = v.c().mul(tilesize);
        ctxt.rect(pos.x + 0.5, pos.y + 0.5, tilesize.x, tilesize.y);
    });
    ctxt.stroke();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYnMvdmVjdG9yL3ZlY3Rvci50cyIsImxpYnMvdXRpbHMvcm5nLnRzIiwibGlicy91dGlscy9zdG9yZS50cyIsImxpYnMvdXRpbHMvdGFibGUudHMiLCJsaWJzL3V0aWxzL3V0aWxzLnRzIiwibGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJsaWJzL3V0aWxzL2FiaWxpdHkudHMiLCJsaWJzL3V0aWxzL2FuaW0udHMiLCJsaWJzL3JlY3QvcmVjdC50cyIsImxpYnMvZXZlbnQvZXZlbnRxdWV1ZS50cyIsImxpYnMvZXZlbnQvZXZlbnRzeXN0ZW0udHMiLCJhdXRvdGlsZS50cyIsInByb2plY3R1dGlscy50cyIsImxpc3QudHMiLCJzcHJpdGUudHMiLCJjYW1lcmEudHMiLCIyZGdyb3dsaXN0LnRzIiwibWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE1BQU07SUFHUixZQUFZLEdBQUcsSUFBYTtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBRUQsR0FBRyxDQUFDLFFBQXdDO1FBQ3hDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztZQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtTQUN4QjtRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxLQUFLO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDMUQsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzNELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJ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QUFFLENBQUE7SUFBQyx1Q0FBRSxDQUFBO0lBQUMsdUNBQUUsQ0FBQTtJQUFDLHVDQUFFLENBQUE7SUFBQyx1Q0FBRSxDQUFBO0lBQUMsdUNBQUUsQ0FBQTtJQUFDLHVDQUFFLENBQUE7SUFBQyx1Q0FBRSxDQUFBO0FBQUEsQ0FBQyxFQUF2QyxVQUFVLEtBQVYsVUFBVSxRQUE2QjtBQUU1QyxJQUFJLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQTtBQUM3QyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9DLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM3QyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0MsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENB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RSxDQUFDLEVBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZILEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVILEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RILEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMs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