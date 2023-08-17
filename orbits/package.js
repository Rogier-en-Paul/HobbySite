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
    angle2d(b) {
        return Math.acos(this.dot(b) / (this.length() + b.length()));
    }
    rotate2d(turns) {
        var radians = turns * Math.PI * 2;
        var cost = Math.cos(radians);
        var sint = Math.sin(radians);
        var x = this.x * cost - this.y * sint;
        var y = this.x * sint + this.y * cost;
        this.x = x;
        this.y = y;
        return this;
    }
    rotate3d(axis, radians) {
        var cost = Math.cos(radians);
        var sint = Math.sin(radians);
        var res = this.c().scale(cost);
        res.add(axis.cross(this).scale(sint));
        res.add(axis.c().scale(axis.dot(this) * (1 - cost)));
        this.overwrite(res);
        return this;
    }
    anglediff3d(v) {
        return Math.acos(this.dot(v) / (this.length() * v.length()));
    }
    projectOnto(v) {
        // https://www.youtube.com/watch?v=fjOdtSu4Lm4&list=PLImQaTpSAdsArRFFj8bIfqMk2X7Vlf3XF&index=1
        var vnormal = v.c().normalize();
        return vnormal.scale(this.dot(vnormal));
    }
    static reflect(normalout, vecin) {
        var vecout = vecin.c().scale(-1);
        var center = vecout.projectOnto(normalout);
        var vec2center = vecout.to(center);
        var refl = vecout.add(vec2center.scale(2));
        return refl;
    }
    wedge(v) {
        // https://www.youtube.com/watch?v=tjTRXzwdU6A&list=PLImQaTpSAdsArRFFj8bIfqMk2X7Vlf3XF&index=7
        return this.x * v.y - this.y * v.x;
    }
    //wedge can be used for collission detection
    //https://www.youtube.com/watch?v=tjTRXzwdU6A&list=PLImQaTpSAdsArRFFj8bIfqMk2X7Vlf3XF&index=8
    //1:18:06
    area(v) {
        return this.wedge(v) / 2;
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
        return lerp(min, max, this.norm());
    }
    rangeFloor(min, max) {
        return Math.floor(this.range(min, max));
    }
    choose(arr) {
        return arr[this.rangeFloor(0, arr.length)];
    }
    shuffle(arr) {
        for (var end = arr.length; end > 0; end--) {
            swap(arr, this.rangeFloor(0, end), end);
        }
        return arr;
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
    var mul = 10 ** decimals;
    return Math.round(number * mul) / mul;
}
var rng = new RNG(0);
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(rng.norm() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function remove(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
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
        this.onRuleBroken = new EventSystem();
        this.rules = [];
        this.discoveryidcounter = 0;
        this.listeners = [];
        this.events = [];
    }
    // listenDiscovery(type:string,megacb:(data:any,cb:(cbdata:any) => void) => void){
    //     this.listen(type,(dataAndCb:{data:any,cb:(ads:any) => void}) => {
    //         megacb(dataAndCb.data,dataAndCb.cb)
    //     })
    // }
    // startDiscovery(type:string,data: any, cb: (cbdata: any) => void) {
    //     this.addAndTrigger(type,{data,cb})
    // }
    listenDiscovery(type, cb) {
        this.listen(type, (discovery) => {
            cb(discovery.data, discovery.id);
        });
    }
    startDiscovery(type, data, cb) {
        let createdid = this.discoveryidcounter++;
        let listenerid = this.listen('completediscovery', (discovery) => {
            if (discovery.data.id == createdid) {
                this.unlisten(listenerid);
                cb(discovery.data.data);
            }
        });
        this.addAndTrigger(type, { data, id: createdid });
    }
    completeDiscovery(data, id) {
        this.addAndTrigger('completediscovery', { data, id });
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
            let currentEvent = this.events.shift();
            let listeners = this.listeners.filter(l => l.type == currentEvent.type);
            let brokenrules = this.rules.filter(r => r.type == currentEvent.type && r.rulecb(currentEvent.data) == false);
            if (brokenrules.length == 0) {
                for (let listener of listeners) {
                    listener.cb(currentEvent.data);
                }
            }
            else {
                console.log(first(brokenrules).error);
                this.onRuleBroken.trigger({ event: currentEvent, error: first(brokenrules).error });
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
    addRule(type, error, rulecb) {
        this.rules.push({ type, error, rulecb });
    }
}
class EventSystem {
    constructor() {
        this.idcounter = 0;
        this.listeners = [];
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
class Camera {
    constructor(ctxt) {
        this.ctxt = ctxt;
        this.pos = new Vector(0, 0);
        this.scale = new Vector(1, 1);
    }
    begin() {
        ctxt.save();
        var m = this.createMatrixScreen2World().inverse();
        ctxt.transform(1, 0, 0, -1, 0, canvas.height);
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
// https://github.com/robashton/camera/blob/master/camera.js
class Camera2 {
    constructor(context, settings = {}) {
        this.distance = settings.distance || 1000.0;
        this.lookAt = settings.initialPosition || [0, 0];
        this.context = context;
        this.fieldOfView = settings.fieldOfView || Math.PI / 4.0;
        this.viewport = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0,
            scale: [settings.scaleX || 1.0, settings.scaleY || 1.0]
        };
        this.init();
    }
    /**
     * Camera Initialization
     * -Add listeners.
     * -Initial calculations.
     */
    init() {
        this.addListeners();
        this.updateViewport();
    }
    /**
     * Applies to canvas context the parameters:
     *  -Scale
     *  -Translation
     */
    begin() {
        this.context.save();
        this.applyScale();
        this.applyTranslation();
    }
    /**
     * 2d Context restore() method
     */
    end() {
        this.context.restore();
    }
    /**
     * 2d Context scale(Camera.viewport.scale[0], Camera.viewport.scale[0]) method
     */
    applyScale() {
        this.context.scale(this.viewport.scale[0], this.viewport.scale[1]);
    }
    /**
     * 2d Context translate(-Camera.viewport.left, -Camera.viewport.top) method
     */
    applyTranslation() {
        this.context.translate(-this.viewport.left, -this.viewport.top);
    }
    /**
     * Camera.viewport data update
     */
    updateViewport() {
        this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
        this.viewport.width = this.distance * Math.tan(this.fieldOfView);
        this.viewport.height = this.viewport.width / this.aspectRatio;
        this.viewport.left = this.lookAt[0] - (this.viewport.width / 2.0);
        this.viewport.top = this.lookAt[1] - (this.viewport.height / 2.0);
        this.viewport.right = this.viewport.left + this.viewport.width;
        this.viewport.bottom = this.viewport.top + this.viewport.height;
        this.viewport.scale[0] = this.context.canvas.width / this.viewport.width;
        this.viewport.scale[1] = this.context.canvas.height / this.viewport.height;
    }
    /**
     * Zooms to certain z distance
     * @param {*z distance} z
     */
    zoomTo(z) {
        this.distance = z;
        this.updateViewport();
    }
    /**
     * Moves the centre of the viewport to new x, y coords (updates Camera.lookAt)
     * @param {x axis coord} x
     * @param {y axis coord} y
     */
    moveTo(pos) {
        this.lookAt[0] = pos.x;
        this.lookAt[1] = pos.y;
        this.updateViewport();
    }
    /**
     * Transform a coordinate pair from screen coordinates (relative to the canvas) into world coordinates (useful for intersection between mouse and entities)
     * Optional: obj can supply an object to be populated with the x/y (for object-reuse in garbage collection efficient code)
     * @param {x axis coord} x
     * @param {y axis coord} y
     * @param {obj can supply an object to be populated with the x/y} obj
     * @returns
     */
    screenToWorld(x, y, obj) {
        obj = obj || {};
        obj.x = (x / this.viewport.scale[0]) + this.viewport.left;
        obj.y = (y / this.viewport.scale[1]) + this.viewport.top;
        return obj;
    }
    /**
     * Transform a coordinate pair from world coordinates into screen coordinates (relative to the canvas) - useful for placing DOM elements over the scene.
     * Optional: obj can supply an object to be populated with the x/y (for object-reuse in garbage collection efficient code).
     * @param {x axis coord} x
     * @param {y axis coord} y
     * @param {obj can supply an object to be populated with the x/y} obj
     * @returns
     */
    worldToScreen(pos) {
        var obj = new Vector(0, 0);
        obj.x = (pos.x - this.viewport.left) * (this.viewport.scale[0]);
        obj.y = (pos.y - this.viewport.top) * (this.viewport.scale[1]);
        return obj;
    }
    /**
     * Event Listeners for:
     *  -Zoom and scroll around world
     *  -Center camera on "R" key
     */
    addListeners() {
        window.onwheel = e => {
            if (true) {
                // Your zoom/scale factor
                let zoomLevel = this.distance - (e.deltaY * 20);
                if (zoomLevel <= 1) {
                    zoomLevel = 1;
                }
                this.zoomTo(zoomLevel);
            }
            else {
                // Your track-pad X and Y positions
                const x = this.lookAt[0] + (e.deltaX * 2);
                const y = this.lookAt[1] + (e.deltaY * 2);
                // this.moveTo(x, y);
            }
        };
        window.addEventListener('keydown', e => {
            if (e.key === 'r') {
                this.zoomTo(1000);
                // this.moveTo(0, 0);
            }
        });
    }
}
;
class Entity {
    constructor(init) {
        this.id = null;
        this.parent = null;
        this.type = '';
        this.name = '';
        this.children = [];
        // ordercount = 0
        // sortorder = 0
        this.synced = false;
        Object.assign(this, init);
        this.type = 'entity';
    }
    setChild(child) {
        //remove child from old parent
        var oldparent = Entity.globalEntityStore.get(child.parent);
        if (oldparent != null) {
            remove(oldparent.children, child.id);
        }
        this.children.push(child.id);
        child.parent = this.id;
        // child.sortorder = this.ordercount++
    }
    setParent(parent) {
        if (parent == null) {
            this.parent = null;
        }
        else {
            parent.setChild(this);
        }
    }
    getParent() {
        return Entity.globalEntityStore.get(this.parent);
    }
    descendant(cb) {
        return this.descendants(cb)[0];
    }
    descendants(cb) {
        var children = this._children(cb);
        var grandchildren = children.flatMap(c => c.descendants(cb));
        return children.concat(grandchildren);
    }
    child(cb) {
        return this._children(cb)[0];
    }
    _children(cb) {
        return this.children.map(id => Entity.globalEntityStore.get(id)).filter(cb);
    }
    allChildren() {
        return this._children(() => true);
    }
    remove() {
        remove(this.getParent().children, this.id);
        Entity.globalEntityStore.remove(this.id);
        this.removeChildren();
        return this;
    }
    inject(parent) {
        Entity.globalEntityStore.add(this);
        this.setParent(parent);
        return this;
    }
    removeChildren() {
        this.descendants(() => true).forEach(e => Entity.globalEntityStore.remove(e.id));
        this.children = [];
    }
    ancestor(cb) {
        var current = this;
        while (current != null && cb(current) == false) {
            current = Entity.globalEntityStore.get(current.parent);
        }
        return current;
    }
}
class Player extends Entity {
    constructor(init) {
        super();
        this.disconnected = false;
        this.dctimestamp = 0;
        Object.assign(this, init);
        this.type = 'player';
    }
}
/*
class ServerClient{
    
    output = new EventSystem<any>()
    sessionid: number = null

    constructor(public socket, public id){


        this.socket.on('message',(data) => {
            this.output.trigger(data)
        })
    }

    input(type,data){
        this.socket.emit('message',{type,data})
    }
}

class Server{
    // gamemanager: GameManager;
    output = new EventSystem<{type:string,data:any}>()
    clients = new Store<ServerClient>()
    sessionidcounter = 0

    onBroadcast = new EventSystem<{type:string,data:any}>()

    constructor(){
        this.gamemanager = new GameManager()
        Entity.globalEntityStore = this.gamemanager.entityStore;

        this.gamemanager.setupListeners()
        this.gamemanager.eventQueue.addAndTrigger('init',null)

        this.gamemanager.eventQueue.onProcessFinished.listen(() => {
            this.updateClients()
            set synced status of updated entities to true
        })

        this.gamemanager.broadcastEvent.listen((event) => {
            for(var client of this.clients.list()){
                client.input(event.type,event.data)
            }
        })

        this.gamemanager.sendEvent.listen((event) => {
            this.clients.list().filter(c => c.sessionid == event.sessionid).forEach(c => c.input(event.type,event.data))
        })

        setInterval(() => {
            var longdcedplayers = this.gamemanager.helper.getPlayers().filter(p => p.disconnected == true && (Date.now() - p.dctimestamp) > 5_000 )
            longdcedplayers.forEach(p => {
                console.log(`removed disconnected player:${p.name}`)
                p.remove()
            })
            if(longdcedplayers.length > 0){
                this.updateClients()
            }
        },5000)
    }

    updateClients(){
        this.gamemanager.broadcastEvent.trigger({type:'update',data:this.gamemanager.entityStore.list()})
    }

    connect(client:ServerClient){
        this.clients.add(client)
        let players = this.gamemanager.helper.getPlayers()

        //client does a handshake
        //if client sends sessionID look for a player with that sessionid
        //if not found or client sends no sessionid create a new player with a new sessionid
        //finish handshake by sending client and sessionid
        //when a client disconnects flag player as dc'ed and set dc timestamp after 2 min delete dc'ed players

        //client should connect, check for sessionid in localstore/sessionstorage
        //then initiate handshake send found sessionid
        //save session and client id on client and look in database for player with sessionid = client.sessionid
        client.socket.on('handshake',(data,fn) => {
            
            let sessionid = data.sessionid
            if(sessionid == null){
               sessionid = this.sessionidcounter++
            }
            this.sessionidcounter = Math.max(sessionid,this.sessionidcounter)//should create random guid instead
            client.sessionid = sessionid
            console.log(`user connected:${client.sessionid}`)

            let foundplayer = players.find(p => p.sessionid == sessionid)
            if(foundplayer == null){
                let player = new Player({clientid:client.id,sessionid:sessionid})
                player.inject(this.gamemanager.helper.getPlayersNode())
                
            }else{
                foundplayer.clientid = client.id
                foundplayer.disconnected = false
                //reconnection dont create new player but do change the pointer to the new client
            }

            fn({
                clientid:client.id,
                sessionid:sessionid,
            })
            this.updateClients()
        })

        
        

        client.socket.on('disconnect',() => {
            //watch out for multiple connected clients
            this.clients.remove(client.id)
            var sessionplayer = this.gamemanager.helper.getSessionPlayer(client.sessionid)
            console.log(`user disconnected:${client.sessionid}`)
            //this often goes wrong for some reason
            //maybe when multiple clients are connected the old player's clientid gets overwritten
            //also goes wrong when a second tab connects and disconnects
            // check if other clients use the same sessionid
            
            var connectedclients = this.clients.list().filter(c => c.sessionid == client.sessionid)
            if(connectedclients.length == 0){
                sessionplayer.disconnected = true
                sessionplayer.dctimestamp = Date.now()
            }
            
            this.updateClients()
        })

        client.output.listen(e => {
            server.input(e.type,{clientid:client.id,sessionid:client.sessionid,data:e.data})
        })
    }

    input(type,data){
        this.gamemanager.eventQueue.addAndTrigger(type,data)
    }

    serialize(){
        //only serialize unsynced entitys
        return JSON.stringify(this.gamemanager.entityStore.list())
    }

    
}

*/ 
var contextStack = [[document.body]];
function currentContext() {
    return last(contextStack);
}
function startContext(element) {
    contextStack.push([element]);
}
function endContext() {
    contextStack.pop();
}
function scr(tag, attributes = {}) {
    flush();
    return cr(tag, attributes);
}
function cr(tag, attributes = {}) {
    var parent = peek();
    var element = document.createElement(tag);
    if (parent) {
        parent.appendChild(element);
    }
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    currentContext().push(element);
    return element;
}
function crend(tag, textstring, attributes = {}) {
    cr(tag, attributes);
    text(textstring);
    return end();
}
function text(data) {
    peek().textContent = data;
    return peek();
}
function html(html) {
    peek().innerHTML = html;
}
function end(endelement = null) {
    var poppedelement = currentContext().pop();
    if (endelement != null && endelement != poppedelement) {
        console.warn(poppedelement, ' doesnt equal ', endelement);
    }
    return poppedelement;
}
HTMLElement.prototype.on = function (event, cb) {
    this.addEventListener(event, cb);
    return this;
};
function peek() {
    var context = currentContext();
    return last(context);
}
function flush() {
    var context = currentContext();
    var root = context[0];
    context.length = 0;
    return root;
}
function div(options = {}) {
    return cr('div', options);
}
function a(options = {}) {
    return cr('a', options);
}
function button(text, options = {}) {
    return crend('button', text, options);
}
function input(options = {}) {
    return crend('input', options);
}
function img(options = {}) {
    return crend('img', options);
}
function stringToHTML(str) {
    var temp = document.createElement('template');
    temp.innerHTML = str;
    return temp.content.firstChild;
}
function upsertChild(parent, child) {
    if (parent.firstChild) {
        parent.replaceChild(child, parent.firstChild);
    }
    else {
        parent.appendChild(child);
    }
}
function qs(element, query) {
    if (typeof element == 'string') {
        return document.body.querySelector(element);
    }
    return element.querySelector(query);
}
function qsa(element, query) {
    return Array.from(element.querySelectorAll(query));
}
class BodyA {
    constructor(data) {
        Object.assign(this, data);
    }
}
class Orbit {
    calcEccentricity() {
        // e= c/a
        //distance between focal points / length of major axis
    }
    fromVelAndPos(pos, vel) {
        //kepllers laws
        //area swept is same at every part of orbit, S1 = S2
        //period is related to size of major axis p^2/m^3 = constant
        var theta = Math.atan2(pos.x, pos.y); //radians
        var r = pos.length();
        var V = vel.length();
        var semiMAxis = r / (2 - r * V * V);
    }
    getOrbitalPeriod() {
    }
}
class Engine {
    constructor(data) {
        Object.assign(this, data);
    }
    thrust() {
    }
}
class FuelType {
    constructor(data) {
        Object.assign(this, data);
    }
}
class FuelContainer {
    constructor(data) {
        Object.assign(this, data);
    }
    getMass() {
        return this.mass + this.currentfuel * this.fueltype.density;
    }
}
class Part {
}
class OrbitalParameters {
    constructor(data) {
        Object.assign(this, data);
    }
}
class Rocket {
    constructor(data) {
        Object.assign(this, data);
    }
    getWetMass() {
        return this.engine.mass + this.fuelContainer.getMass();
    }
    getDryMass() {
        return this.engine.mass + this.fuelContainer.mass;
    }
}
class Planet {
    constructor(data) {
        Object.assign(this, data);
    }
}
//todo
//fix calcback error, anglediff calc
//calculate angle -> time and time -> angle
//look into this
//https://www.youtube.com/watch?v=Pq95tkKZrlU
//https://www.youtube.com/watch?v=jYtA01qIH6E
function posAndVel2OrbitParams(pos, vel, mu) {
    var up = new Vector(0, 0, 1);
    var right = new Vector(1, 0, 0);
    var posmag = pos.length();
    var velmag = vel.length();
    var specificenergy = (velmag * velmag) / 2 - mu / posmag;
    var a = -(mu / (2 * specificenergy));
    var angularMomentumH = pos.cross(vel);
    var hmag = angularMomentumH.length();
    var evec = vel.cross(angularMomentumH).scale(1 / mu).sub(pos.c().scale(1 / posmag));
    var e = evec.length();
    var inclination = Math.acos(up.dot(angularMomentumH) / hmag);
    if (inclination == 0) {
        //flat plane should do somehting special with raan and argofperigee
    }
    var ascendingnode = up.cross(angularMomentumH); //should point to the ascendingnode
    var ran = anglediff2d(right, ascendingnode);
    var argofperigee = anglediff2d(evec, ascendingnode);
    var trueanamoly = anglediff2d(evec, pos);
    var rp = a * (1 - e);
    var ra = a * (1 + e);
    var orbperiod = TAU * Math.pow(a * a * a / mu, 0.5);
    var time = trueanomaly2time(trueanamoly, e, orbperiod);
    return new OrbitalParameters({
        semimajor: a,
        eccentricity: e,
        inclination: inclination,
        raan: ran,
        argofperigee: argofperigee,
        trueanomaly: trueanamoly,
        orbitalperiod: orbperiod,
        time: time,
        apoaps: ra,
        periaps: rp,
        ascendingnode,
        evec,
    });
}
// https://www.google.com/search?q=calculate+orbital+elements+from+position+and+velocity&oq=calculate+orbital+elements+from+position+and+velocity&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRhAMgoIAhAAGIYDGIoFMgoIAxAAGIYDGIoFMgoIBBAAGIYDGIoF0gEJMjU1OTdqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8
function orbitParams2PosVel2(orbparams) {
    var a = orbitParams2PosVel(orbparams.semimajor, orbparams.eccentricity, orbparams.inclination, orbparams.raan, orbparams.argofperigee, orbparams.trueanomaly);
    var b = orbitParams2PosVel(orbparams.semimajor, orbparams.eccentricity, orbparams.inclination, orbparams.raan, orbparams.argofperigee, orbparams.trueanomaly + 0.01);
    var vel = a.pos.to(b.pos).normalize().scale(a.vel);
    var trueanomaly = time2trueanomaly(orbparams.time, orbparams.semimajor, orbparams.eccentricity);
    return {
        pos: a.pos,
        vel: vel,
        trueanomaly: trueanomaly,
    };
}
function orbitParams2PosVel(a, e, i, raan, argofperigee, trueanomaly) {
    // https://www.youtube.com/watch?v=BHSEQggIxmo&list=PLB3Ia8aQsDKgAa9pyjeSDic49oi591zqC&index=21
    // https://www.youtube.com/watch?v=ZiLxfVevkI8&t=225s
    // https://www.youtube.com/watch?v=vpTTYy8wEHQ
    //steps
    //1 find raan angle using raan
    //2 find plane using inclination
    //3 find periaps angle using little omega
    //4 find periaps and apoaps location using a and e
    //5 find satellite location using trueanomaly
    var up = new Vector(0, 0, 1);
    var ran = new Vector(1, 0, 0);
    ran.rotate3d(up, raan);
    var normal = up.c().rotate3d(ran, i);
    var periaps = ran.c().rotate3d(normal, argofperigee);
    var apoaps = periaps.c().scale(-1);
    var rp = a * (1 - e);
    var ra = a * (1 + e);
    var minoraxis = a * Math.sqrt(1 - e * e);
    periaps.scale(rp);
    apoaps.scale(ra);
    const r = a * (1 - e * e) / (1 + e * Math.cos(trueanomaly));
    var satpos = periaps.c().rotate3d(normal, trueanomaly).normalize().scale(r);
    var velocity = Math.sqrt(2 * mu / satpos.length() - mu / a);
    // https://www.youtube.com/watch?v=6vCl9LHF_8k&t=765s
    // https://space.stackexchange.com/questions/52090/how-can-i-calculate-the-future-position-of-a-satellite-orbiting-a-central-body-a
    // https://duncaneddy.github.io/rastro/user_guide/orbits/anomalies/
    // //true -> eccentric -> mean -> tijd
    //tijd -> mean -> eccentric -> true
    // var orbperiod = TAU * Math.sqrt(a * a * a / mu)
    // var meananomaly = time / orbperiod * TAU
    // var eccentricanomaly = 0
    // var trueanomaly = meananomaly + (2*e - 0.25*(e*e*e)) * Math.sin(meananomaly) + 1.25*(e*e)*Math.sin(2*meananomaly) + (13/12)*(e*e*e)*Math.sin(3*meananomaly) + (26/25) * (e*e*e*e)* Math.sin(4*meananomaly)
    return {
        pos: satpos,
        vel: velocity,
    };
}
function time2trueanomaly(time, a, e) {
    var orbperiod = TAU * Math.sqrt(a * a * a / mu);
    var meananomaly = time / orbperiod * TAU;
    var trueanomaly = meananomaly + (2 * e - 0.25 * (e * e * e)) * Math.sin(meananomaly) + 1.25 * (e * e) * Math.sin(2 * meananomaly) + (13 / 12) * (e * e * e) * Math.sin(3 * meananomaly) + (26 / 25) * (e * e * e * e) * Math.sin(4 * meananomaly);
    return trueanomaly;
}
function trueanomaly2time(trueanamoly, e, orbperiod) {
    // https://www.sciencedirect.com/topics/physics-and-astronomy/eccentric-anomaly#:~:text=Eccentric%20anomaly%20E%20is%20related,%CE%B8%201%20%2B%20e%20cos%20%CE%B8%20.
    var eccentricanomaly = Math.acos((e + Math.cos(trueanamoly)) / (1 + e * Math.cos(trueanamoly)));
    if (trueanamoly > Math.PI) {
        eccentricanomaly = TAU - eccentricanomaly;
    }
    var E = eccentricanomaly;
    // https://space.stackexchange.com/questions/22144/difference-between-true-anomaly-and-mean-anomaly
    var meananomaly = E - e * Math.sin(E);
    var time = orbperiod * (meananomaly / TAU);
    return time;
}
function anglediff2d(a, b) {
    var aangle = Math.atan2(a.y, a.x);
    var bangle = Math.atan2(b.y, b.x);
    var angle = bangle - aangle;
    if (angle < 0) {
        angle += TAU;
    }
    return angle;
}
function sampleOrbit(orbitalparams, mu) {
    var positions = [];
    var steps = 100;
    for (var i = 0; i < steps; i++) {
        //todo determine orbitalperiod and sample at even spacing
        orbitalparams.trueanomaly = (i / steps) * TAU;
        var res = orbitParams2PosVel2(orbitalparams);
        positions.push(res.pos);
    }
    return positions;
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
/// <reference path="libs/utils/camera.ts" />
/// <reference path="libs/networking/entity.ts" />
/// <reference path="libs/networking/server.ts" />
/// <reference path="libs/utils/domutils.js" />
/// <reference path="body.ts" />
/// <reference path="engine.ts" />
/// <reference path="orbitmath.ts" />
// https://space.stackexchange.com/questions/2562/2d-orbital-path-from-state-vectors
// https://space.stackexchange.com/questions/1904/how-to-programmatically-calculate-orbital-elements-using-position-velocity-vecto
// https://wiki.kerbalspaceprogram.com/wiki/Tutorial:_Basic_Orbiting_(Math)
// https://orbital-mechanics.space/classical-orbital-elements/orbital-elements-and-the-state-vector.html#equation-eq-simplified-eccentricity-vector
// https://space.stackexchange.com/questions/19322/converting-orbital-elements-to-cartesian-state-vectors
//todo
//orbit params
//test/draw orbit
//stages/parts hierarchy
//multiple planets
//patched conics/soi
//questions
// orbital parameters math
// what exactly is isp
// math rearranging/algebra
// your rocket project?
// usefull equations or other things to know?
var tau = Math.PI * 2;
var timemultiplier = 1;
var rad2deg = 360 / tau;
var deg2rad = tau / 360;
var screensize = new Vector(document.documentElement.clientWidth, document.documentElement.clientHeight);
var crret = createCanvas(screensize.x, screensize.y);
var canvas = crret.canvas;
var ctxt = crret.ctxt;
var airdensityarray = [
    [-1000, 1.347],
    [0, 1.225],
    [1000, 1.112],
    [2000, 1.007],
    [3000, 0.9093],
    [4000, 0.8194],
    [5000, 0.7364],
    [6000, 0.6601],
    [7000, 0.5900],
    [8000, 0.5258],
    [9000, 0.4671],
    [10000, 0.4135],
    [15000, 0.1948],
    [20000, 0.08891],
    [25000, 0.04008],
    [30000, 0.01841],
    [40000, 0.003996],
    [50000, 0.001027],
    [60000, 0.0003097],
    [70000, 0.00008283],
];
var smoketrail = [];
var camera = new Camera2(ctxt);
var zoom = 1;
// camera.addListeners()
const G = 6.674 * Math.pow(10, -11);
var earth = new Planet({
    atmoshpericdensity: 0,
    atmosphereheight: 70000,
    radius: 600000,
    body: new BodyA({
        direction: 0,
        mass: 5.29 * Math.pow(10, 22),
        pos: new Vector(0, 0, 0),
        vel: new Vector(0, 0, 0),
    }),
});
var rocket = new Rocket({
    onrails: false,
    turnrate: 0.25,
    fuelContainer: new FuelContainer({
        mass: 500,
        currentfuel: 5000,
        maxfuel: 5000,
        fueltype: new FuelType({
            density: 1,
            name: 'liquidfuel',
        })
    }),
    engine: new Engine({
        throttle: 0,
        throttlespeed: 1,
        // ispatm:300,
        // ispvac:320,
        mass: 2000,
        // thrustatm:250000,
        // thrustvac:250000,
        fuelpersecond: 100,
        exhaustvel: 320 * 9.8,
    }),
    body: new BodyA({
        direction: 0,
        mass: 2000,
        pos: new Vector(0, 0, 0),
        vel: new Vector(0, 0, 0),
    }),
});
// cacheOrbit(earth.body,rocket.body)
//twr = thrust/weight/9.8(g)
var mu = G * earth.body.mass;
setup();
loop((dt) => {
    dt = Math.min(dt, 1 / 30);
    update(dt);
    draw();
});
window.addEventListener('wheel', (e) => {
    var scroll = 1;
    if (e.deltaY > 0) {
        scroll = 2;
    }
    else {
        scroll = 0.5;
    }
    zoom *= scroll;
    zoom = Math.max(1, zoom);
});
setInterval(() => {
    smoketrail.push(rocket.body.pos.c());
    if (smoketrail.length > 100) {
        smoketrail.shift();
    }
}, 1000);
var orbelems = posAndVel2OrbitParams(new Vector(0, -14000, 0), new Vector(3, 0, 3), 398600.5);
var posvelback = orbitParams2PosVel2(orbelems);
var test = new Vector(1, 0, 0).anglediff3d(new Vector(0, -1, 0));
function setup() {
    // camera.scale.scale(1/20)
    // rocket.body.vel.y = calcSpeedForCircularOrbit(earth.body.mass,earth.body.pos.to(rocket.body.pos).length())
    // rocket.body.pos = new Vector(0,-earth.radius)
    rocket.body.pos = new Vector(0, -earth.radius - 80000, 0);
    var circvelocity = 3000; //calcSpeedForCircularOrbit(earth.body.mass,-earth.radius - 80000)
    rocket.body.vel.x = circvelocity;
    rocket.body.vel.z = 0.1;
    rocket.engine.throttle = 0;
    rocket.body.direction = 0.5;
}
document.addEventListener('keydown', e => {
    if (e.key == ',') {
        timemultiplier *= 0.5;
    }
    if (e.key == '.') {
        timemultiplier *= 2;
    }
    timemultiplier = Math.max(timemultiplier, 1);
});
var acceleration = new Vector(0, 0, 0);
var airdensitycurrent = 0;
var dragacc = new Vector(0, 0, 0);
var dragwasteddv = 0;
var enginewasteddv = 0;
document.addEventListener('keydown', (e) => {
    if (e.key == 'r') {
        rocket.onrails = !rocket.onrails;
        if (rocket.onrails) {
            //going to onrails
            rocket.orbitalParams = posAndVel2OrbitParams(rocket.body.pos, rocket.body.vel, mu);
        }
        else {
            //going to simulation
            rocket.orbitalParams.trueanomaly = time2trueanomaly(rocket.orbitalParams.time, rocket.orbitalParams.semimajor, rocket.orbitalParams.eccentricity);
            var res = orbitParams2PosVel2(rocket.orbitalParams);
            rocket.body.pos = res.pos;
            rocket.body.vel = res.vel;
        }
    }
});
function update(dt) {
    dt *= timemultiplier;
    //input
    if (keys['a']) {
        rocket.body.direction -= rocket.turnrate * dt;
    }
    if (keys['d']) {
        rocket.body.direction += rocket.turnrate * dt;
    }
    if (keys['w']) {
        rocket.engine.throttle += rocket.engine.throttlespeed * dt;
    }
    if (keys['s']) {
        rocket.engine.throttle -= rocket.engine.throttlespeed * dt;
    }
    rocket.engine.throttle = clamp(rocket.engine.throttle, 0, 1);
    if (rocket.onrails == false) {
        var rocketmass = rocket.engine.mass + rocket.fuelContainer.mass + rocket.fuelContainer.currentfuel * rocket.fuelContainer.fueltype.density;
        // var engineforce = rocket.engine.thrustvac * rocket.engine.throttle
        var fuelmassps = rocket.engine.fuelpersecond * rocket.engine.throttle;
        var engineforce = fuelmassps * rocket.engine.exhaustvel;
        if (rocket.fuelContainer.currentfuel <= 0) {
            engineforce = 0;
        }
        else {
            rocket.fuelContainer.currentfuel = Math.max(0, rocket.fuelContainer.currentfuel - fuelmassps * dt);
        }
        var engineacc = new Vector(0, 1, 0).rotate2d(rocket.body.direction).scale(engineforce / rocketmass);
        var relvel = rocket.body.vel.c().sub(earth.body.vel);
        var earth2rocket = earth.body.pos.to(rocket.body.pos);
        enginewasteddv += Math.abs(engineacc.dot(earth2rocket.c().normalize())) * dt;
        var surfaceHeight = earth.body.pos.to(rocket.body.pos).length() - earth.radius;
        airdensitycurrent = getAirDensity(surfaceHeight);
        //todo take into account rocket orientation in airstream
        var airflowalignment = Math.abs(new Vector(0, 1, 0).rotate2d(rocket.body.direction).dot(relvel.c().normalize()));
        var dragcoefficient = lerp(0.8, 0.05, airflowalignment);
        var airflowsurfacearea = lerp(20, 5, airflowalignment);
        var dragforce = calcDrag(airdensitycurrent, relvel.length(), dragcoefficient, airflowsurfacearea);
        dragacc = new Vector(0, 0, 0);
        if (relvel.length() > 0) {
            dragacc = relvel.c().normalize().scale(-1 * dragforce / rocket.body.mass);
        }
        dragwasteddv += dragacc.length() * dt;
        var dist = Math.max(rocket.body.pos.to(earth.body.pos).length(), 0.5);
        var gravityforce = gravityForce(earth.body.mass, rocket.body.mass, dist);
        var gravacc = rocket.body.pos.to(earth.body.pos).normalize().scale(gravityforce / rocket.body.mass);
        var acc = new Vector(0, 0, 0);
        acc.add(gravacc);
        acc.add(engineacc);
        acc.add(dragacc);
        acceleration = acc;
        //https://www.youtube.com/watch?v=yGhfUcPjXuE&t=232s
        rocket.body.vel.add(acc.c().scale(dt * 0.5));
        rocket.body.pos.add(rocket.body.vel.c().scale(dt));
        rocket.body.vel.add(acc.c().scale(dt * 0.5));
    }
    else {
        rocket.orbitalParams.time += dt;
        rocket.orbitalParams.time = rocket.orbitalParams.time % rocket.orbitalParams.orbitalperiod;
        rocket.orbitalParams.trueanomaly = time2trueanomaly(rocket.orbitalParams.time, rocket.orbitalParams.semimajor, rocket.orbitalParams.eccentricity);
        var res = orbitParams2PosVel2(rocket.orbitalParams);
        rocket.body.pos = res.pos;
        rocket.body.vel = res.vel;
    }
    if (surfaceHeight < 0) {
        if (relvel.length() >= 20) {
            console.log('crash');
            console.log(`speed: ${rocket.body.vel.length()}`);
        }
        rocket.body.pos = earth.body.pos.to(rocket.body.pos).normalize().scale(earth.radius);
        rocket.body.vel = new Vector(0, 0, 0);
    }
    // var res = convertToOrbitalParameters(rocket.body.pos.c(),rocket.body.vel.c(),G * earth.body.mass)
}
function draw() {
    ctxt.clearRect(0, 0, screensize.x, screensize.y);
    ctxt.fillStyle = 'black';
    var relvel = rocket.body.vel.c().sub(earth.body.vel);
    var earth2rocket = earth.body.pos.to(rocket.body.pos);
    var vspeed = relvel.dot(earth2rocket.c().normalize());
    var hspeed = relvel.dot(earth2rocket.c().normalize().rotate2d(0.25));
    var textpos = 0;
    var spacing = 10;
    var res = posAndVel2OrbitParams(rocket.body.pos, rocket.body.vel, G * earth.body.mass);
    var posvelback = orbitParams2PosVel2(res);
    var calcbackvspeed = posvelback.vel.dot(earth2rocket.c().normalize());
    var calcbackhspeed = posvelback.vel.dot(earth2rocket.c().normalize().rotate2d(0.25));
    ctxt.fillText(`surface height: ${Math.round(earth.body.pos.to(rocket.body.pos).length() - earth.radius)}`, 10, textpos += spacing);
    ctxt.fillText(`direction: ${rocket.body.direction.toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`speed: ${relvel.length().toFixed(0)}`, 10, textpos += spacing);
    ctxt.fillText(`calcbackspeed: ${posvelback.vel.length().toFixed(0)}`, 10, textpos += spacing);
    ctxt.fillText(`hspeed: ${Math.round(hspeed).toFixed(0)}`, 10, textpos += spacing);
    ctxt.fillText(`vspeed: ${Math.round(vspeed).toFixed(0)}`, 10, textpos += spacing);
    ctxt.fillText(`calcbackhspeed: ${Math.round(calcbackhspeed).toFixed(0)}`, 10, textpos += spacing);
    ctxt.fillText(`calcbackvspeed: ${Math.round(calcbackvspeed).toFixed(0)}`, 10, textpos += spacing);
    textpos += spacing;
    ctxt.fillText(`airdensity: ${(airdensitycurrent).toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`drag: ${(dragacc.length()).toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`drag wasted dv: ${dragwasteddv.toFixed(0)}`, 10, textpos += spacing);
    ctxt.fillText(`engine wasted dv: ${enginewasteddv.toFixed(0)}`, 10, textpos += spacing);
    var gravacc = gravityAcceleration(G, earth.body.mass, earth2rocket.length());
    var dv = tsiolkovsky(rocket.engine.exhaustvel, rocket.getWetMass(), rocket.getDryMass());
    ctxt.fillText(`remaining dv: ${dv.toFixed(0)}`, 10, textpos += spacing);
    textpos += spacing;
    ctxt.fillText(`throttle: ${rocket.engine.throttle.toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`accelaration: ${(acceleration.length() / 9.8).toFixed(1)}`, 10, textpos += spacing);
    ctxt.fillText(`mass: ${(rocket.engine.mass + rocket.fuelContainer.getMass()).toFixed(0)}`, 10, textpos += spacing);
    ctxt.fillText(`fuel: ${(rocket.fuelContainer.currentfuel).toFixed(0)}`, 10, textpos += spacing);
    textpos += spacing;
    ctxt.fillText(`apoaps: ${Math.round(res.apoaps - earth.radius)}`, 10, textpos += spacing);
    ctxt.fillText(`periaps: ${Math.round(res.periaps - earth.radius)}`, 10, textpos += spacing);
    ctxt.fillText(`eccentricity: ${res.eccentricity.toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`inclination: ${(res.inclination).toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`raan: ${(res.raan).toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`argofperi: ${(res.argofperigee).toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`trueanomaly: ${(res.trueanomaly).toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`calcback trueanomaly: ${posvelback.trueanomaly.toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`time: ${Math.round(res.time)}`, 10, textpos += spacing);
    ctxt.fillText(`orbperiod: ${Math.round(res.orbitalperiod)}`, 10, textpos += spacing);
    textpos += spacing;
    ctxt.fillText(`timemultiplier: ${(timemultiplier).toFixed(2)}`, 10, textpos += spacing);
    ctxt.fillText(`zoom: ${(zoom).toFixed(2)}`, 10, textpos += spacing);
    textpos = 0;
    ctxt.fillText('w s = throttle', 200, textpos += spacing);
    ctxt.fillText('a d = rotate', 200, textpos += spacing);
    ctxt.fillText('mousewheel = zoom', 200, textpos += spacing);
    ctxt.fillText(', and . = time warp', 200, textpos += spacing);
    ctxt.fillText('r = toggle onrails mode', 200, textpos += spacing);
    var apoapsnode = res.evec.c().normalize().scale(-res.apoaps);
    var periapsnode = res.evec.c().normalize().scale(res.periaps);
    var raannode = res.ascendingnode;
    // camera.pos = rocket.body.pos.c()
    // camera.pos = rocket.body.pos.lerp(earth.body.pos,0.5)
    camera.moveTo(new Vector(0, 0, 0));
    camera.moveTo(rocket.body.pos);
    // camera.zoomTo(earth.radius * 4)
    camera.zoomTo(zoom * screensize.x);
    // camera.zoomTo(screensize.x * (earth.radius / screensize.x) * 4)
    var surfacepos = earth.body.pos.to(rocket.body.pos).normalize().scale(earth.radius);
    // camera.pos = surfacepos.lerp(rocket.body.pos,0.5)//halfway between surface and rocket
    // var spacerequired = surfacepos.to(rocket.body.pos).length()
    var spacerequired = earth.body.pos.to(rocket.body.pos).length();
    var screensrequired = spacerequired / screensize.y;
    // camera.scale = new Vector(1,1).scale(Math.max(1,screensrequired * 2))
    // camera.scale = new Vector(5,5)
    var smoketrailscreenpositions = [];
    var orbitpath = sampleOrbit(res, mu);
    camera.begin();
    smoketrailscreenpositions = smoketrail.map(v => camera.worldToScreen(v));
    orbitpath = orbitpath.map(v => camera.worldToScreen(v));
    // drawcooord(new Vector(0,100))
    // drawRocket(new Vector(0,0,0),rocket)
    var center = camera.worldToScreen(new Vector(0, 0, 0));
    var earthradiusscreen = camera.worldToScreen(new Vector(0, earth.radius, 0));
    var rocketscreenpos = camera.worldToScreen(rocket.body.pos);
    periapsnode = camera.worldToScreen(periapsnode);
    apoapsnode = camera.worldToScreen(apoapsnode);
    raannode = camera.worldToScreen(raannode);
    var screenbackcalc = camera.worldToScreen(posvelback.pos);
    camera.end();
    ctxt.strokeStyle = 'blue';
    line(orbitpath);
    drawRocket(rocketscreenpos, rocket);
    ctxt.strokeStyle = 'black';
    strokecircle(center, center.to(earthradiusscreen).length());
    ctxt.fillStyle = 'red';
    for (var p of smoketrailscreenpositions) {
        drawRect(p);
    }
    ctxt.fillStyle = 'black';
    drawcoordtext(apoapsnode, `apoaps ${(res.apoaps - earth.radius).toFixed()}`);
    drawcoordtext(periapsnode, `periaps ${(res.periaps - earth.radius).toFixed()}`);
    drawcoordtext(raannode, 'raan');
    ctxt.fillStyle = 'purple';
    drawcoordtext(screenbackcalc, 'backcalc');
}
function line(verts) {
    ctxt.beginPath();
    ctxt.moveTo(verts[0].x, verts[0].y);
    for (var i = 1; i < verts.length; i++) {
        ctxt.lineTo(verts[i].x, verts[i].y);
    }
    ctxt.closePath();
    ctxt.stroke();
}
function drawcoordtext(pos, text) {
    ctxt.fillText(`${text}`, pos.x, pos.y + 20);
    drawRect(pos);
}
function drawcoord(pos) {
    ctxt.fillText(`${pos.x} ${pos.y}`, pos.x, pos.y + 20);
    drawRect(pos);
}
function drawRect(pos) {
    var width = 10;
    var halfwidth = width / 2;
    ctxt.fillRect(pos.x - halfwidth, pos.y - halfwidth, width, width);
}
function strokecircle(pos, radius) {
    ctxt.beginPath();
    ctxt.ellipse(pos.x, pos.y, radius, radius, 0, 0, tau);
    ctxt.closePath();
    ctxt.stroke();
}
function drawRocket(pos, rocket) {
    var points = [
        new Vector(-10, 10),
        new Vector(0, 20),
        new Vector(10, 10),
        new Vector(10, -20),
        new Vector(-10, -20),
    ];
    var exhaust = [
        new Vector(10, -20),
        new Vector(0, -20 + (rocket.fuelContainer.currentfuel > 0 ? lerp(rocket.engine.throttle, 0, 20) : 0)),
        new Vector(-10, -20),
    ];
    for (var point of points) {
        point.rotate2d(rocket.body.direction);
    }
    for (var point of exhaust) {
        point.rotate2d(rocket.body.direction);
    }
    ctxt.fillStyle = 'black';
    drawShape(points, pos);
    ctxt.fillStyle = 'red';
    drawShape(exhaust, pos);
}
function drawShape(points, offset) {
    ctxt.beginPath();
    ctxt.moveTo(points[0].x + offset.x, points[0].y + offset.y);
    for (var i = 1; i < points.length; i++) {
        ctxt.lineTo(points[i].x + offset.x, points[i].y + offset.y);
    }
    ctxt.closePath();
    ctxt.fill();
}
function cacheOrbit(planet, rocket) {
    //simulate orbit
    //guess for good timesteps,heuristic could be current speed,distance, or amount of angle change
    //ideally more samples at periaps
    //maybe use speed or distance travelled or kepplers law or something
    //save positions,also save speed, and save percentage completion or something so you can accurately snap a time/completion amount to the correct spot in the orbit
    //calc semimajor,minor,eccentricity
    //can do this by calculating height change between position
    //once total distance is known orbital period is calculated
    var relpos = planet.pos.to(rocket.pos);
    var angle = relpos.angle2d(new Vector(1, 0));
    var angletraveled = 0;
    var time = 0;
    while (angletraveled < 1) {
        objectStep(planet, rocket, 1);
        //maybe check area covered kepplers law
        time += 1; //would be better if timesteps corresponded to distance travveled or something, timepercentage completed
        relpos = planet.pos.to(rocket.pos);
        var newangle = relpos.angle2d(new Vector(1, 0));
        var change = Math.abs(to(angle, newangle));
        if (change > 180) {
            change = Math.abs(to(angle, newangle - 360));
        }
        angletraveled += change;
        angle = newangle;
        datapoints.push({
            relpos: relpos.c(),
            relspeed: rocket.vel.c().sub(planet.vel),
            time: time,
        });
    }
    //maybe do it twice first a rough one using anglecomplete to determine a rough orbitlength,speeding up deltatime if anglechange is less than 1 and decreasing dt if greater than 1
    //save orbitlength and orbitalperiod
    //than do a second more precise run where you can use the known distance to be traveled
    //having a precise apoaps and periaps is most important, looking at heightchange per second is a good heuristic to determine this
    var orbitalperiod = time;
    var periaps = 0;
    var apoaps = 0;
    //complete orbit simulated
    //now find the highest and lowest point. (maybe even lerp)
    var datapoints = [];
}
function objectStep(planet, object, dt) {
    var dist = Math.max(object.pos.to(planet.pos).length(), 0.5);
    var force = gravityForce(planet.mass, object.mass, dist);
    var acc = object.pos.to(planet.pos).normalize().scale(force / object.mass);
    object.vel.add(acc.scale(dt));
    object.pos.add(object.vel.c().scale(dt));
}
//try a second draw function for a closeup of a rocket
//simulate the rocket going around a few times and cache the path and statistics
//have a closeupview and an earth view
function tsiolkovsky(exhaustvel, wetmass, drymass) {
    return exhaustvel * Math.log(wetmass / drymass);
}
function calcDrag(massdensity, flowvelocity, dragcoefficient, area) {
    return 0.5 * massdensity * flowvelocity * flowvelocity * dragcoefficient * area;
}
function calcSpeedForCircularOrbit(M, radius) {
    return Math.pow(G * M * (1 / radius), 0.5);
}
function calcSpeedForEllipticalOrbit(M, radius, sma) {
    // https://www.youtube.com/watch?v=000zDI2nmq8
    //can be used to calculate necessary speed for hohman transfer
    //mu = G * M
    var mu = G * M;
    return Math.pow(mu * (2 / radius - 1 / sma), 0.5);
}
function gravityAcceleration(G, M, r) {
    return (G * M) / (r * r);
}
function gravityForce(m1, m2, distance) {
    return (G * m1 * m2) / (distance * distance);
}
// function calcOrbitParameters(pos:Vector,vel:Vector,G,M,m){
//     // https://wiki.kerbalspaceprogram.com/wiki/Tutorial:_Basic_Orbiting_(Math)
//     var mu = G * M
//     var r = pos.length()
//     var v = vel.length()
//     var l = m * r * v
//     var l2 = l * l
//     function heightat(angledeg){
//         return (l2 / (mu*m*m)) * (1 / (1 +  e * Math.cos(angledeg * deg2rad)))
//     }
//     var periaps = heightat(0)
//     var apoaps = heightat(180) 
//     // https://en.wikipedia.org/wiki/Orbital_elements
//     var semimajoraxis = (l2 / (mu*m*m)) * (1 / (1 - e * e))
//     var semiminoraxis = (l2 / (mu*m*m)) * Math.pow(1 / (1 - e * e),0.5)
//     var eccentricity = Math.pow(semimajoraxis * semimajoraxis - semiminoraxis * semiminoraxis,0.5) / semimajoraxis
//     var argumentofperiapsis
//     var trueanamoly
//     //3d stuff
//     // var inclination
//     // var longtitudeoftheascendingnode
//     return {
//         semimajoraxis,
//         eccentricity,
//         argumentofperiapsis,
//         trueanamoly
//     }
// }
// function calcOrbitParameters2(pos:Vector,vel:Vector,M,g){
//     // https://space.stackexchange.com/questions/2562/2d-orbital-path-from-state-vectors
//     var mu = M * g
//     var H = pos.cross(vel)
//     var h = H.length()
//     var E = vel.cross(H) / mu - pos / pos.length()
//     var e = E.length()
//     var a = (h * h) / (mu * (1 - e * e))
//     var w = Math.atan(E.y / E.x)
//     function d(T){
//         return a * (1 - e * e) / (1 + e * Math.cos(T + w))
//     }
//     var ta = 
//     var theta = 
// }
// function calcOrbitParameters3(pos:Vector,vel:Vector,M,g){
//     var mu = M * g
//     var speed = vel.length()
//     var r = pos.length()
//     var h = pos.cross(vel)
//     var K = new Vector(0,0,1)
//     var node = K.cross(h)
//     var E = pos.scale(speed * speed - mu / r).sub(vel.scale(pos.dot(vel))).scale(1/mu)
//     var e = E.length()
//     var w = Math.acos(node.dot(E) / (node.length() * e))
//     var v = Math.acos(E.dot(pos) / (e * r))
//     // https://space.stackexchange.com/questions/1904/how-to-programmatically-calculate-orbital-elements-using-position-velocity-vecto
// }
function calcPosVel() {
}
function getAirDensity(height) {
    if (height > last(airdensityarray)[0]) {
        return 0;
    }
    if (height < first(airdensityarray)[0]) {
        return first(airdensityarray)[1];
    }
    for (var i = 0; i < airdensityarray.length - 1; i++) {
        if (height >= airdensityarray[i][0] && height < airdensityarray[i + 1][0]) {
            return map(height, airdensityarray[i][0], airdensityarray[i + 1][0], airdensityarray[i][1], airdensityarray[i + 1][1]);
        }
    }
    return 0;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYnMvdmVjdG9yL3ZlY3Rvci50cyIsImxpYnMvdXRpbHMvcm5nLnRzIiwibGlicy91dGlscy9zdG9yZS50cyIsImxpYnMvdXRpbHMvdGFibGUudHMiLCJsaWJzL3V0aWxzL3V0aWxzLnRzIiwibGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJsaWJzL3V0aWxzL2FiaWxpdHkudHMiLCJsaWJzL3V0aWxzL2FuaW0udHMiLCJsaWJzL3JlY3QvcmVjdC50cyIsImxpYnMvZXZlbnQvZXZlbnRxdWV1ZS50cyIsImxpYnMvZXZlbnQvZXZlbnRzeXN0ZW0udHMiLCJsaWJzL3V0aWxzL2NhbWVyYS50cyIsImxpYnMvbmV0d29ya2luZy9lbnRpdHkudHMiLCJsaWJzL25ldHdvcmtpbmcvc2VydmVyLnRzIiwibGlicy91dGlscy9kb211dGlscy5qcyIsImJvZHkudHMiLCJlbmdpbmUudHMiLCJvcmJpdG1hdGgudHMiLCJtYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sTUFBTTtJQUdSLFlBQVksR0FBRyxJQUFhO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsUUFBd0M7UUFDeEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO1lBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3hCO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzNELENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMxRCxDQUFDO0lBRUQsS0FBSztRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDM0QsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENB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QyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUMvRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDekUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQy9FLENBQUM7SUFFRDs7O09BR0c7SUFDSCxNQUFNLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxjQUFjLEVB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QUFHLEVBQUUsQ0FBQTtLQUM3RDtJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7SUFFMUQsSUFBRyxNQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssRUFBQztRQUN2QixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUE7UUFDMUkscUVBQXFFO1FBQ3JFLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO1FBQ3JFLElBQUksV0FBVyxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQTtRQUN2RCxJQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxJQUFJLENBQUMsRUFBQztZQUNyQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1NBQ2xCO2FBQUk7WUFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUE7U0FDckc7UUFFRCxJQUFJLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUMsVUFBVSxDQUFDLENBQUE7UUFDL0YsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FB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