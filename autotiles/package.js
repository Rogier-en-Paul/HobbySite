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
    document.addEventListener('mousemove', (e) => {
        mousepos.overwrite(getMousePos(localcanvas, e));
    });
    return mousepos;
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
    }
    setup(input) {
        this.input = input;
        this.output = create2DArray(this.input.dimensions, () => 0);
        this.gridrect = new Rect(new Vector(0, 0), this.input.dimensions.c().add(new Vector(-1, -1)));
    }
    processAll() {
        this.input.dimensions.loop2d(v => {
            this.processTile(v);
        });
    }
    processTile(v) {
        var neighbours = this.getNeighbours(v);
        var firsttile = this.tiles.find(r => r.cb(neighbours));
        if (firsttile) {
            write2D(this.output, v, firsttile.tileid);
        }
    }
    processAround(pos) {
        for (var [alias, direction] of dir2vecmap.entries()) {
            var abspos = pos.c().add(direction);
            if (this.gridrect.collidePoint(abspos)) {
                this.processTile(abspos);
            }
        }
    }
    getNeighbours(pos) {
        var res = new Map();
        for (var [key, value] of dir2vecmap) {
            res.set(key, 0); //guarantees the void neigbhours are set to 0
        }
        for (var [alias, direction] of dir2vecmap.entries()) {
            var abspos = pos.c().add(direction);
            if (this.gridrect.collidePoint(abspos)) {
                res.set(alias, this.input.get(abspos));
            }
        }
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
    return Array.from(checks.entries()).every(([key, value]) => neighbours.get(key) == value);
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
var colors = ['white', 'red', 'blue', 'purple', 'pink', 'orange', 'yellow', 'green', 'cyan', 'brown', 'coral', 'crimson', 'deeppink', 'violet', 'black', 'lawngreen', 'lightgreen'];
var screensize = new Vector(document.documentElement.clientWidth, document.documentElement.clientHeight);
var crret = createCanvas(screensize.x, screensize.y);
var canvas = crret.canvas;
var ctxt = crret.ctxt;
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
var mousepos = startMouseListen(canvas);
var imagenames = ['void', 'surrounded', 'cornertl', 'openwalltm', 'ml1neighbour', 'alone', '2neighboursopposite', 'error', 'filled', 'boxcorner', 'boxinnercorner', 'openwall'];
loadImages(imagenames.map(image => `res/${image}.png`)).then(images => {
    var autotiler = new AutoTiler();
    var spritestore = new Store();
    var voidsprite = spritestore.add(new Sprite(images[0], 0, ctxt));
    // var surroundSprite = spritestore.add(new Sprite(images[1],0,ctxt)) 
    // var cornersprites = Sprite.rotated(images[2],ctxt).map(s => spritestore.add(s))
    // var threeneighbours = Sprite.rotated(images[3],ctxt).map(s => spritestore.add(s))
    // var oneneighbour = Sprite.rotated(images[4],ctxt).map(s => spritestore.add(s))
    // var twoneigboursoppositevert = spritestore.add(new Sprite(images[6],0.25,ctxt))
    // var twoneigboursoppositehor = spritestore.add(new Sprite(images[6],0,ctxt))
    // var alone = spritestore.add(new Sprite(images[5],0,ctxt)) 
    var error = spritestore.add(new Sprite(images[7], 0, ctxt));
    var filled = spritestore.add(new Sprite(images[8], 0, ctxt));
    var boxcorner = Sprite.rotated(images[9], ctxt).map(s => spritestore.add(s));
    var boxinnercorner = Sprite.rotated(images[10], ctxt).map(s => spritestore.add(s));
    var openwall = Sprite.rotated(images[11], ctxt).map(s => spritestore.add(s));
    autotiler.setup(new List2D(new Vector(100, 50), 0));
    var savedinput = localStorage.getItem('input');
    if (savedinput != null) {
        var res = JSON.parse(savedinput);
        autotiler.input.arr = res.arr;
    }
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
    autotiler.tiles = [
        // normalRule(voidsprite.id,new Map([[Directions.mm,0]])),
        normalRule(filled.id, new Map([[Directions.mm, 0]])),
        ...rotated(boxinnercorner.map(s => s.id), new Map([[Directions.ml, 1], [Directions.tm, 1], [Directions.mr, 1], [Directions.bm, 1], [Directions.bl, 0], [Directions.tl, 1], [Directions.tr, 1], [Directions.br, 1], [Directions.mm, 1]])),
        normalRule(filled.id, new Map([[Directions.ml, 1], [Directions.tm, 1], [Directions.mr, 1], [Directions.bm, 1], [Directions.tl, 1], [Directions.tr, 1], [Directions.bl, 1], [Directions.br, 1], [Directions.mm, 1]])),
        ...rotated(boxcorner.map(s => s.id), new Map([[Directions.ml, 0], [Directions.tm, 0], [Directions.mr, 1], [Directions.bm, 1], [Directions.br, 1], [Directions.mm, 1]])),
        ...rotated(openwall.map(s => s.id), new Map([[Directions.ml, 1], [Directions.tl, 1], [Directions.tr, 1], [Directions.tm, 1], [Directions.mr, 1], [Directions.bm, 0], [Directions.mm, 1]])),
        normalRule(error.id, new Map([[Directions.mm, 1]])),
    ];
    autotiler.processAll();
    document.addEventListener('mousedown', e => {
        var pos = getGridMousePos();
        if (autotiler.input.get(pos) == 1) {
            paintmode = PaintMode.erase;
        }
        else {
            paintmode = PaintMode.fill;
        }
        autotiler.input.set(pos, 1 - autotiler.input.get(pos));
        autotiler.processAround(pos);
        localStorage.setItem('input', JSON.stringify(autotiler.input));
    });
    document.addEventListener('mousemove', e => {
        var pos = getGridMousePos();
        if (e.buttons == 1) {
            var old = autotiler.input.get(pos);
            if (paintmode == PaintMode.fill) {
                autotiler.input.set(pos, 1);
            }
            else {
                autotiler.input.set(pos, 0);
            }
            if (old != autotiler.input.get(pos)) {
                autotiler.processAround(pos);
                localStorage.setItem('input', JSON.stringify(autotiler.input));
            }
        }
    });
    loop((dt) => {
        ctxt.clearRect(0, 0, screensize.x, screensize.y);
        renderGrid(autotiler.output);
        ctxt.fillStyle = 'grey';
        drawgridcell(getGridMousePos());
    });
    function renderGrid(grid) {
        var size = get2DArraySize(grid);
        size.loop2d((v) => {
            var tileid = read2D(grid, v);
            // ctxt.fillStyle = colors[tileid]
            // drawgridcell(v)
            // ctxt.drawImage(loadedimages[tileid % loadedimages.length],v.x * tilesize.x,v.y * tilesize.y,tilesize.x,tilesize.y)
            var sprite = spritestore.get(tileid);
            drawImage(sprite.img, ctxt, v.c().mul(tilesize), tilesize, sprite.rotations);
        });
    }
});
function getGridMousePos() {
    return abs2grid(mousepos);
}
function drawgridcell(gridpos) {
    var pos = gridpos.c().mul(tilesize);
    ctxt.fillRect(pos.x, pos.y, tilesize.x, tilesize.y);
}
function abs2grid(abs) {
    return abs.c().div(tilesize).floor();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYnMvdmVjdG9yL3ZlY3Rvci50cyIsImxpYnMvdXRpbHMvcm5nLnRzIiwibGlicy91dGlscy9zdG9yZS50cyIsImxpYnMvdXRpbHMvdGFibGUudHMiLCJsaWJzL3V0aWxzL3V0aWxzLnRzIiwibGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJsaWJzL3V0aWxzL2FiaWxpdHkudHMiLCJsaWJzL3V0aWxzL2FuaW0udHMiLCJsaWJzL3JlY3QvcmVjdC50cyIsImxpYnMvZXZlbnQvZXZlbnRxdWV1ZS50cyIsImxpYnMvZXZlbnQvZXZlbnRzeXN0ZW0udHMiLCJhdXRvdGlsZS50cyIsInByb2plY3R1dGlscy50cyIsImxpc3QudHMiLCJzcHJpdGUudHMiLCJtYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sTUFBTTtJQUdSLFlBQVksR0FBRyxJQUFhO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsUUFBd0M7UUFDeEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO1lBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3hCO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzNELENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMxRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyxDQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFRCxNQUFNO1FBQ0YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsU0FBUztRQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDeEMsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFRO1FBQ1AsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRCxJQUFJLENBQUMsQ0FBUSxFQUFDLE1BQWE7UUFDdkIsT0FBTyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDakQsQ0FBQztJQUVELENBQUM7UUFDRyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQzlDLENBQUM7SUFFRCxTQUFTLENBQUMsQ0FBUTtRQUNkLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlDLE9BQU8sR0FBRyxDQUFBO0lBQ2QsQ0FBQztJQUVELElBQUksQ0FBQyxRQUFrQztRQUNuQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFcEIsT0FBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDO1lBQzlCLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNqQixJQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUM7Z0JBQ2xCLE1BQU07YUFDVDtTQUNKO0lBQ0wsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUFRO1FBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDN0IsU0FBUzthQUNUO2lCQUNJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN2QixPQUFPLENBQUMsQ0FBQzthQUNyQjtpQkFDSTtnQkFDSixPQUFPLENBQUMsQ0FBQzthQUNUO1NBQ0Q7UUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELElBQUksQ0FBQyxVQUFrQjtRQUNuQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7WUFDOUMsSUFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQztnQkFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNmLE9BQU8sS0FBSyxDQUFDO2FBQ2I7aUJBQUk7Z0JBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakI7U0FDRDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ1YsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUFRO1FBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzdDLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN2QixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVEsRUFBQyxHQUFVO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdkIsQ0FBQztJQUVELElBQUksQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN2QixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLENBQUMsQ0FBQyxHQUFHO1FBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7SUFDdEIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDLEdBQUc7UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtJQUN0QixDQUFDO0lBRUQsSUFBSSxDQUFDLENBQUMsR0FBRztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBNkI7UUFDOUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFBO1FBQ2QsSUFBSSxTQUFTLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQTtRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxFQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxFQUFDLEtBQUssRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUNwRSxDQUFDO0lBRUQsS0FBSyxDQUFDLENBQVE7UUFDVixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25DLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQyxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBYTtRQUMxQixJQUFJLENBQUMsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO1FBQ3BCLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2IsT0FBTyxDQUFDLENBQUE7SUFDWixDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQTZCO1FBQ2hDLElBQUksT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUM3QixLQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUM7WUFDL0MsS0FBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFDO2dCQUMvQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDcEI7U0FDSjtJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBNkI7UUFDaEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUMvQixLQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUM7WUFDL0MsS0FBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFDO2dCQUMvQyxLQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUM7b0JBQy9DLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtpQkFDcEI7YUFDSjtTQUNKO0lBQ0wsQ0FBQztDQUNKO0FBR0QseUNBQXlDO0FBQ3pDLFFBQVE7QUFDUix5Q0FBeUM7QUFDekMsNENBQTRDO0FBQzVDLDhCQUE4QjtBQUM5QixnQkFBZ0I7QUFFaEIsMENBQTBDO0FBQzFDLHFFQUFxRTtBQUNyRSxnQkFBZ0I7QUFFaEIsMENBQTBDO0FBQzFDLGdGQUFnRjtBQUNoRixnQkFBZ0I7QUFFaEIsYUFBYTtBQUViLGtDQUFrQztBQUNsQywyQkFBMkI7QUFDM0IsYUFBYTtBQUNiLFFBQVE7QUFDUixJQUFJO0FDbk5KLE1BQU0sR0FBRztJQUtMLFlBQW1CLElBQVc7UUFBWCxTQUFJLEdBQUosSUFBSSxDQUFPO1FBSnZCLFFBQUcsR0FBVSxVQUFVLENBQUE7UUFDdkIsZUFBVSxHQUFVLE9BQU8sQ0FBQTtRQUMzQixjQUFTLEdBQVUsVUFBVSxDQUFBO0lBSXBDLENBQUM7SUFFRCxJQUFJO1FBQ0EsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtRQUNyRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDcEIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBO0lBQ2pDLENBQUM7SUFHRCxLQUFLLENBQUMsR0FBVSxFQUFDLEdBQVU7UUFDdkIsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7SUFDMUMsQ0FBQztDQUNKO0FDdEJELE1BQU0sS0FBSztJQUFYO1FBRUksUUFBRyxHQUFHLElBQUksR0FBRyxFQUFZLENBQUE7UUFDekIsWUFBTyxHQUFHLENBQUMsQ0FBQTtJQXFCZixDQUFDO0lBbkJHLEdBQUcsQ0FBQyxFQUFTO1FBQ1QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBRUQsR0FBRyxDQUFDLElBQU07UUFDTCxJQUFZLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBRSxJQUFZLENBQUMsRUFBRSxFQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25DLE9BQU8sSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0lBQ3hDLENBQUM7SUFFRCxNQUFNLENBQUMsRUFBRTtRQUNMLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ25CLE9BQU8sR0FBRyxDQUFBO0lBQ2QsQ0FBQztDQUNKO0FFdkJELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ3JCLFNBQVMsR0FBRyxDQUFDLEdBQVUsRUFBQyxLQUFZLEVBQUMsS0FBWSxFQUFDLEdBQVUsRUFBQyxHQUFVO0lBQ25FLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsV0FBVyxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtBQUNyRCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsR0FBVSxFQUFDLENBQVEsRUFBQyxDQUFRO0lBQzdDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxHQUFXLEVBQUUsR0FBVyxFQUFFLEtBQWE7SUFDcEQsSUFBRyxHQUFHLEdBQUcsR0FBRyxFQUFDO1FBQ1QsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2YsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNWLEdBQUcsR0FBRyxJQUFJLENBQUM7S0FDZDtJQUNELE9BQU8sS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDO0FBQ3hDLENBQUM7QUFFRCxTQUFTLEdBQUcsQ0FBQyxDQUFTLEVBQUUsQ0FBUztJQUM3QixJQUFHLENBQUMsR0FBRyxDQUFDO1FBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEIsT0FBTyxDQUFDLENBQUM7QUFDYixDQUFDO0FBRUQsU0FBUyxHQUFHLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDN0IsSUFBRyxDQUFDLEdBQUcsQ0FBQztRQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xCLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFDLEdBQVcsRUFBRSxHQUFXLEVBQUUsR0FBVztJQUNoRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDNUMsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVU7SUFDaEUsT0FBTyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFJRCxTQUFTLGdCQUFnQixDQUFDLFdBQTZCO0lBQ25ELElBQUksUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtJQUM5QixRQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDeEMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbEQsQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLFFBQVEsQ0FBQTtBQUNuQixDQUFDO0FBR0QsU0FBUyxXQUFXLENBQUMsTUFBd0IsRUFBRSxHQUFjO0lBQ3pELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQzFDLE9BQU8sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3RFLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxDQUFTLEVBQUUsQ0FBUztJQUN0QyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzdDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2pDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbEMsT0FBTyxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxDQUFDO0FBQ3JDLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxHQUFXLEVBQUUsR0FBVztJQUNwQyxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7QUFDNUMsQ0FBQztBQUdELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM1QixTQUFTLElBQUksQ0FBQyxRQUFRO0lBQ2xCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUNwQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUE7SUFDbkMsVUFBVSxHQUFHLEdBQUcsQ0FBQTtJQUNoQixxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7UUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ2xCLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQztBQUVELFNBQVMsR0FBRyxDQUFDLE1BQWMsRUFBRSxPQUFlO0lBQ3hDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBQyxPQUFPLENBQUMsR0FBQyxPQUFPLENBQUMsR0FBQyxPQUFPLENBQUM7QUFDOUMsQ0FBQztBQUVELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUViLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUN2QyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTtBQUN0QixDQUFDLENBQUMsQ0FBQTtBQUVGLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUNyQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQTtBQUN2QixDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsWUFBWTtJQUNqQixJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7SUFDekIsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFBLENBQUEsTUFBTTtJQUMxQixJQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUEsQ0FBQSxJQUFJO0lBQ3hCLElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQSxDQUFBLE9BQU87SUFDM0IsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFBLENBQUEsTUFBTTtJQUMxQixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFFRCxTQUFTLG9CQUFvQjtJQUN6QixJQUFJLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQTtJQUMxQixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ2IsT0FBTyxLQUFLLENBQUE7QUFDaEIsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLE9BQWdCO0lBQ25DLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQTtJQUNqQixLQUFJLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBQztRQUN0QixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO2FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ3pCO0lBQ0QsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxJQUFhO0lBQzdCLElBQUksUUFBUSxHQUErQixFQUFFLENBQUE7SUFFN0MsS0FBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUM7UUFDaEIsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRTtZQUNsQyxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFBO1lBQ3ZCLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2QsQ0FBQyxDQUFBO1lBQ0QsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNOO0lBRUQsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBSSxJQUFRLEVBQUUsU0FBeUI7SUFDekQsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNqQixPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ2I7SUFDRCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDbEIsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xDLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QixJQUFJLEtBQUssR0FBRyxTQUFTLEVBQUU7WUFDbkIsU0FBUyxHQUFHLEtBQUssQ0FBQTtZQUNqQixTQUFTLEdBQUcsQ0FBQyxDQUFBO1NBQ2hCO0tBQ0o7SUFDRCxPQUFPLFNBQVMsQ0FBQTtBQUNwQixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsTUFBTTtJQUN2QixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3ZDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQWdCLENBQUM7QUFDMUMsQ0FBQztBQUdELFNBQVMsSUFBSSxDQUFDLENBQVEsRUFBQyxDQUFRLEVBQUMsQ0FBUTtJQUNwQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUMxQixDQUFDO0FBRUQsU0FBUyxFQUFFLENBQUMsQ0FBUSxFQUFDLENBQVE7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLElBQUksQ0FBSSxHQUFPLEVBQUMsSUFBVyxDQUFDLEVBQUMsSUFBVyxDQUFDO0lBQzlDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbEIsQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFJLEdBQU87SUFDckIsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDakIsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFJLEdBQU87SUFDcEIsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUM5QixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUksSUFBVyxFQUFDLE1BQXdCO0lBQzFELElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM5QixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBQztRQUMxQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2hDO0lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNaLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNoQyxDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sTUFBTSxDQUFBO0FBQ2pCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxHQUFXO0lBQy9CLE9BQU8sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDL0MsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFJLEdBQVMsRUFBQyxDQUFRO0lBQ2xDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDeEIsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFJLEdBQVM7SUFDN0IsT0FBTyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ3JFLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxNQUFNLEVBQUMsUUFBUTtJQUMxQixJQUFJLEdBQUcsR0FBRyxTQUFBLEVBQUUsRUFBSSxRQUFRLENBQUEsQ0FBQTtJQUN4QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtBQUMxQyxDQUFDO0FDNU1ELE1BQU0sU0FBUztJQUFmO1FBRUksbUJBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDM0IsbUJBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDM0IsY0FBUyxHQUFHLENBQUMsQ0FBQTtRQUNiLFdBQU0sR0FBRyxJQUFJLENBQUE7SUFzQ2pCLENBQUM7SUFwQ0csR0FBRztRQUNDLElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQztZQUNYLG1CQUFtQixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1NBQzNEO1FBQ0QsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUMsQ0FBQTtJQUN2RixDQUFDO0lBSUQsS0FBSztRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO1FBQ25CLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFDO1lBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7WUFDbkIsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtTQUN4RDtJQUNMLENBQUM7SUFFRCxLQUFLO1FBQ0QsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBQztZQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtZQUNsQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtTQUNuQztJQUNMLENBQUM7SUFFRCxLQUFLO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7UUFDbEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUE7SUFDdEIsQ0FBQztDQUNKO0FDMUNELE1BQU0sSUFBSTtJQUVOLFlBQW1CLE9BQWMsRUFBUSxFQUFnQjtRQUF0QyxZQUFPLEdBQVAsT0FBTyxDQUFPO1FBQVEsT0FBRSxHQUFGLEVBQUUsQ0FBYztJQUV6RCxDQUFDO0NBQ0o7QUFFRCxNQUFNLE9BQU87SUEwQlQsWUFBbUIsRUFBYTtRQUFiLE9BQUUsR0FBRixFQUFFLENBQVc7UUF6QmhDLGtCQUFrQjtRQUNsQixxQkFBcUI7UUFDckIsaUNBQWlDO1FBQ2pDLHlCQUF5QjtRQUN6QixnQ0FBZ0M7UUFFaEMsYUFBUSxHQUFVLElBQUksQ0FBQTtRQUN0QixhQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3JCLFVBQUssR0FBVTtZQUNYLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQU8vRSxDQUFBO1FBQ0QsY0FBUyxHQUFhLElBQUksU0FBUyxFQUFFLENBQUE7UUFDckMsZ0JBQVcsR0FBVSxDQUFDLENBQUE7UUFDdEIsbUJBQWMsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFBO1FBQ2xDLFVBQUssR0FBVyxDQUFDLENBQUE7UUFDakIsV0FBTSxHQUFZLEtBQUssQ0FBQTtJQU12QixDQUFDO0lBRUQsK0RBQStEO0lBQy9ELDhCQUE4QjtRQUMxQixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVELFdBQVc7UUFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDeEMsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDYixDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUM7WUFDcEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1NBQ25CO2FBQUk7WUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7U0FDbEI7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxPQUFPO1FBQ0gsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUN0QixDQUFDO0lBRU8sU0FBUztRQUNiLElBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBQztZQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtZQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQTtZQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQ3RCLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQTtZQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQTtZQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQzFCLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQTtTQUNaO0lBQ0wsQ0FBQztJQUVPLFFBQVE7UUFDWixJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDeEQsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDOUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDMUIsSUFBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBQztZQUNkLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQTtTQUNaO0lBQ0wsQ0FBQztDQUNKO0FDMUZELElBQUssUUFBcUM7QUFBMUMsV0FBSyxRQUFRO0lBQUMsdUNBQUksQ0FBQTtJQUFDLDJDQUFNLENBQUE7SUFBQywrQ0FBUSxDQUFBO0lBQUMsMkNBQU0sQ0FBQTtBQUFBLENBQUMsRUFBckMsUUFBUSxLQUFSLFFBQVEsUUFBNkI7QUFFMUMsTUFBTSxJQUFJO0lBUU47UUFQQSxhQUFRLEdBQVksUUFBUSxDQUFDLElBQUksQ0FBQTtRQUNqQyxZQUFPLEdBQVcsS0FBSyxDQUFBO1FBQ3ZCLGFBQVEsR0FBVSxJQUFJLENBQUE7UUFDdEIsY0FBUyxHQUFhLElBQUksU0FBUyxFQUFFLENBQUE7UUFDckMsVUFBSyxHQUFVLENBQUMsQ0FBQTtRQUNoQixRQUFHLEdBQVUsQ0FBQyxDQUFBO0lBSWQsQ0FBQztJQUVELEdBQUc7UUFDQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7UUFFakQsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ25CLEtBQUssUUFBUSxDQUFDLElBQUk7Z0JBQ2QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN0RSxLQUFLLFFBQVEsQ0FBQyxNQUFNO2dCQUNoQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xELEtBQUssUUFBUSxDQUFDLFFBQVE7Z0JBRWxCLElBQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQ2xDLElBQUcsYUFBYSxJQUFJLENBQUMsRUFBQztvQkFDbEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsR0FBRyxFQUFDLGFBQWEsQ0FBQyxDQUFBO2lCQUNqRDtxQkFBSTtvQkFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFBO2lCQUNyRDtZQUVMLEtBQUssUUFBUSxDQUFDLE1BQU07Z0JBQ2hCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDMUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUN6RjtJQUNMLENBQUM7Q0FDSjtBQ25DRCxNQUFNLElBQUk7SUFFTixZQUFtQixHQUFVLEVBQVMsR0FBVTtRQUE3QixRQUFHLEdBQUgsR0FBRyxDQUFPO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBTztJQUNoRCxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQVk7UUFFckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDaEUsT0FBTyxLQUFLLENBQUM7YUFDYjtTQUNEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDVixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2hDLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBVTtRQUNqQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDO1lBQy9CLElBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO2dCQUN0RSxPQUFPLEtBQUssQ0FBQzthQUNiO1NBQ0Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNWLENBQUM7SUFHRCxRQUFRLENBQUMsV0FBa0I7UUFDdkIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7SUFDekQsQ0FBQztJQUVELElBQUksQ0FBQyxJQUE2QjtRQUMvQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBRUQsSUFBSSxDQUFDLEdBQVU7UUFDWCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDdEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDZCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3JDLENBQUM7SUFFRCxJQUFJLENBQUMsUUFBeUI7UUFDMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUd2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2xCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztDQUNKO0FBRUQsU0FBUyxZQUFZLENBQUMsT0FBYyxFQUFDLE9BQWMsRUFBQyxPQUFjLEVBQUMsT0FBYztJQUM3RSxPQUFPLE9BQU8sSUFBSSxPQUFPLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQTtBQUNuRCxDQUFDO0FDMURELE1BQU0sVUFBVTtJQU1aO1FBTEEsY0FBUyxHQUFHLENBQUMsQ0FBQTtRQUdiLHNCQUFpQixHQUFHLElBQUksV0FBVyxFQUFPLENBQUE7UUFHdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUE7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7SUFDcEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFXLEVBQUMsRUFBcUI7UUFDcEMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2hCLEVBQUUsRUFBQyxFQUFFO1lBQ0wsSUFBSSxFQUFFLElBQUk7WUFDVixFQUFFO1NBQ0wsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxFQUFFLENBQUE7SUFDYixDQUFDO0lBRUQsVUFBVSxDQUFDLElBQVcsRUFBQyxFQUFxQjtRQUN4QyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDakIsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ1osQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLEVBQUUsQ0FBQTtJQUNiLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBUztRQUNkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUNyRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELE9BQU87UUFDSCxPQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQztZQUN6QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQ2pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbEUsS0FBSSxJQUFJLFFBQVEsSUFBSSxTQUFTLEVBQUM7Z0JBQzFCLFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQzVCO1NBQ0o7UUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3JDLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBVyxFQUFDLElBQVE7UUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDYixJQUFJLEVBQUUsSUFBSTtZQUNWLElBQUksRUFBQyxJQUFJO1NBQ1osQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFXLEVBQUMsSUFBUTtRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsQ0FBQTtRQUNuQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDbEIsQ0FBQztDQUNKO0FDekRELE1BQU0sV0FBVztJQUFqQjtRQUNJLGNBQVMsR0FBRyxDQUFDLENBQUE7SUFzQmpCLENBQUM7SUFuQkcsTUFBTSxDQUFDLEVBQWtCO1FBQ3JCLElBQUksUUFBUSxHQUFHO1lBQ1gsRUFBRSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsRUFBRSxFQUFDLEVBQUU7U0FDUixDQUFBO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDN0IsT0FBTyxRQUFRLENBQUMsRUFBRSxDQUFBO0lBQ3RCLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBRTtRQUNQLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUNyRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFLO1FBQ1QsS0FBSyxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDbkI7SUFDTCxDQUFDO0NBQ0o7QUN2QkQsSUFBSyxVQUF1QztBQUE1QyxXQUFLLFVBQVU7SUFBRSx1Q0FBRSxDQUFBO0lBQUMsdUNBQUUsQ0FBQTtJQUFDLHVDQUFFLENBQUE7SUFBQyx1Q0FBRSxDQUFBO0lBQUMsdUNBQUUsQ0FBQTtJQUFDLHVDQUFFLENBQUE7SUFBQyx1Q0FBRSxDQUFBO0lBQUMsdUNBQUUsQ0FBQTtJQUFDLHVDQUFFLENBQUE7QUFBQSxDQUFDLEVBQXZDLFVBQVUsS0FBVixVQUFVLFFBQTZCO0FBRTVDLElBQUksVUFBVSxHQUFHLElBQUksR0FBRyxFQUFxQixDQUFBO0FBQzdDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDL0MsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzdDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM3QyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0MsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRTdDLElBQUksVUFBVSxHQUFHLElBQUksR0FBRyxFQUFxQixDQUFBO0FBRTdDLEtBQUksSUFBSSxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsSUFBSSxVQUFVLEVBQUM7SUFDNUIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUE7Q0FD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QUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2TixVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVKLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdLLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNyRCxDQUFBO0lBRUQsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBRXRCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDdkMsSUFBSSxHQUFHLEdBQUcsZUFBZSxFQUFFLENBQUE7UUFDM0IsSUFBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUM7WUFDN0IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUE7U0FDOUI7YUFBSTtZQUNELFNBQVMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFBO1NBQzdCO1FBQ0QsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3JELFNBQVMsQ0FBQyxhQUFhLENB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