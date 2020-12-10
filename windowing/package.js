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
    add(item) {
        item.id = this.counter++;
        this.map.set(item.id, item);
    }
    addList(items) {
        items.forEach(i => this.add(i));
    }
    get(id) {
        return this.map.get(id);
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
        result[v.x][v.y] = filler(v);
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
function sum(arr) {
    return arr.reduce((p, c) => p + c, 0);
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
        ctxt.strokeRect(this.min.x + 0.5, this.min.y + 0.5, size.x, size.y);
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
// handles and rects form a tree/graph structure and events should propagate outwards
var HandlePositions;
(function (HandlePositions) {
    HandlePositions[HandlePositions["anchortl"] = 0] = "anchortl";
    HandlePositions[HandlePositions["anchortr"] = 1] = "anchortr";
    HandlePositions[HandlePositions["anchorbr"] = 2] = "anchorbr";
    HandlePositions[HandlePositions["anchorbl"] = 3] = "anchorbl";
    HandlePositions[HandlePositions["offsettl"] = 4] = "offsettl";
    HandlePositions[HandlePositions["offsettr"] = 5] = "offsettr";
    HandlePositions[HandlePositions["offsetbr"] = 6] = "offsetbr";
    HandlePositions[HandlePositions["offsetbl"] = 7] = "offsetbl";
    HandlePositions[HandlePositions["offsetdrag"] = 8] = "offsetdrag";
    HandlePositions[HandlePositions["offsetl"] = 9] = "offsetl";
    HandlePositions[HandlePositions["offsetr"] = 10] = "offsetr";
    HandlePositions[HandlePositions["offsetb"] = 11] = "offsetb";
})(HandlePositions || (HandlePositions = {}));
var JustifyContent;
(function (JustifyContent) {
    JustifyContent[JustifyContent["left"] = 0] = "left";
    JustifyContent[JustifyContent["center"] = 1] = "center";
    JustifyContent[JustifyContent["right"] = 2] = "right";
    JustifyContent[JustifyContent["spacebetween"] = 3] = "spacebetween";
    JustifyContent[JustifyContent["spacearound"] = 4] = "spacearound";
    JustifyContent[JustifyContent["spaceevenly"] = 5] = "spaceevenly";
})(JustifyContent || (JustifyContent = {}));
class UIRect {
    constructor() {
        this.anchorMin = new Vector(0.1, 0.1);
        this.anchorMax = new Vector(0.9, 0.9);
        this.offsetMin = new Vector(10, 10);
        this.offsetMax = new Vector(-10, -10);
        this.absRect = new Rect(new Vector(0, 0), new Vector(0, 0));
        this.parent = null;
        this.handles = new Map();
        this.isFlex = false;
        this.justifyCOntent = JustifyContent.left;
        this.handlepositions = new Map();
        this.handlepositions.set(HandlePositions.anchortl, new Vector(0, 0));
        this.handlepositions.set(HandlePositions.anchortr, new Vector(1, 0));
        this.handlepositions.set(HandlePositions.anchorbr, new Vector(1, 1));
        this.handlepositions.set(HandlePositions.anchorbl, new Vector(0, 1));
        this.handlepositions.set(HandlePositions.offsettl, new Vector(0, 0));
        this.handlepositions.set(HandlePositions.offsettr, new Vector(1, 0));
        this.handlepositions.set(HandlePositions.offsetbr, new Vector(1, 1));
        this.handlepositions.set(HandlePositions.offsetbl, new Vector(0, 1));
        this.handlepositions.set(HandlePositions.offsetdrag, new Vector(0.5, 0));
        this.handlepositions.set(HandlePositions.offsetl, new Vector(0, 0.5));
        this.handlepositions.set(HandlePositions.offsetr, new Vector(1, 0.5));
        this.handlepositions.set(HandlePositions.offsetb, new Vector(0.5, 1));
        this.handletype = new Map();
        this.handletype.set(HandlePositions.anchortl, 0);
        this.handletype.set(HandlePositions.anchortr, 0);
        this.handletype.set(HandlePositions.anchorbr, 0);
        this.handletype.set(HandlePositions.anchorbl, 0);
        this.handletype.set(HandlePositions.offsettl, 1);
        this.handletype.set(HandlePositions.offsettr, 1);
        this.handletype.set(HandlePositions.offsetbr, 1);
        this.handletype.set(HandlePositions.offsetbl, 1);
        this.handletype.set(HandlePositions.offsetdrag, 1);
        this.handletype.set(HandlePositions.offsetl, 1);
        this.handletype.set(HandlePositions.offsetr, 1);
        this.handletype.set(HandlePositions.offsetb, 1);
        this.justifyContentMap = new Map();
        this.justifyContentMap.set(JustifyContent.left, this.left);
        this.justifyContentMap.set(JustifyContent.right, this.right);
        this.justifyContentMap.set(JustifyContent.center, this.center);
        this.justifyContentMap.set(JustifyContent.spacebetween, this.spaceBetween);
        this.justifyContentMap.set(JustifyContent.spacearound, this.spaceAround);
        this.justifyContentMap.set(JustifyContent.spaceevenly, this.spaceEvenly);
    }
    addHandles() {
        this.addAnchorHandles();
        this.addOffsetHandles();
    }
    removeSpecificHandles(handlepositions) {
        for (var handlepos of handlepositions) {
            this.handles.get(handlepos).cleanup();
            this.handles.delete(handlepos);
            handlestore.remove(this.handles.get(handlepos));
        }
    }
    addSpecificHandles(handlepositions) {
        var that = this;
        var map = new Map();
        map.set(HandlePositions.anchortl, () => {
            this.handles.set(HandlePositions.anchortl, new Handle(HandleType.anchor, (self) => {
                //topleft
                that.anchorMin.x = inverseLerp(self.pos.x, this.absParent.min.x, this.absParent.max.x);
                that.anchorMin.y = inverseLerp(self.pos.y, this.absParent.min.y, this.absParent.max.y);
                var reversedelta = self.delta.c().scale(-1);
                that.offsetMin.x += reversedelta.x;
                that.offsetMin.y += reversedelta.y;
                this.update();
            }));
        });
        map.set(HandlePositions.anchortr, () => {
            this.handles.set(HandlePositions.anchortr, new Handle(HandleType.anchor, (self) => {
                //topright
                that.anchorMax.x = inverseLerp(self.pos.x, this.absParent.min.x, this.absParent.max.x);
                that.anchorMin.y = inverseLerp(self.pos.y, this.absParent.min.y, this.absParent.max.y);
                var reversedelta = self.delta.c().scale(-1);
                that.offsetMax.x += reversedelta.x;
                that.offsetMin.y += reversedelta.y;
                this.update();
            }));
        });
        map.set(HandlePositions.anchorbl, () => {
            this.handles.set(HandlePositions.anchorbl, new Handle(HandleType.anchor, (self) => {
                //botleft
                that.anchorMin.x = inverseLerp(self.pos.x, this.absParent.min.x, this.absParent.max.x);
                that.anchorMax.y = inverseLerp(self.pos.y, this.absParent.min.y, this.absParent.max.y);
                var reversedelta = self.delta.c().scale(-1);
                that.offsetMin.x += reversedelta.x;
                that.offsetMax.y += reversedelta.y;
                this.update();
            }));
        });
        map.set(HandlePositions.anchorbr, () => {
            this.handles.set(HandlePositions.anchorbr, new Handle(HandleType.anchor, (self) => {
                //botright
                that.anchorMax.x = inverseLerp(self.pos.x, this.absParent.min.x, this.absParent.max.x);
                that.anchorMax.y = inverseLerp(self.pos.y, this.absParent.min.y, this.absParent.max.y);
                var reversedelta = self.delta.c().scale(-1);
                that.offsetMax.x += reversedelta.x;
                that.offsetMax.y += reversedelta.y;
                this.update();
            }));
        });
        map.set(HandlePositions.offsettl, () => {
            this.handles.set(HandlePositions.offsettl, new Handle(HandleType.offset, (self) => {
                var offsetmin = this.absAnchorMin().to(self.pos);
                var offsetmax = this.absAnchorMax().to(self.pos);
                //topleft
                that.offsetMin.x = offsetmin.x;
                that.offsetMin.y = offsetmin.y;
                this.update();
            }));
        });
        map.set(HandlePositions.offsettr, () => {
            this.handles.set(HandlePositions.offsettr, new Handle(HandleType.offset, (self) => {
                var offsetmin = this.absAnchorMin().to(self.pos);
                var offsetmax = this.absAnchorMax().to(self.pos);
                //topright
                that.offsetMax.x = offsetmax.x;
                that.offsetMin.y = offsetmin.y;
                this.update();
            }));
        });
        map.set(HandlePositions.offsetbr, () => {
            this.handles.set(HandlePositions.offsetbr, new Handle(HandleType.offset, (self) => {
                var offsetmin = this.absAnchorMin().to(self.pos);
                var offsetmax = this.absAnchorMax().to(self.pos);
                //botright
                that.offsetMax.x = offsetmax.x;
                that.offsetMax.y = offsetmax.y;
                this.update();
            }));
        });
        map.set(HandlePositions.offsetbl, () => {
            this.handles.set(HandlePositions.offsetbl, new Handle(HandleType.offset, (self) => {
                var offsetmin = this.absAnchorMin().to(self.pos);
                var offsetmax = this.absAnchorMax().to(self.pos);
                //botleft
                that.offsetMin.x = offsetmin.x;
                that.offsetMax.y = offsetmax.y;
                this.update();
            }));
        });
        map.set(HandlePositions.offsetdrag, () => {
            this.handles.set(HandlePositions.offsetdrag, new Handle(HandleType.offset, (self) => {
                that.offsetMin.add(self.delta);
                that.offsetMax.add(self.delta);
                this.update();
                //drag
            }));
        });
        map.set(HandlePositions.offsetl, () => {
            this.handles.set(HandlePositions.offsetl, new Handle(HandleType.offset, (self) => {
                var offsetmin = this.absAnchorMin().to(self.pos);
                var offsetmax = this.absAnchorMax().to(self.pos);
                //left
                that.offsetMin.x = offsetmin.x;
                this.update();
            }));
        });
        map.set(HandlePositions.offsetr, () => {
            this.handles.set(HandlePositions.offsetr, new Handle(HandleType.offset, (self) => {
                var offsetmin = this.absAnchorMin().to(self.pos);
                var offsetmax = this.absAnchorMax().to(self.pos);
                //right
                that.offsetMax.x = offsetmax.x;
                this.update();
            }));
        });
        map.set(HandlePositions.offsetb, () => {
            this.handles.set(HandlePositions.offsetb, new Handle(HandleType.offset, (self) => {
                var offsetmin = this.absAnchorMin().to(self.pos);
                var offsetmax = this.absAnchorMax().to(self.pos);
                //bot
                that.offsetMax.y = offsetmax.y;
                this.update();
            }));
        });
        for (var handlepos of handlepositions) {
            map.get(handlepos)();
            handlestore.add(this.handles.get(handlepos));
        }
    }
    addAnchorHandles() {
        this.addSpecificHandles([
            HandlePositions.anchortl,
            HandlePositions.anchortr,
            HandlePositions.anchorbr,
            HandlePositions.anchorbl,
        ]);
    }
    addOffsetHandles() {
        this.addSpecificHandles([
            HandlePositions.offsetb,
            HandlePositions.offsetbl,
            HandlePositions.offsetbr,
            HandlePositions.offsetdrag,
            HandlePositions.offsetl,
            HandlePositions.offsetr,
            HandlePositions.offsettl,
            HandlePositions.offsettr,
        ]);
    }
    getParentAbsRect() {
        var parent = uirectstore.get(this.parent);
        var absparent = parent === null || parent === void 0 ? void 0 : parent.absRect;
        if (parent == null) {
            absparent = new Rect(new Vector(0, 0), screensize.c());
        }
        return absparent;
    }
    focusGained() {
        //add handles
        //if root only add offsethandles
    }
    focusLost() {
        //remove handles
    }
    update() {
        this.absParent = this.getParentAbsRect();
        // var absmin = absparent.getPoint(this.anchorMin).add(this.offsetMin)
        // var absmax = absparent.getPoint(this.anchorMax).add(this.offsetMax)
        var absAnchorRect = new Rect(this.absAnchorMin(), this.absAnchorMax());
        this.absRect.min.overwrite(this.absOffsetMin());
        this.absRect.max.overwrite(this.absOffsetMax());
        var absrects = [absAnchorRect, this.absRect];
        for (var [hpos, handle] of this.handles) {
            handle.setPos(absrects[this.handletype.get(hpos)].getPoint(this.handlepositions.get(hpos)));
        }
        if (this.isFlex) {
            this.updateChildren();
            this.justifyContentMap.get(this.justifyCOntent).bind(this)();
        }
        this.updateChildren();
    }
    absAnchorMin() {
        return this.absParent.getPoint(this.anchorMin);
    }
    absAnchorMax() {
        return this.absParent.getPoint(this.anchorMax);
    }
    absOffsetMin() {
        return this.absAnchorMin().add(this.offsetMin);
    }
    absOffsetMax() {
        return this.absAnchorMax().add(this.offsetMax);
    }
    width() {
        return to(this.absRect.min.x, this.absRect.max.x);
    }
    getChildren() {
        return uirectstore.list().filter(r => r.parent == this.id);
    }
    updateChildren() {
        this.getChildren().forEach(c => c.update());
    }
    draw(ctxt) {
        this.absRect.draw(ctxt);
        for (var [key, handle] of this.handles) {
            handle.draw(ctxt);
        }
    }
    left() {
        this.spaceChildren(0, 0);
    }
    right() {
        var { freespace } = this.calcstats();
        this.spaceChildren(freespace, 0);
    }
    center() {
        var { freespace } = this.calcstats();
        this.spaceChildren(freespace / 2, 0);
    }
    spaceBetween() {
        var { freespace } = this.calcstats();
        var gaps = this.getChildren().length - 1;
        this.spaceChildren(0, freespace / gaps);
    }
    spaceAround() {
        var { freespace } = this.calcstats();
        var minigaps = (this.getChildren().length - 1) * 2 + 2;
        var freespaceperminigap = freespace / minigaps;
        this.spaceChildren(freespaceperminigap, freespaceperminigap * 2);
    }
    spaceEvenly() {
        var { freespace } = this.calcstats();
        var gaps = this.getChildren().length + 1;
        var freespacepergap = freespace / gaps;
        this.spaceChildren(freespacepergap, freespacepergap);
    }
    spaceChildren(start, spacing) {
        var children = this.getChildren();
        var current = start;
        for (var child of children) {
            var originalsize = child.absOffsetMin().to(child.absOffsetMax());
            child.anchorMin.overwrite(new Vector(0, 0));
            child.anchorMax.overwrite(new Vector(0, 0));
            var dest = new Vector(current, 0);
            //move/set topleft to current destination
            //gaat fout hier vanwege absRect
            child.offsetMin.overwrite(dest);
            child.offsetMax.overwrite(originalsize.add(dest));
            current += spacing + child.absRect.size().x;
        }
    }
    calcstats() {
        var width = this.absRect.size().x;
        var childrenwidth = sum(this.getChildren().map(c => c.absRect.size().x));
        var freespace = width - childrenwidth;
        return { width, childrenwidth, freespace };
    }
    setSize(size) {
        this.anchorMin.overwrite(new Vector(0, 0));
        this.anchorMax.overwrite(new Vector(0, 0));
        this.offsetMin.overwrite(new Vector(0, 0));
        this.offsetMax.overwrite(size);
    }
}
var HandleType;
(function (HandleType) {
    HandleType[HandleType["anchor"] = 0] = "anchor";
    HandleType[HandleType["offset"] = 1] = "offset";
})(HandleType || (HandleType = {}));
class Handle {
    constructor(type, cb) {
        this.type = type;
        this.delta = new Vector(0, 0);
        this.selected = false;
        this.hitbox = new Rect(new Vector(0, 0), new Vector(10, 10));
        this.pos = new Vector(0, 0);
        this.onMove = cb;
        clickManager.listen(this.hitbox, () => {
            this.selected = true;
        });
        document.addEventListener('mouseup', e => {
            this.selected = false;
        });
        document.addEventListener('mousemove', e => {
            var mousepos = getMousePos(canvas, e);
            if (this.selected) {
                this.setPos(mousepos);
                this.onMove(this);
            }
        });
    }
    cleanup() {
        clickManager.delisten(this.hitbox);
        //todo
        //remove all the eventlistners
    }
    setPos(pos) {
        this.oldpos = this.pos;
        this.pos = pos;
        this.delta = this.oldpos.to(this.pos);
        this.hitbox.min.overwrite(this.pos.c().add(new Vector(-5, -5)));
        this.hitbox.max.overwrite(this.pos.c().add(new Vector(5, 5)));
    }
    draw(ctxt) {
        if (this.type == HandleType.anchor) {
            ctxt.fillStyle = 'red';
        }
        else {
            ctxt.fillStyle = 'blue';
        }
        this.pos.draw(ctxt);
    }
}
class Knot {
    constructor() {
        this.neighbours = [];
    }
}
function floodfill(knotstore, startknot) {
    var res = [];
    var visited = new Set();
    var frontier = [startknot.id];
    while (frontier.length > 0) {
        var current = frontier.shift();
        res.push(knotstore.get(current));
        visited.add(current);
        frontier.push(...knotstore.get(current).neighbours);
    }
    return res;
}
class ClickManager {
    constructor() {
        this.rects = new Map();
        this.listenToDocument();
    }
    listenToDocument() {
        document.addEventListener('mousedown', e => {
            this.click(getMousePos(canvas, e));
        });
    }
    click(pos) {
        for (var [rect, cb] of this.rects) {
            if (rect.collidePoint(pos)) {
                cb(pos);
                break;
            }
        }
    }
    listen(rect, cb) {
        this.rects.set(rect, cb);
    }
    delisten(rect) {
        this.rects.delete(rect);
    }
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
/// <reference path="uiRect.ts" />
/// <reference path="handle.ts" />
/// <reference path="graph.ts" />
/// <reference path="clickManager.ts" />
var screensize = new Vector(document.documentElement.clientWidth, document.documentElement.clientHeight);
var crret = createCanvas(screensize.x, screensize.y);
var canvas = crret.canvas;
var ctxt = crret.ctxt;
var clickManager = new ClickManager();
var mousepos = new Vector(0, 0);
var uirectstore = new Store();
var handlestore = new Store();
function addFlexbox(self, justify, anchormin, anchormax, offsetmin, offsetmax) {
    var rect = addUIRect(self.id, true);
    addDemoChildRects(rect);
    rect.addOffsetHandles();
    // rect.addAnchorHandles()
    rect.justifyCOntent = justify;
    rect.anchorMin = anchormin;
    rect.anchorMax = anchormax;
    rect.offsetMin = offsetmin;
    rect.offsetMax = offsetmax;
    return rect;
}
var rootrect = addUIRect(null, false);
rootrect.addOffsetHandles();
addFlexbox(rootrect, JustifyContent.center, new Vector(0.5, 0), new Vector(0.5, 0), new Vector(-200, 0), new Vector(200, 100));
addFlexbox(rootrect, JustifyContent.left, new Vector(0, 0), new Vector(0, 0), new Vector(0, 0), new Vector(400, 200));
addFlexbox(rootrect, JustifyContent.right, new Vector(1, 0), new Vector(1, 0), new Vector(-400, 0), new Vector(0, 200));
addFlexbox(rootrect, JustifyContent.spacearound, new Vector(0, 0.5), new Vector(1, 0.5), new Vector(0, -100), new Vector(1, 100));
addFlexbox(rootrect, JustifyContent.spaceevenly, new Vector(0, 1), new Vector(0, 1), new Vector(0, -100), new Vector(400, 0));
addFlexbox(rootrect, JustifyContent.spacebetween, new Vector(1, 1), new Vector(1, 1), new Vector(-400, -200), new Vector(0, 0));
// var b = addUIRect(a.id)
rootrect.update();
document.addEventListener('mousemove', e => {
    mousepos = getMousePos(canvas, e);
});
loop((dt) => {
    ctxt.clearRect(0, 0, screensize.x, screensize.y);
    for (var rect of uirectstore.list()) {
        rect.draw(ctxt);
    }
});
function addDemoChildRects(self) {
    for (var i = 0; i < 5; i++) {
        var rect = addUIRect(self.id, false);
        rect.setSize(new Vector(40, 40));
        // rect.addOffsetHandles()
    }
}
function addUIRect(parent, flex) {
    var rect = new UIRect();
    uirectstore.add(rect);
    rect.parent = parent;
    rect.isFlex = flex;
    return rect;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYnMvdmVjdG9yL3ZlY3Rvci50cyIsImxpYnMvdXRpbHMvcm5nLnRzIiwibGlicy91dGlscy9zdG9yZS50cyIsImxpYnMvdXRpbHMvdGFibGUudHMiLCJsaWJzL3V0aWxzL3V0aWxzLnRzIiwibGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJsaWJzL3V0aWxzL2FiaWxpdHkudHMiLCJsaWJzL3V0aWxzL2FuaW0udHMiLCJsaWJzL3JlY3QvcmVjdC50cyIsImxpYnMvZXZlbnQvZXZlbnRxdWV1ZS50cyIsImxpYnMvZXZlbnQvZXZlbnRzeXN0ZW0udHMiLCJ1aVJlY3QudHMiLCJoYW5kbGUudHMiLCJncmFwaC50cyIsImNsaWNrTWFuYWdlci50cyIsIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxNQUFNO0lBR1IsWUFBWSxHQUFHLElBQWE7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDcEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxRQUF3QztRQUN4QyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7WUFDckMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7U0FDeEI7UUFDRCxPQUFPLElBQUksQ0FBQTtJQUNmLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMs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R0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuRSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3ZFLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNwRSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBR3BFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUE7UUFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUMvQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQy9DLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBQyxDQUFD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RyxDQUFDLENBQUMsQ0FBQTtBQUN0SCxVQUFVLENBQUMsUUFBUSxFQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDNUcsVUFBVSxDQUFDLFFBQVEsRUFBQyxjQUFjLENBQUMsS0FBSyxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFFOUcsVUFBVSxDQUFDLFFBQVEsRUFBQyxjQUFjLENBQUMsV0FBVyxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDeEgsVUFBVSxDQUFDLFFBQVEsRUFBQyxjQUFjLENBQUMsV0FBVyxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEgsVUFBVSxDQUFDLFFBQVEsRUFBQyxjQUFjLENBQUMsWUFBWSxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUV0SCwwQkFBMEI7QUFFMUIsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBR2pCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDdkMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEMsQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNSLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUU3QyxLQUFJLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBQztRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2xCO0FBQ0wsQ0FBQyxDQUFDLENBQUE7QUFFRixTQUFTLGlCQUFpQixDQUFDLElBQVc7SUFDbEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBQztRQUNyQixJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxLQUFLLENBQUMsQ0FBQTtRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQy9CLDBCQUEwQjtLQUM3QjtBQUNMLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxNQUFhLEVBQUMsSUFBWTtJQUN6QyxJQUFJLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO0lBQ3ZCLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7SUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7SUFDbEIsT0FBTyxJQUFJLENBQUE7QUFDZixDQUFDIn0=
