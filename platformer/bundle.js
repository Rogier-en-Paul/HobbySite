(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const vector_1 = __importDefault(require("./vector"));
const utils_1 = require("./utils");
class Block {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    static fromSize(pos, size) {
        return new Block(pos, pos.c().add(size));
    }
    getCorner(v) {
        return new vector_1.default(utils_1.lerp(this.min.x, this.max.x, v.x), utils_1.lerp(this.min.y, this.max.y, v.y));
    }
    center() {
        return this.getCorner(new vector_1.default(0.5, 0.5));
    }
    set(v, corner) {
        var displacement = this.getCorner(corner).to(v);
        return this.move(displacement);
    }
    move(v) {
        this.min.add(v);
        this.max.add(v);
        return this;
    }
    size() {
        return this.min.to(this.max);
    }
    draw(ctxt) {
        var size = this.size();
        utils_1.fillRect(ctxt, this.min, size);
    }
    c() {
        return new Block(this.min.c(), this.max.c());
    }
}
exports.Block = Block;
},{"./utils":5,"./vector":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSystem = exports.PEvent = exports.Box = void 0;
class Box {
    constructor() {
        this.beforeChange = new EventSystem();
        this.afterChange = new EventSystem();
    }
    get() {
        return this.value;
    }
    set(val) {
        this.beforeChange.trigger(this.value);
        this.value = val;
        this.afterChange.trigger(this.value);
    }
}
exports.Box = Box;
class PEvent {
    constructor(value) {
        this.value = value;
        this.cbset = new Set();
        this.handled = false;
    }
}
exports.PEvent = PEvent;
class EventSystem {
    constructor() {
        this.listeners = [];
    }
    listen(cb) {
        this.listeners.push(cb);
    }
    trigger(val) {
        this.continue(new PEvent(val));
    }
    continue(e) {
        for (var cb of this.listeners) {
            if (e.cbset.has(cb) == false) {
                e.cbset.add(cb);
                cb(e.value, e);
                if (e.handled) {
                    break;
                }
            }
        }
    }
}
exports.EventSystem = EventSystem;
},{}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const world_1 = require("./world");
const platformController_1 = require("./platformController");
const vector_1 = __importDefault(require("./vector"));
const block_1 = require("./block");
var x = window;
x.keys = utils_1.keys;
// keys['d'] = true
var grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
];
var gridsize = new vector_1.default(grid[0].length, grid.length);
var world = new world_1.World(gridsize, 40);
world.grid = grid;
var platformController = new platformController_1.PlatformController(new world_1.Entity(block_1.Block.fromSize(new vector_1.default(world.tilesize, world.tilesize).mul(new vector_1.default(12, 12)), new vector_1.default(40, 40))), world);
// var topdownController = new TopDownController(new Entity(Block.fromSize(new Vector(world.tilesize,world.tilesize).mul(new Vector(12,12)), new Vector(40,40))),world)
var screensize = gridsize.c().scale(world.tilesize);
var { canvas, ctxt } = utils_1.createCanvas(screensize.x, screensize.y);
// platformController.body.block.set(new Vector(40,40),new Vector(0,0))
// platformController.body.speed = new Vector(0,100)
utils_1.loop((dt) => {
    if (utils_1.keys['p']) {
        utils_1.keys['p'] = false;
        debugger;
    }
    ctxt.clearRect(0, 0, screensize.x, screensize.y);
    dt = utils_1.clamp(dt, 0.005, 0.1);
    world.update(dt);
    world.debugDrawGrid(ctxt);
    world.debugDrawRays(ctxt);
    world.emptyFiredRays();
});
},{"./block":1,"./platformController":4,"./utils":5,"./vector":6,"./world":7}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformController = void 0;
const world_1 = require("./world");
const vector_1 = __importDefault(require("./vector"));
const utils_1 = require("./utils");
class PlatformController {
    constructor(body, world) {
        this.body = body;
        this.world = world;
        this.gravity = new vector_1.default(0, 800);
        this.jumpspeed = 400;
        this.accforce = 3000;
        this.passiveStopForce = 3000;
        this.airaccforce = 1000;
        this.airpassiveStopForce = 350;
        this.jumpMaxAmmo = 1;
        this.jumpAmmo = this.jumpMaxAmmo;
        this.climbforce = 2000;
        this.wallhangResetsJumpAmmo = true;
        this.fallStart = 0;
        world.entities.push(body);
        world.beforeUpdate.listen((dt) => {
            var input = utils_1.get2DMoveInputYflipped();
            this.body.vel.add(this.gravity.c().scale(dt));
            if (utils_1.keys['w'] && this.body.grounded.y == 1) {
                this.jump();
            }
            //move
            if (input.x != 0) {
                var accForce = this.body.grounded.y == 0 ? this.airaccforce : this.accforce;
                this.body.vel.x += input.x * accForce * dt;
                var hanging = this.isHanging();
                if (hanging != 0 && this.body.vel.y > 0) {
                    world_1.applyStoppingForce(this.body.vel, new vector_1.default(0, this.climbforce * dt));
                }
            }
            //passive stop
            if (input.x == 0) {
                var stopstrength = this.body.grounded.y == 0 ? this.airpassiveStopForce : this.passiveStopForce;
                world_1.applyStoppingForce(this.body.vel, new vector_1.default(stopstrength * dt, 0));
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.repeat) {
                return;
            }
            if (e.key == ' ' || e.key == 'w') {
                this.jump();
            }
        });
        world.afterUpdate.listen(() => {
            if (this.body.grounded.y == 1) {
                this.jumpAmmo = this.jumpMaxAmmo;
            }
            if (this.body.grounded.x != 0 && this.wallhangResetsJumpAmmo) {
                this.jumpAmmo = this.jumpMaxAmmo;
            }
        });
    }
    jump() {
        var hanging = this.isHanging();
        var jump = () => {
            if (hanging != 0 && this.body.grounded.y == 0) {
                this.body.vel = new vector_1.default(-hanging, -1).normalize().scale(this.jumpspeed);
            }
            else {
                this.body.vel.y = -this.jumpspeed;
            }
        };
        if (hanging != 0 || this.body.grounded.y == 1) {
            jump();
        }
        else if (this.jumpAmmo > 0) {
            jump();
            this.jumpAmmo--;
        }
    }
    isHanging() {
        var hanging = 0;
        if (this.world.boxCast(this.body.block, 0, 0.01).hit) {
            hanging = 1;
        }
        else if (this.world.boxCast(this.body.block, 0, -0.01).hit) {
            hanging = -1;
        }
        return hanging;
    }
}
exports.PlatformController = PlatformController;
},{"./utils":5,"./vector":6,"./world":7}],5:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.max = exports.min = exports.random = exports.round = exports.ceil = exports.floor = exports.lengthen = exports.clamp = exports.createCanvas = exports.gen2Darray = exports.line = exports.fillRect = exports.swap = exports.lerp = exports.to = exports.inverseLerp = exports.map = exports.inRange = exports.get2DMoveInputYflipped = exports.findbest = exports.findbestIndex = exports.loop = exports.TAU = exports.keys = void 0;
const vector_1 = __importDefault(require("./vector"));
var lastUpdate = Date.now();
var TAU = Math.PI * 2;
exports.TAU = TAU;
function loop(callback) {
    var now = Date.now();
    callback((now - lastUpdate) / 1000);
    lastUpdate = now;
    requestAnimationFrame(() => {
        loop(callback);
    });
}
exports.loop = loop;
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
exports.findbestIndex = findbestIndex;
function findbest(list, evaluator) {
    return list[findbestIndex(list, evaluator)];
}
exports.findbest = findbest;
var keys = {};
exports.keys = keys;
document.addEventListener('keydown', e => {
    keys[e.key] = true;
});
document.addEventListener('keyup', e => {
    keys[e.key] = false;
});
function get2DMoveInputYflipped() {
    var res = new vector_1.default(0, 0);
    if (keys['w']) {
        res.y--;
    }
    if (keys['s']) {
        res.y++;
    }
    if (keys['a']) {
        res.x--;
    }
    if (keys['d']) {
        res.x++;
    }
    return res;
}
exports.get2DMoveInputYflipped = get2DMoveInputYflipped;
function inRange(min, max, v) {
    return v >= min && v <= max;
}
exports.inRange = inRange;
function map(val, from1, from2, to1, to2) {
    return lerp(to1, to2, inverseLerp(val, from1, from2));
}
exports.map = map;
function inverseLerp(val, a, b) {
    return to(a, val) / to(a, b);
}
exports.inverseLerp = inverseLerp;
function to(a, b) {
    return b - a;
}
exports.to = to;
function lerp(a, b, t) {
    return a + to(a, b) * t;
}
exports.lerp = lerp;
function swap(arr, a, b) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}
exports.swap = swap;
function fillRect(ctxt, pos, size) {
    ctxt.fillRect(pos.x, pos.y, size.x, size.y);
}
exports.fillRect = fillRect;
function line(ctxt, origin, destination) {
    ctxt.beginPath();
    var dir = origin.to(destination).normalize().scale(0.5);
    ctxt.moveTo(Math.round(origin.x) + 0.5 - dir.x, Math.round(origin.y) + 0.5 - dir.y);
    ctxt.lineTo(Math.round(destination.x) + 0.5 - dir.x, Math.round(destination.y) + 0.5 - dir.y);
    ctxt.stroke();
}
exports.line = line;
function gen2Darray(size, cb) {
    var res = [];
    var index = new vector_1.default(0, 0);
    for (index.y = 0; index.y < size.y; index.y++) {
        var row = [];
        res.push(row);
        for (index.x = 0; index.x < size.x; index.x++) {
            row.push(cb(index));
        }
    }
    return res;
}
exports.gen2Darray = gen2Darray;
function createCanvas(x, y) {
    var canvas = document.createElement('canvas');
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas);
    var ctxt = canvas.getContext('2d');
    return { ctxt: ctxt, canvas: canvas };
}
exports.createCanvas = createCanvas;
function clamp(val, min, max) {
    return Math.max(Math.min(val, max), min);
}
exports.clamp = clamp;
function lengthen(val, amount) {
    return val + amount * Math.sign(val);
}
exports.lengthen = lengthen;
function floor(val) {
    return Math.floor(val);
}
exports.floor = floor;
function ceil(val) {
    return Math.ceil(val);
}
exports.ceil = ceil;
function round(val) {
    return Math.round(val);
}
exports.round = round;
function random() {
    return Math.random();
}
exports.random = random;
function min(a, b) {
    return Math.min(a, b);
}
exports.min = min;
function max(a, b) {
    return Math.max(a, b);
}
exports.max = max;
},{"./vector":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zero = void 0;
class Vector {
    constructor(x, y, z = 0) {
        this.vals = [];
        this.vals[0] = x;
        this.vals[1] = y;
        this.vals[2] = z;
    }
    add(v) {
        return this.map((val, arr, i) => val + v.vals[i]);
    }
    sub(v) {
        return this.map((val, arr, i) => val - v.vals[i]);
    }
    mul(v) {
        return this.map((val, arr, i) => val * v.vals[i]);
    }
    div(v) {
        return this.map((val, arr, i) => val / v.vals[i]);
    }
    scale(v) {
        return this.map((val, arr, i) => val * v);
    }
    to(v) {
        return v.c().sub(this);
    }
    floor() {
        return this.map((val, arr, i) => Math.floor(val));
    }
    ceil() {
        return this.map((val, arr, i) => Math.ceil(val));
    }
    lerp(v, t) {
        return this.c().add(this.to(v).scale(t));
    }
    lengthsq() {
        var sum = 0;
        for (var i = 0; i < this.vals.length; i++) {
            sum += this.vals[i] * this.vals[i];
        }
        return sum;
    }
    length() {
        return Math.pow(this.lengthsq(), 0.5);
    }
    normalize() {
        return this.scale(1 / this.length());
    }
    c() {
        return new Vector(0, 0).overwrite(this);
    }
    overwrite(v) {
        return this.map((val, arr, i) => v.vals[i]);
    }
    dot(v) {
        var sum = 0;
        for (var i = 0; i < this.vals.length; i++) {
            sum += this.vals[i] * v.vals[i];
        }
        return sum;
    }
    get(i) {
        return this.vals[i];
    }
    set(i, val) {
        this.vals[i] = val;
    }
    cross(v) {
        var x = this.y * v.z - this.z * v.y;
        var y = this.z * v.x - this.x * v.z;
        var z = this.x * v.y - this.y * v.x;
        return new Vector(x, y, z);
    }
    projectOnto(v) {
        return v.c().scale(this.dot(v) / v.dot(v));
    }
    loop2d(cb) {
        var counter = new Vector(0, 0);
        for (counter.x = 0; counter.x < this.x; counter.x++) {
            for (counter.y = 0; counter.y < this.y; counter.y++) {
                cb(counter);
            }
        }
    }
    rotate2d(rotations, origin = new Vector(0, 0)) {
        return this;
    }
    draw(ctxt) {
        return this;
    }
    map(cb) {
        for (var i = 0; i < this.vals.length; i++) {
            this.vals[i] = cb(this.vals[i], this.vals, i);
        }
        return this;
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
}
exports.default = Vector;
exports.zero = new Vector(0, 0);
},{}],7:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTowards = exports.applyStoppingForce = exports.World = exports.RaycastHit = exports.Entity = void 0;
const vector_1 = __importDefault(require("./vector"));
const utils_1 = require("./utils");
const eventsystem_1 = require("./eventsystem");
const block_1 = require("./block");
class Entity {
    constructor(block) {
        this.block = block;
        this.grounded = new vector_1.default(0, 0);
        this.vel = new vector_1.default(0, 0);
        this.minspeed = new vector_1.default(-300, -600);
        this.maxspeed = new vector_1.default(300, 600);
        this.dir = new vector_1.default(1, 0);
    }
}
exports.Entity = Entity;
class RaycastHit {
    constructor(hit, origin, dir, hitLocation, relHitLocation, normal, hitIndex) {
        this.hit = hit;
        this.origin = origin;
        this.dir = dir;
        this.hitLocation = hitLocation;
        this.relHitLocation = relHitLocation;
        this.normal = normal;
        this.hitIndex = hitIndex;
    }
}
exports.RaycastHit = RaycastHit;
class World {
    constructor(gridsize, tilesize) {
        this.gridsize = gridsize;
        this.tilesize = tilesize;
        this.grid = [];
        this.entities = [];
        this.firedRays = [];
        this.beforeUpdate = new eventsystem_1.EventSystem();
        this.afterUpdate = new eventsystem_1.EventSystem();
        this.skinwidth = 0.01;
        this.grid = utils_1.gen2Darray(gridsize, () => 0);
    }
    update(dtseconds) {
        this.beforeUpdate.trigger(dtseconds);
        for (var entity of this.entities) {
            var speed = entity.vel.c().scale(dtseconds);
            //clamp speed
            entity.vel.map((val, arr, i) => {
                return utils_1.clamp(val, entity.minspeed.get(i), entity.maxspeed.get(i));
            });
            this.move(entity, speed);
            if (speed.lengthsq() > 0) {
                entity.dir = speed.c().normalize();
            }
        }
        this.afterUpdate.trigger(dtseconds);
    }
    move(entity, amount) {
        this.moveAxis(entity, 0, amount.x);
        this.moveAxis(entity, 1, amount.y);
    }
    moveAxis(entity, axis, amount) {
        if (amount == 0) {
            return;
        }
        var hit = this.boxCast(entity.block, axis, amount);
        entity.block.move(hit.relHitLocation);
        entity.grounded.vals[axis] = (hit.hit ? 1 : 0) * Math.sign(amount);
        if (hit.hit) {
            entity.vel.vals[axis] = 0;
        }
    }
    boxCast(block, axis, amount, _skinwidth = this.skinwidth) {
        var dir = VFromAxisAmount(axis, amount);
        if (amount == 0) {
            return new RaycastHit(false, block.center(), dir, null, new vector_1.default(0, 0), null, null);
        }
        var skinblock = block.c();
        skinblock.min.add(new vector_1.default(_skinwidth, _skinwidth));
        skinblock.max.sub(new vector_1.default(_skinwidth, _skinwidth));
        var points = this.getPointsOnEdge(skinblock, dir);
        var rays = points.map(point => this.raycastAxisAligned(point, axis, utils_1.lengthen(amount, _skinwidth)));
        var hitray = utils_1.findbest(rays.filter(ray => ray.hit), ray => -ray.relHitLocation.length());
        for (var ray of rays) {
            ray.relHitLocation.vals[axis] = utils_1.lengthen(ray.relHitLocation.vals[axis], -_skinwidth);
            this.firedRays.push(ray);
        }
        return hitray ?? rays[0];
    }
    raycastAxisAligned(originWorld, axis, amount) {
        var dirWorld = VFromAxisAmount(axis, amount);
        var end = originWorld.c().add(dirWorld);
        var boxes2check = utils_1.ceil(Math.abs(amount) / this.tilesize);
        for (var i = 0; i <= boxes2check; i++) {
            var pos = originWorld.lerp(end, i / boxes2check);
            if (this.isBlocked(pos)) {
                return this.rayCast(originWorld, dirWorld, this.getBlock(pos));
            }
        }
        return new RaycastHit(false, originWorld, dirWorld, originWorld.c().add(dirWorld), dirWorld.c(), dirWorld.c().normalize().scale(-1), null);
    }
    rayCast(origin, dir, block) {
        var end = origin.c().add(dir);
        var res = new RaycastHit(false, origin, dir, null, null, null, null);
        var out = [0, 0];
        res.hit = collideLine(origin, origin.c().add(dir), block, out);
        res.hitLocation = origin.lerp(end, out[0]);
        res.relHitLocation = origin.to(res.hitLocation);
        return res;
    }
    getPointsOnEdge(box, dir) {
        var res = [];
        var corners = [
            box.getCorner(new vector_1.default(0, 0)),
            box.getCorner(new vector_1.default(1, 0)),
            box.getCorner(new vector_1.default(1, 1)),
            box.getCorner(new vector_1.default(0, 1)),
        ];
        corners = corners.filter(corner => box.center().to(corner).normalize().dot(dir.c().normalize()) > 0);
        var start = corners[0];
        var end = corners[1];
        var nofpoints = utils_1.ceil(start.to(end).length() / this.tilesize) + 1;
        for (var i = 0; i < nofpoints; i++) {
            res.push(start.lerp(end, (i / (nofpoints - 1))));
        }
        return res;
    }
    emptyFiredRays() {
        this.firedRays = [];
    }
    isBlocked(world) {
        var index = this.world2index(world);
        if (utils_1.inRange(0, this.gridsize.x - 1, index.x) && utils_1.inRange(0, this.gridsize.y - 1, index.y)) {
            return this.grid[index.y][index.x];
        }
        return false;
    }
    isBlockedIndex(index) {
        return this.grid[index.y][index.x];
    }
    getBlock(world) {
        var topleft = this.world2index(world).scale(this.tilesize);
        return block_1.Block.fromSize(topleft, new vector_1.default(this.tilesize, this.tilesize));
    }
    world2index(world) {
        return world.c().div(new vector_1.default(this.tilesize, this.tilesize)).floor();
    }
    index2world(index) {
        return index.c().scale(this.tilesize);
    }
    debugDrawGrid(ctxt) {
        ctxt.fillStyle = 'black';
        this.gridsize.loop2d(i => {
            if (this.isBlockedIndex(i)) {
                this.getBlock(this.index2world(i)).draw(ctxt);
            }
        });
        ctxt.fillStyle = 'grey';
        for (var entity of this.entities) {
            entity.block.draw(ctxt);
        }
    }
    debugDrawRays(ctxt) {
        for (var ray of this.firedRays) {
            if (ray.hit) {
                ctxt.strokeStyle = 'red';
            }
            else {
                ctxt.strokeStyle = 'blue';
            }
            var dir = ray.dir.c().normalize();
            utils_1.line(ctxt, ray.origin, ray.origin.c().add(dir.scale(10)));
        }
    }
}
exports.World = World;
function VFromAxisAmount(axis, amount) {
    var v = new vector_1.default(0, 0);
    v.vals[axis] = amount;
    return v;
}
function collideLine(a, b, box, out) {
    var clip1 = [0, 0];
    var clip2 = [0, 0];
    relIntersect(a.x, b.x, box.min.x, box.max.x, clip1);
    relIntersect(a.y, b.y, box.min.y, box.max.y, clip2);
    //result contains if the lines intersected
    var result = intersectLine(clip1[0], clip1[1], clip2[0], clip2[1], out);
    return result && utils_1.inRange(0, 1, out[0]); // && inRange(0,1,out[1])
}
function relIntersect(amin, amax, bmin, bmax, out) {
    if (amin == amax) { //this could use some work
        out[0] = -Infinity;
        out[1] = Infinity;
        return;
    }
    var length = Math.abs(utils_1.to(amin, amax));
    out[0] = Math.abs(utils_1.to(amin, bmin)) / length;
    out[1] = Math.abs(utils_1.to(amin, bmax)) / length;
    if (amin > amax) {
        utils_1.swap(out, 0, 1);
    }
}
function intersectLine(amin, amax, bmin, bmax, out) {
    var ibegin = Math.max(amin, bmin);
    var iend = Math.min(amax, bmax);
    out[0] = ibegin;
    out[1] = iend;
    if (ibegin <= iend) {
        return true;
    }
    else {
        return false;
    }
}
function applyStoppingForce(vel, dtforce) {
    vel.x = moveTowards(vel.x, 0, dtforce.x);
    vel.y = moveTowards(vel.y, 0, dtforce.y);
}
exports.applyStoppingForce = applyStoppingForce;
function moveTowards(cur, destination, maxamount) {
    var dir = utils_1.to(cur, destination);
    if (Math.abs(dir) <= maxamount) {
        return destination;
    }
    else {
        return cur + Math.sign(dir) * maxamount;
    }
}
exports.moveTowards = moveTowards;
},{"./block":1,"./eventsystem":2,"./utils":5,"./vector":6}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJibG9jay50cyIsImV2ZW50c3lzdGVtLnRzIiwibWFpbi50cyIsInBsYXRmb3JtQ29udHJvbGxlci50cyIsInV0aWxzLnRzIiwidmVjdG9yLnRzIiwid29ybGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxzREFBNkI7QUFDN0IsbUNBQXdDO0FBRXhDLE1BQWEsS0FBSztJQUNkLFlBQW1CLEdBQVUsRUFBUyxHQUFVO1FBQTdCLFFBQUcsR0FBSCxHQUFHLENBQU87UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFPO0lBRWhELENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQVUsRUFBQyxJQUFXO1FBQ2xDLE9BQU8sSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBRUQsU0FBUyxDQUFDLENBQVE7UUFDZCxPQUFPLElBQUksZ0JBQU0sQ0FDYixZQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUMvQixZQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNsQyxDQUFBO0lBQ0wsQ0FBQztJQUVELE1BQU07UUFDRixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxnQkFBTSxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQzlDLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUSxFQUFDLE1BQWE7UUFDdEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FB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QUE7QUFDYixtQkFBbUI7QUFDbkIsSUFBSSxJQUFJLEdBQUc7SUFDUCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFB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QUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxLQUFLLENBQUMsQ0FBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFRO1FBQ1AsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRCxLQUFLO1FBQ0Qs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RyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQTtLQUMxQztBQUNMLENBQUM7QUFQRCxrQ0FPQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBWZWN0b3IgZnJvbSBcIi4vdmVjdG9yXCJcclxuaW1wb3J0IHsgbGVycCwgZmlsbFJlY3QgfSBmcm9tIFwiLi91dGlsc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgQmxvY2t7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluOlZlY3RvciwgcHVibGljIG1heDpWZWN0b3Ipe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbVNpemUocG9zOlZlY3RvcixzaXplOlZlY3Rvcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9jayhwb3MscG9zLmMoKS5hZGQoc2l6ZSkpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29ybmVyKHY6VmVjdG9yKTpWZWN0b3J7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IoXHJcbiAgICAgICAgICAgIGxlcnAodGhpcy5taW4ueCx0aGlzLm1heC54LHYueCksXHJcbiAgICAgICAgICAgIGxlcnAodGhpcy5taW4ueSx0aGlzLm1heC55LHYueSksXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNlbnRlcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldENvcm5lcihuZXcgVmVjdG9yKDAuNSwwLjUpKVxyXG4gICAgfVxyXG5cclxuICAgIHNldCh2OlZlY3Rvcixjb3JuZXI6VmVjdG9yKXtcclxuICAgICAgICB2YXIgZGlzcGxhY2VtZW50ID0gdGhpcy5nZXRDb3JuZXIoY29ybmVyKS50byh2KVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1vdmUoZGlzcGxhY2VtZW50KVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIG1vdmUodjpWZWN0b3Ipe1xyXG4gICAgICAgIHRoaXMubWluLmFkZCh2KVxyXG4gICAgICAgIHRoaXMubWF4LmFkZCh2KVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgc2l6ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1pbi50byh0aGlzLm1heClcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKXtcclxuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZSgpXHJcbiAgICAgICAgZmlsbFJlY3QoY3R4dCx0aGlzLm1pbixzaXplKVxyXG4gICAgfVxyXG5cclxuICAgIGMoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEJsb2NrKHRoaXMubWluLmMoKSx0aGlzLm1heC5jKCkpXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQm94PFQ+e1xyXG4gICAgdmFsdWU6VFxyXG4gICAgYmVmb3JlQ2hhbmdlOkV2ZW50U3lzdGVtPFQ+ID0gbmV3IEV2ZW50U3lzdGVtKClcclxuICAgIGFmdGVyQ2hhbmdlOkV2ZW50U3lzdGVtPFQ+ID0gbmV3IEV2ZW50U3lzdGVtKClcclxuXHJcbiAgICBnZXQoKTpUe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgc2V0KHZhbDpUKXtcclxuICAgICAgICB0aGlzLmJlZm9yZUNoYW5nZS50cmlnZ2VyKHRoaXMudmFsdWUpXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbFxyXG4gICAgICAgIHRoaXMuYWZ0ZXJDaGFuZ2UudHJpZ2dlcih0aGlzLnZhbHVlKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUEV2ZW50PFQ+e1xyXG4gICAgY2JzZXQ6U2V0PEV2ZW50TGlzdGVuZXI8VD4+ID0gbmV3IFNldCgpXHJcbiAgICBoYW5kbGVkOmJvb2xlYW4gPSBmYWxzZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTpUKXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRXZlbnRMaXN0ZW5lcjxUPiA9ICh2YWw6VCxlOlBFdmVudDxUPikgPT4gdm9pZFxyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50U3lzdGVtPFQ+e1xyXG4gICAgbGlzdGVuZXJzOkV2ZW50TGlzdGVuZXI8VD5bXSA9IFtdXHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbGlzdGVuKGNiOkV2ZW50TGlzdGVuZXI8VD4pe1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goY2IpXHJcbiAgICB9XHJcblxyXG4gICAgdHJpZ2dlcih2YWw6VCl7XHJcbiAgICAgICAgdGhpcy5jb250aW51ZShuZXcgUEV2ZW50KHZhbCkpIFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnRpbnVlKGU6UEV2ZW50PFQ+KXtcclxuICAgICAgICBmb3IgKHZhciBjYiBvZiB0aGlzLmxpc3RlbmVycykge1xyXG4gICAgICAgICAgICBpZihlLmNic2V0LmhhcyhjYikgPT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgZS5jYnNldC5hZGQoY2IpXHJcbiAgICAgICAgICAgICAgICBjYihlLnZhbHVlLGUpXHJcbiAgICAgICAgICAgICAgICBpZihlLmhhbmRsZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge2xvb3AsIGNyZWF0ZUNhbnZhcywgY2xhbXAsIGtleXN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7V29ybGQsIEVudGl0eX0gZnJvbSAnLi93b3JsZCdcclxuaW1wb3J0IHsgUGxhdGZvcm1Db250cm9sbGVyIH0gZnJvbSAnLi9wbGF0Zm9ybUNvbnRyb2xsZXInXHJcbmltcG9ydCBWZWN0b3IgZnJvbSAnLi92ZWN0b3InXHJcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi9ibG9jaydcclxuaW1wb3J0IHsgVG9wRG93bkNvbnRyb2xsZXIgfSBmcm9tICcuL3RvcGRvd25Db250cm9sbGVyJ1xyXG5cclxudmFyIHggPSB3aW5kb3cgYXMgYW55XHJcbngua2V5cyA9IGtleXNcclxuLy8ga2V5c1snZCddID0gdHJ1ZVxyXG52YXIgZ3JpZCA9IFtcclxuICAgIFswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwxLDBdLFxyXG4gICAgWzAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMF0sXHJcbiAgICBbMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwXSxcclxuICAgIFswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwxLDBdLFxyXG4gICAgWzAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDEsMF0sXHJcbiAgICBbMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMSwwXSxcclxuICAgIFswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwxLDBdLFxyXG4gICAgWzAsMCwwLDAsMCwwLDAsMCwxLDAsMCwwLDAsMCwwLDEsMCwwLDEsMF0sXHJcbiAgICBbMCwwLDAsMSwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMSwwLDAsMSwwXSxcclxuICAgIFswLDAsMCwxLDEsMCwwLDAsMCwwLDAsMCwwLDAsMCwxLDAsMCwxLDBdLFxyXG4gICAgWzAsMCwwLDEsMSwxLDAsMCwwLDAsMCwwLDAsMCwwLDEsMCwwLDEsMF0sXHJcbiAgICBbMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMSwwXSxcclxuICAgIFsxLDAsMCwwLDAsMCwwLDAsMCwxLDAsMCwwLDAsMCwwLDAsMCwxLDBdLFxyXG4gICAgWzEsMCwwLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwwLDEsMF0sXHJcbiAgICBbMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMSwwXSxcclxuICAgIFswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwxLDBdLFxyXG4gICAgWzAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDEsMF0sXHJcbiAgICBbMSwwLDEsMCwwLDAsMCwwLDEsMCwwLDAsMCwxLDAsMCwwLDEsMSwxXSxcclxuXVxyXG52YXIgZ3JpZHNpemUgPSBuZXcgVmVjdG9yKGdyaWRbMF0ubGVuZ3RoLGdyaWQubGVuZ3RoKVxyXG52YXIgd29ybGQgPSBuZXcgV29ybGQoZ3JpZHNpemUsNDApXHJcbndvcmxkLmdyaWQgPSBncmlkXHJcbnZhciBwbGF0Zm9ybUNvbnRyb2xsZXIgPSBuZXcgUGxhdGZvcm1Db250cm9sbGVyKG5ldyBFbnRpdHkoQmxvY2suZnJvbVNpemUobmV3IFZlY3Rvcih3b3JsZC50aWxlc2l6ZSx3b3JsZC50aWxlc2l6ZSkubXVsKG5ldyBWZWN0b3IoMTIsMTIpKSwgbmV3IFZlY3Rvcig0MCw0MCkpKSx3b3JsZClcclxuLy8gdmFyIHRvcGRvd25Db250cm9sbGVyID0gbmV3IFRvcERvd25Db250cm9sbGVyKG5ldyBFbnRpdHkoQmxvY2suZnJvbVNpemUobmV3IFZlY3Rvcih3b3JsZC50aWxlc2l6ZSx3b3JsZC50aWxlc2l6ZSkubXVsKG5ldyBWZWN0b3IoMTIsMTIpKSwgbmV3IFZlY3Rvcig0MCw0MCkpKSx3b3JsZClcclxudmFyIHNjcmVlbnNpemUgPSBncmlkc2l6ZS5jKCkuc2NhbGUod29ybGQudGlsZXNpemUpXHJcbnZhciB7Y2FudmFzLGN0eHR9ID0gY3JlYXRlQ2FudmFzKHNjcmVlbnNpemUueCxzY3JlZW5zaXplLnkpXHJcbi8vIHBsYXRmb3JtQ29udHJvbGxlci5ib2R5LmJsb2NrLnNldChuZXcgVmVjdG9yKDQwLDQwKSxuZXcgVmVjdG9yKDAsMCkpXHJcbi8vIHBsYXRmb3JtQ29udHJvbGxlci5ib2R5LnNwZWVkID0gbmV3IFZlY3RvcigwLDEwMClcclxuXHJcbmxvb3AoKGR0KSA9PiB7XHJcbiAgICBpZihrZXlzWydwJ10pe1xyXG4gICAgICAgIGtleXNbJ3AnXSA9IGZhbHNlXHJcbiAgICAgICAgZGVidWdnZXJcclxuICAgIH1cclxuICAgIGN0eHQuY2xlYXJSZWN0KDAsMCxzY3JlZW5zaXplLngsc2NyZWVuc2l6ZS55KVxyXG5cclxuICAgIGR0ID0gY2xhbXAoZHQsMC4wMDUsMC4xKVxyXG4gICAgd29ybGQudXBkYXRlKGR0KVxyXG4gICAgXHJcbiAgICB3b3JsZC5kZWJ1Z0RyYXdHcmlkKGN0eHQpXHJcbiAgICB3b3JsZC5kZWJ1Z0RyYXdSYXlzKGN0eHQpXHJcbiAgICB3b3JsZC5lbXB0eUZpcmVkUmF5cygpXHJcblxyXG59KVxyXG5cclxuIiwiaW1wb3J0IHsgIFdvcmxkLCBFbnRpdHksIGFwcGx5U3RvcHBpbmdGb3JjZSB9IGZyb20gXCIuL3dvcmxkXCI7XHJcbmltcG9ydCBWZWN0b3IgZnJvbSBcIi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IGdldDJETW92ZUlucHV0WWZsaXBwZWQsIGtleXMsIGNsYW1wLCB0byB9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxhdGZvcm1Db250cm9sbGVye1xyXG4gICAgZ3Jhdml0eTpWZWN0b3IgPSBuZXcgVmVjdG9yKDAsODAwKVxyXG4gICAganVtcHNwZWVkOm51bWJlciA9IDQwMFxyXG4gICAgXHJcbiAgICBhY2Nmb3JjZSA9IDMwMDBcclxuICAgIHBhc3NpdmVTdG9wRm9yY2UgPSAzMDAwXHJcbiAgICBhaXJhY2Nmb3JjZSA9IDEwMDBcclxuICAgIGFpcnBhc3NpdmVTdG9wRm9yY2UgPSAzNTBcclxuICAgIFxyXG4gICAganVtcE1heEFtbW8gPSAxXHJcbiAgICBqdW1wQW1tbyA9IHRoaXMuanVtcE1heEFtbW9cclxuICAgIGNsaW1iZm9yY2UgPSAyMDAwXHJcbiAgICB3YWxsaGFuZ1Jlc2V0c0p1bXBBbW1vID0gdHJ1ZVxyXG4gICAgZmFsbFN0YXJ0ID0gMFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBib2R5OkVudGl0eSxwdWJsaWMgIHdvcmxkOldvcmxkKXtcclxuICAgICAgICB3b3JsZC5lbnRpdGllcy5wdXNoKGJvZHkpXHJcblxyXG4gICAgICAgIHdvcmxkLmJlZm9yZVVwZGF0ZS5saXN0ZW4oKGR0KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IGdldDJETW92ZUlucHV0WWZsaXBwZWQoKVxyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuYm9keS52ZWwuYWRkKHRoaXMuZ3Jhdml0eS5jKCkuc2NhbGUoZHQpKVxyXG4gICAgICAgICAgICBpZihrZXlzWyd3J10gJiYgdGhpcy5ib2R5Lmdyb3VuZGVkLnkgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmp1bXAoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vbW92ZVxyXG4gICAgICAgICAgICBpZihpbnB1dC54ICE9IDApe1xyXG4gICAgICAgICAgICAgICAgdmFyIGFjY0ZvcmNlID0gdGhpcy5ib2R5Lmdyb3VuZGVkLnkgPT0gMCA/IHRoaXMuYWlyYWNjZm9yY2UgOiB0aGlzLmFjY2ZvcmNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsLnggKz0gaW5wdXQueCAqIGFjY0ZvcmNlICogZHRcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZ2luZyA9IHRoaXMuaXNIYW5naW5nKClcclxuICAgICAgICAgICAgICAgIGlmKGhhbmdpbmcgIT0gMCAmJiB0aGlzLmJvZHkudmVsLnkgPiAwKXtcclxuICAgICAgICAgICAgICAgICAgICBhcHBseVN0b3BwaW5nRm9yY2UodGhpcy5ib2R5LnZlbCxuZXcgVmVjdG9yKDAsdGhpcy5jbGltYmZvcmNlICogZHQpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vcGFzc2l2ZSBzdG9wXHJcbiAgICAgICAgICAgIGlmKGlucHV0LnggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RvcHN0cmVuZ3RoID0gdGhpcy5ib2R5Lmdyb3VuZGVkLnkgPT0gMCA/IHRoaXMuYWlycGFzc2l2ZVN0b3BGb3JjZSA6IHRoaXMucGFzc2l2ZVN0b3BGb3JjZVxyXG4gICAgICAgICAgICAgICAgYXBwbHlTdG9wcGluZ0ZvcmNlKHRoaXMuYm9keS52ZWwsbmV3IFZlY3RvcihzdG9wc3RyZW5ndGggKiBkdCwwKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZihlLnJlcGVhdCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihlLmtleSA9PSAnICcgfHwgZS5rZXkgPT0gJ3cnKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuanVtcCgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB3b3JsZC5hZnRlclVwZGF0ZS5saXN0ZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLmJvZHkuZ3JvdW5kZWQueSA9PSAxKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuanVtcEFtbW8gPSB0aGlzLmp1bXBNYXhBbW1vXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy5ib2R5Lmdyb3VuZGVkLnggIT0gMCAmJiB0aGlzLndhbGxoYW5nUmVzZXRzSnVtcEFtbW8pe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qdW1wQW1tbyA9IHRoaXMuanVtcE1heEFtbW9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG4gICAgXHJcbiAgICBqdW1wKCl7XHJcbiAgICAgICAgdmFyIGhhbmdpbmcgPSB0aGlzLmlzSGFuZ2luZygpXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGp1bXAgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGhhbmdpbmcgIT0gMCAmJiB0aGlzLmJvZHkuZ3JvdW5kZWQueSA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWwgPSBuZXcgVmVjdG9yKC1oYW5naW5nLC0xKS5ub3JtYWxpemUoKS5zY2FsZSh0aGlzLmp1bXBzcGVlZClcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsLnkgPSAtdGhpcy5qdW1wc3BlZWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaGFuZ2luZyAhPSAwIHx8IHRoaXMuYm9keS5ncm91bmRlZC55ID09IDEpe1xyXG4gICAgICAgICAgICBqdW1wKClcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLmp1bXBBbW1vID4gMCl7XHJcbiAgICAgICAgICAgIGp1bXAoKVxyXG4gICAgICAgICAgICB0aGlzLmp1bXBBbW1vLS1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlzSGFuZ2luZygpOm51bWJlcntcclxuICAgICAgICB2YXIgaGFuZ2luZyA9IDBcclxuICAgICAgICBpZih0aGlzLndvcmxkLmJveENhc3QodGhpcy5ib2R5LmJsb2NrLDAsMC4wMSkuaGl0KXtcclxuICAgICAgICAgICAgaGFuZ2luZyA9IDFcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLndvcmxkLmJveENhc3QodGhpcy5ib2R5LmJsb2NrLDAsLTAuMDEpLmhpdCl7XHJcbiAgICAgICAgICAgIGhhbmdpbmcgPSAtMVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGFuZ2luZ1xyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJpbXBvcnQgVmVjdG9yIGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxudmFyIGxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG52YXIgVEFVID0gTWF0aC5QSSAqIDJcclxuZXhwb3J0IHtcclxuICAgIGtleXMsXHJcbiAgICBUQVUsXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb29wKGNhbGxiYWNrOihkdHNlY29uZHM6bnVtYmVyKSA9PiB2b2lkKXtcclxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpXHJcbiAgICBjYWxsYmFjaygobm93IC0gbGFzdFVwZGF0ZSkgLyAxMDAwKVxyXG4gICAgbGFzdFVwZGF0ZSA9IG5vd1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBsb29wKGNhbGxiYWNrKVxyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRiZXN0SW5kZXg8VD4obGlzdDpUW10sIGV2YWx1YXRvcjoodjpUKSA9PiBudW1iZXIpOm51bWJlciB7XHJcbiAgICBpZiAobGlzdC5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG4gICAgdmFyIGJlc3RJbmRleCA9IDA7XHJcbiAgICB2YXIgYmVzdHNjb3JlID0gZXZhbHVhdG9yKGxpc3RbMF0pXHJcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgc2NvcmUgPSBldmFsdWF0b3IobGlzdFtpXSlcclxuICAgICAgICBpZiAoc2NvcmUgPiBiZXN0c2NvcmUpIHtcclxuICAgICAgICAgICAgYmVzdHNjb3JlID0gc2NvcmVcclxuICAgICAgICAgICAgYmVzdEluZGV4ID0gaVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBiZXN0SW5kZXhcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRiZXN0PFQ+KGxpc3Q6VFtdLCBldmFsdWF0b3I6KHY6VCkgPT4gbnVtYmVyKTpUIHtcclxuICAgIHJldHVybiBsaXN0W2ZpbmRiZXN0SW5kZXgobGlzdCxldmFsdWF0b3IpXVxyXG59XHJcbnZhciBrZXlzID0ge31cclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XHJcbiAgICBrZXlzW2Uua2V5XSA9IHRydWVcclxufSlcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZSA9PiB7XHJcbiAgICBrZXlzW2Uua2V5XSA9IGZhbHNlICBcclxufSlcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQyRE1vdmVJbnB1dFlmbGlwcGVkKCl7XHJcbiAgICB2YXIgcmVzID0gbmV3IFZlY3RvcigwLDApXHJcbiAgICBpZihrZXlzWyd3J10pe1xyXG4gICAgICAgIHJlcy55LS1cclxuICAgIH1cclxuICAgIGlmKGtleXNbJ3MnXSl7XHJcbiAgICAgICAgcmVzLnkrK1xyXG4gICAgfVxyXG4gICAgaWYoa2V5c1snYSddKXtcclxuICAgICAgICByZXMueC0tXHJcbiAgICB9XHJcbiAgICBpZihrZXlzWydkJ10pe1xyXG4gICAgICAgIHJlcy54KytcclxuICAgIH1cclxuICAgIHJldHVybiByZXNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluUmFuZ2UobWluLG1heCx2KXtcclxuICAgIHJldHVybiB2ID49IG1pbiAmJiB2IDw9IG1heFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFwKHZhbDpudW1iZXIsZnJvbTE6bnVtYmVyLGZyb20yOm51bWJlcix0bzE6bnVtYmVyLHRvMjpudW1iZXIpOm51bWJlcntcclxuICAgIHJldHVybiBsZXJwKHRvMSx0bzIsaW52ZXJzZUxlcnAodmFsLGZyb20xLGZyb20yKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2VMZXJwKHZhbDpudW1iZXIsYTpudW1iZXIsYjpudW1iZXIpOm51bWJlcntcclxuICAgIHJldHVybiB0byhhLHZhbCkgLyB0byhhLGIpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0byhhOm51bWJlcixiOm51bWJlcil7XHJcbiAgICByZXR1cm4gYiAtIGFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxlcnAoYTpudW1iZXIsYjpudW1iZXIsdDpudW1iZXIpe1xyXG4gICAgcmV0dXJuIGEgKyB0byhhLGIpICogdFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3dhcChhcnIsYSxiKXtcclxuICAgIHZhciB0ZW1wID0gYXJyW2FdXHJcbiAgICBhcnJbYV0gPSBhcnJbYl1cclxuICAgIGFycltiXSA9IHRlbXBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxSZWN0KGN0eHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJELHBvczpWZWN0b3Isc2l6ZTpWZWN0b3Ipe1xyXG4gICAgY3R4dC5maWxsUmVjdChwb3MueCwgcG9zLnksIHNpemUueCwgc2l6ZS55KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGluZShjdHh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxvcmlnaW46VmVjdG9yLGRlc3RpbmF0aW9uOlZlY3Rvcil7XHJcbiAgICBjdHh0LmJlZ2luUGF0aCgpXHJcbiAgICB2YXIgZGlyID0gb3JpZ2luLnRvKGRlc3RpbmF0aW9uKS5ub3JtYWxpemUoKS5zY2FsZSgwLjUpXHJcbiAgICBjdHh0Lm1vdmVUbyhNYXRoLnJvdW5kKG9yaWdpbi54KSArIDAuNSAtIGRpci54LE1hdGgucm91bmQob3JpZ2luLnkpICsgMC41IC0gZGlyLnkpXHJcbiAgICBjdHh0LmxpbmVUbyhNYXRoLnJvdW5kKGRlc3RpbmF0aW9uLngpICsgMC41ICAtIGRpci54LE1hdGgucm91bmQoZGVzdGluYXRpb24ueSkgKyAwLjUgLSBkaXIueSlcclxuICAgIGN0eHQuc3Ryb2tlKClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbjJEYXJyYXk8VD4oc2l6ZTpWZWN0b3IsY2I6KGk6VmVjdG9yKSA9PiBUKTpUW11bXXtcclxuICAgIHZhciByZXM6VFtdW10gPSBbXVxyXG4gICAgdmFyIGluZGV4ID0gbmV3IFZlY3RvcigwLDApXHJcbiAgICBmb3IoaW5kZXgueSA9IDA7IGluZGV4LnkgPCBzaXplLnk7IGluZGV4LnkrKyl7XHJcbiAgICAgICAgdmFyIHJvdzpUW10gPSBbXVxyXG4gICAgICAgIHJlcy5wdXNoKHJvdylcclxuICAgICAgICBmb3IoaW5kZXgueCA9IDA7IGluZGV4LnggPCBzaXplLng7IGluZGV4LngrKyl7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKGNiKGluZGV4KSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDYW52YXMoeDogbnVtYmVyLCB5OiBudW1iZXIpe1xyXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXHJcbiAgICBjYW52YXMud2lkdGggPSB4O1xyXG4gICAgY2FudmFzLmhlaWdodCA9IHk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcylcclxuICAgIHZhciBjdHh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuICAgIHJldHVybiB7Y3R4dDpjdHh0LGNhbnZhczpjYW52YXN9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAodmFsLG1pbixtYXgpe1xyXG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHZhbCxtYXgpLG1pbilcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxlbmd0aGVuKHZhbCxhbW91bnQpe1xyXG4gICAgcmV0dXJuIHZhbCArIGFtb3VudCAqIE1hdGguc2lnbih2YWwpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9vcih2YWwpe1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IodmFsKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2VpbCh2YWwpe1xyXG4gICAgcmV0dXJuIE1hdGguY2VpbCh2YWwpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb3VuZCh2YWwpe1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQodmFsKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tKCl7XHJcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWluKGEsYil7XHJcbiAgICByZXR1cm4gTWF0aC5taW4oYSxiKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF4KGEsYil7XHJcbiAgICByZXR1cm4gTWF0aC5tYXgoYSxiKVxyXG59XHJcblxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3J7XHJcbiAgICB2YWxzOm51bWJlcltdID0gW11cclxuICAgIGNvbnN0cnVjdG9yKHgsIHksIHogPSAwKXtcclxuICAgICAgICB0aGlzLnZhbHNbMF0gPSB4XHJcbiAgICAgICAgdGhpcy52YWxzWzFdID0geVxyXG4gICAgICAgIHRoaXMudmFsc1syXSA9IHpcclxuICAgIH1cclxuXHJcbiAgICBhZGQodjpWZWN0b3IpOlZlY3RvcntcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAoKHZhbCxhcnIsaSkgPT4gdmFsICsgdi52YWxzW2ldKVxyXG4gICAgfVxyXG5cclxuICAgIHN1Yih2OlZlY3Rvcik6VmVjdG9ye1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCgodmFsLGFycixpKSA9PiB2YWwgLSB2LnZhbHNbaV0pXHJcbiAgICB9XHJcblxyXG4gICAgbXVsKHY6VmVjdG9yKTpWZWN0b3J7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKCh2YWwsYXJyLGkpID0+IHZhbCAqIHYudmFsc1tpXSlcclxuICAgIH1cclxuXHJcbiAgICBkaXYodjpWZWN0b3IpOlZlY3RvcntcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAoKHZhbCxhcnIsaSkgPT4gdmFsIC8gdi52YWxzW2ldKVxyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlKHY6bnVtYmVyKTpWZWN0b3J7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKCh2YWwsYXJyLGkpID0+IHZhbCAqIHYpXHJcbiAgICB9XHJcblxyXG4gICAgdG8odjpWZWN0b3IpOlZlY3RvcntcclxuICAgICAgICByZXR1cm4gdi5jKCkuc3ViKHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgZmxvb3IoKTpWZWN0b3J7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKCh2YWwsYXJyLGkpID0+IE1hdGguZmxvb3IodmFsKSlcclxuICAgIH1cclxuXHJcbiAgICBjZWlsKCk6VmVjdG9ye1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCgodmFsLGFycixpKSA9PiBNYXRoLmNlaWwodmFsKSlcclxuICAgIH1cclxuXHJcbiAgICBsZXJwKHY6VmVjdG9yLHQ6bnVtYmVyKTpWZWN0b3J7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYygpLmFkZCh0aGlzLnRvKHYpLnNjYWxlKHQpKVxyXG4gICAgfVxyXG5cclxuICAgIGxlbmd0aHNxKCk6bnVtYmVye1xyXG4gICAgICAgIHZhciBzdW0gPSAwO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnZhbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBzdW0gKz0gdGhpcy52YWxzW2ldICogdGhpcy52YWxzW2ldXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdW1cclxuICAgIH1cclxuXHJcbiAgICBsZW5ndGgoKTpudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHRoaXMubGVuZ3Roc3EoKSwwLjUpXHJcbiAgICB9XHJcblxyXG4gICAgbm9ybWFsaXplKCk6VmVjdG9ye1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlKDEgLyB0aGlzLmxlbmd0aCgpKVxyXG4gICAgfVxyXG5cclxuICAgIGMoKTpWZWN0b3J7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IoMCwwKS5vdmVyd3JpdGUodGhpcylcclxuICAgIH1cclxuXHJcbiAgICBvdmVyd3JpdGUodjpWZWN0b3Ipe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCgodmFsLGFycixpKSA9PiB2LnZhbHNbaV0pXHJcbiAgICB9XHJcblxyXG4gICAgZG90KHY6VmVjdG9yKTpudW1iZXJ7XHJcbiAgICAgICAgdmFyIHN1bSA9IDBcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy52YWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgc3VtICs9IHRoaXMudmFsc1tpXSAqIHYudmFsc1tpXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3VtXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGk6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWxzW2ldXHJcbiAgICB9XHJcblxyXG4gICAgc2V0KGk6bnVtYmVyLHZhbDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMudmFsc1tpXSA9IHZhbFxyXG4gICAgfVxyXG5cclxuICAgIGNyb3NzKHY6VmVjdG9yKTpWZWN0b3J7XHJcbiAgICAgICAgdmFyIHggPSB0aGlzLnkgKiB2LnogLSB0aGlzLnogKiB2LnlcclxuICAgICAgICB2YXIgeSA9IHRoaXMueiAqIHYueCAtIHRoaXMueCAqIHYuelxyXG4gICAgICAgIHZhciB6ID0gdGhpcy54ICogdi55IC0gdGhpcy55ICogdi54XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IoeCx5LHopXHJcbiAgICB9XHJcblxyXG4gICAgcHJvamVjdE9udG8odjpWZWN0b3IpOlZlY3RvcntcclxuICAgICAgICByZXR1cm4gdi5jKCkuc2NhbGUodGhpcy5kb3QodikgLyB2LmRvdCh2KSkgIFxyXG4gICAgfVxyXG5cclxuICAgIGxvb3AyZChjYjooaTpWZWN0b3IpID0+IHZvaWQpe1xyXG4gICAgICAgIHZhciBjb3VudGVyID0gbmV3IFZlY3RvcigwLDApXHJcbiAgICAgICAgZm9yKGNvdW50ZXIueCA9IDA7IGNvdW50ZXIueCA8IHRoaXMueDsgY291bnRlci54Kyspe1xyXG4gICAgICAgICAgICBmb3IoY291bnRlci55ID0gMDsgY291bnRlci55IDwgdGhpcy55OyBjb3VudGVyLnkrKyl7XHJcbiAgICAgICAgICAgICAgICBjYihjb3VudGVyKVxyXG4gICAgICAgICAgICB9ICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZTJkKHJvdGF0aW9uczpudW1iZXIsb3JpZ2luOlZlY3RvciA9IG5ldyBWZWN0b3IoMCwwKSk6VmVjdG9ye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOlZlY3RvcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBtYXAoY2I6KHZhbCxhcnJheSxpKSA9PiBudW1iZXIpOlZlY3RvcntcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy52YWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgIHRoaXMudmFsc1tpXSA9IGNiKHRoaXMudmFsc1tpXSx0aGlzLnZhbHMsaSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHNbMF1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgeSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHNbMV1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgeigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHNbMl1cclxuICAgIH1cclxuXHJcbiAgICBzZXQgeCh2YWwpe1xyXG4gICAgICAgIHRoaXMudmFsc1swXSA9IHZhbFxyXG4gICAgfVxyXG5cclxuICAgIHNldCB5KHZhbCl7XHJcbiAgICAgICAgdGhpcy52YWxzWzFdID0gdmFsXHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHoodmFsKXtcclxuICAgICAgICB0aGlzLnZhbHNbMl0gPSB2YWxcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciB6ZXJvID0gbmV3IFZlY3RvcigwLDApOyIsImltcG9ydCBWZWN0b3IgZnJvbSAnLi92ZWN0b3InXHJcbmltcG9ydCB7IGludmVyc2VMZXJwLCBmaW5kYmVzdCwgaW5SYW5nZSwgdG8sIHN3YXAsIGZpbmRiZXN0SW5kZXgsIGxpbmUsIGdlbjJEYXJyYXksIGxlcnAsIGxlbmd0aGVuLCBjbGFtcCwgY2VpbCB9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7IEV2ZW50U3lzdGVtIH0gZnJvbSAnLi9ldmVudHN5c3RlbSdcclxuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuL2Jsb2NrJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHl7XHJcbiAgICBncm91bmRlZDpWZWN0b3IgPSBuZXcgVmVjdG9yKDAsMClcclxuICAgIHZlbDpWZWN0b3IgPSBuZXcgVmVjdG9yKDAsMClcclxuICAgIG1pbnNwZWVkOlZlY3RvciA9IG5ldyBWZWN0b3IoLTMwMCwtNjAwKVxyXG4gICAgbWF4c3BlZWQ6VmVjdG9yID0gbmV3IFZlY3RvcigzMDAsNjAwKVxyXG4gICAgZGlyOlZlY3RvciA9IG5ldyBWZWN0b3IoMSwwKVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBibG9jazpCbG9jayl7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmF5Y2FzdEhpdHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgaGl0OmJvb2xlYW4sXHJcbiAgICAgICAgcHVibGljIG9yaWdpbjpWZWN0b3IsXHJcbiAgICAgICAgcHVibGljIGRpcjpWZWN0b3IsXHJcbiAgICAgICAgcHVibGljIGhpdExvY2F0aW9uOlZlY3RvcixcclxuICAgICAgICBwdWJsaWMgcmVsSGl0TG9jYXRpb246VmVjdG9yLFxyXG4gICAgICAgIHB1YmxpYyBub3JtYWw6VmVjdG9yLFxyXG4gICAgICAgIHB1YmxpYyBoaXRJbmRleDpWZWN0b3IsXHJcbiAgICApe1xyXG5cclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGR7XHJcblxyXG4gICAgXHJcbiAgICBncmlkOm51bWJlcltdW10gPSBbXVxyXG4gICAgZW50aXRpZXM6RW50aXR5W10gPSBbXVxyXG4gICAgZmlyZWRSYXlzOlJheWNhc3RIaXRbXSA9IFtdXHJcbiAgICBiZWZvcmVVcGRhdGUgPSBuZXcgRXZlbnRTeXN0ZW08bnVtYmVyPigpXHJcbiAgICBhZnRlclVwZGF0ZSA9IG5ldyBFdmVudFN5c3RlbTxudW1iZXI+KClcclxuICAgIHNraW53aWR0aCA9IDAuMDFcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ3JpZHNpemU6VmVjdG9yLCBwdWJsaWMgdGlsZXNpemU6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLmdyaWQgPSBnZW4yRGFycmF5KGdyaWRzaXplLCgpID0+IDApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGR0c2Vjb25kczpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuYmVmb3JlVXBkYXRlLnRyaWdnZXIoZHRzZWNvbmRzKVxyXG4gICAgICAgIGZvcih2YXIgZW50aXR5IG9mIHRoaXMuZW50aXRpZXMpe1xyXG4gICAgICAgICAgICB2YXIgc3BlZWQgPSBlbnRpdHkudmVsLmMoKS5zY2FsZShkdHNlY29uZHMpXHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9jbGFtcCBzcGVlZFxyXG4gICAgICAgICAgICBlbnRpdHkudmVsLm1hcCgodmFsLGFyciwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYW1wKHZhbCxlbnRpdHkubWluc3BlZWQuZ2V0KGkpLGVudGl0eS5tYXhzcGVlZC5nZXQoaSkpXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vdmUoZW50aXR5LHNwZWVkKVxyXG4gICAgICAgICAgICBpZihzcGVlZC5sZW5ndGhzcSgpID4gMCl7XHJcbiAgICAgICAgICAgICAgICBlbnRpdHkuZGlyID0gc3BlZWQuYygpLm5vcm1hbGl6ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZnRlclVwZGF0ZS50cmlnZ2VyKGR0c2Vjb25kcylcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlKGVudGl0eTpFbnRpdHksYW1vdW50OlZlY3Rvcil7XHJcbiAgICAgICAgdGhpcy5tb3ZlQXhpcyhlbnRpdHksMCxhbW91bnQueClcclxuICAgICAgICB0aGlzLm1vdmVBeGlzKGVudGl0eSwxLGFtb3VudC55KVxyXG4gICAgfVxyXG5cclxuICAgIG1vdmVBeGlzKGVudGl0eTpFbnRpdHksYXhpczpudW1iZXIsYW1vdW50Om51bWJlcil7XHJcbiAgICAgICAgaWYoYW1vdW50ID09IDApe1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGhpdCA9IHRoaXMuYm94Q2FzdChlbnRpdHkuYmxvY2ssYXhpcyxhbW91bnQpXHJcbiAgICAgICAgZW50aXR5LmJsb2NrLm1vdmUoaGl0LnJlbEhpdExvY2F0aW9uKVxyXG4gICAgICAgIGVudGl0eS5ncm91bmRlZC52YWxzW2F4aXNdID0gKGhpdC5oaXQgPyAxIDogMCkgKiBNYXRoLnNpZ24oYW1vdW50KVxyXG4gICAgICAgIGlmKGhpdC5oaXQpe1xyXG4gICAgICAgICAgICBlbnRpdHkudmVsLnZhbHNbYXhpc10gPSAwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJveENhc3QoYmxvY2s6QmxvY2ssYXhpczpudW1iZXIsYW1vdW50Om51bWJlcixfc2tpbndpZHRoID0gdGhpcy5za2lud2lkdGgpe1xyXG4gICAgICAgIHZhciBkaXIgPSBWRnJvbUF4aXNBbW91bnQoYXhpcyxhbW91bnQpXHJcbiAgICAgICAgaWYoYW1vdW50ID09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJheWNhc3RIaXQoZmFsc2UsYmxvY2suY2VudGVyKCksZGlyLG51bGwsbmV3IFZlY3RvcigwLDApLG51bGwsbnVsbClcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNraW5ibG9jayA9IGJsb2NrLmMoKVxyXG4gICAgICAgIHNraW5ibG9jay5taW4uYWRkKG5ldyBWZWN0b3IoX3NraW53aWR0aCxfc2tpbndpZHRoKSlcclxuICAgICAgICBza2luYmxvY2subWF4LnN1YihuZXcgVmVjdG9yKF9za2lud2lkdGgsX3NraW53aWR0aCkpXHJcblxyXG4gICAgICAgIHZhciBwb2ludHMgPSB0aGlzLmdldFBvaW50c09uRWRnZShza2luYmxvY2ssZGlyKVxyXG4gICAgICAgIHZhciByYXlzID0gcG9pbnRzLm1hcChwb2ludCA9PiB0aGlzLnJheWNhc3RBeGlzQWxpZ25lZChwb2ludCxheGlzLGxlbmd0aGVuKGFtb3VudCxfc2tpbndpZHRoKSkpXHJcbiAgICAgICAgdmFyIGhpdHJheSA9IGZpbmRiZXN0KHJheXMuZmlsdGVyKHJheSA9PiByYXkuaGl0KSxyYXkgPT4gLXJheS5yZWxIaXRMb2NhdGlvbi5sZW5ndGgoKSlcclxuICAgICAgICBmb3IodmFyIHJheSBvZiByYXlzKXtcclxuICAgICAgICAgICAgcmF5LnJlbEhpdExvY2F0aW9uLnZhbHNbYXhpc10gPSBsZW5ndGhlbihyYXkucmVsSGl0TG9jYXRpb24udmFsc1theGlzXSwgLV9za2lud2lkdGgpXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZWRSYXlzLnB1c2gocmF5KVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGl0cmF5ID8/IHJheXNbMF1cclxuICAgIH1cclxuXHJcbiAgICByYXljYXN0QXhpc0FsaWduZWQob3JpZ2luV29ybGQ6VmVjdG9yLGF4aXMsYW1vdW50KTpSYXljYXN0SGl0e1xyXG4gICAgICAgIHZhciBkaXJXb3JsZCA9IFZGcm9tQXhpc0Ftb3VudChheGlzLGFtb3VudClcclxuICAgICAgICB2YXIgZW5kID0gb3JpZ2luV29ybGQuYygpLmFkZChkaXJXb3JsZClcclxuICAgICAgICB2YXIgYm94ZXMyY2hlY2sgPSBjZWlsKE1hdGguYWJzKGFtb3VudCkgLyB0aGlzLnRpbGVzaXplKVxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPD0gYm94ZXMyY2hlY2s7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBvcmlnaW5Xb3JsZC5sZXJwKGVuZCxpIC8gYm94ZXMyY2hlY2spXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNCbG9ja2VkKHBvcykpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmF5Q2FzdChvcmlnaW5Xb3JsZCxkaXJXb3JsZCx0aGlzLmdldEJsb2NrKHBvcykpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSYXljYXN0SGl0KGZhbHNlLG9yaWdpbldvcmxkLGRpcldvcmxkLG9yaWdpbldvcmxkLmMoKS5hZGQoZGlyV29ybGQpLGRpcldvcmxkLmMoKSxkaXJXb3JsZC5jKCkubm9ybWFsaXplKCkuc2NhbGUoLTEpLG51bGwpXHJcbiAgICB9XHJcblxyXG4gICAgcmF5Q2FzdChvcmlnaW46VmVjdG9yLGRpcjpWZWN0b3IsYmxvY2s6QmxvY2spe1xyXG4gICAgICAgIHZhciBlbmQgPSBvcmlnaW4uYygpLmFkZChkaXIpXHJcbiAgICAgICAgdmFyIHJlczpSYXljYXN0SGl0ID0gbmV3IFJheWNhc3RIaXQoZmFsc2Usb3JpZ2luLGRpcixudWxsLG51bGwsbnVsbCxudWxsKVxyXG5cclxuICAgICAgICB2YXIgb3V0OltudW1iZXIsbnVtYmVyXSA9IFswLDBdXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmVzLmhpdCA9IGNvbGxpZGVMaW5lKG9yaWdpbixvcmlnaW4uYygpLmFkZChkaXIpLGJsb2NrLG91dClcclxuICAgICAgICByZXMuaGl0TG9jYXRpb24gPSBvcmlnaW4ubGVycChlbmQsb3V0WzBdKVxyXG4gICAgICAgIHJlcy5yZWxIaXRMb2NhdGlvbiA9IG9yaWdpbi50byhyZXMuaGl0TG9jYXRpb24pXHJcbiAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBvaW50c09uRWRnZShib3g6QmxvY2ssZGlyOlZlY3Rvcil7XHJcblxyXG4gICAgICAgIHZhciByZXM6VmVjdG9yW10gPSBbXVxyXG4gICAgICAgIHZhciBjb3JuZXJzID0gW1xyXG4gICAgICAgICAgICBib3guZ2V0Q29ybmVyKG5ldyBWZWN0b3IoMCwwKSksXHJcbiAgICAgICAgICAgIGJveC5nZXRDb3JuZXIobmV3IFZlY3RvcigxLDApKSxcclxuICAgICAgICAgICAgYm94LmdldENvcm5lcihuZXcgVmVjdG9yKDEsMSkpLFxyXG4gICAgICAgICAgICBib3guZ2V0Q29ybmVyKG5ldyBWZWN0b3IoMCwxKSksXHJcbiAgICAgICAgXVxyXG4gICAgICAgIGNvcm5lcnMgPSBjb3JuZXJzLmZpbHRlcihjb3JuZXIgPT4gYm94LmNlbnRlcigpLnRvKGNvcm5lcikubm9ybWFsaXplKCkuZG90KGRpci5jKCkubm9ybWFsaXplKCkpID4gMClcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc3RhcnQgPSBjb3JuZXJzWzBdXHJcbiAgICAgICAgdmFyIGVuZCA9IGNvcm5lcnNbMV1cclxuICAgICAgICB2YXIgbm9mcG9pbnRzID0gY2VpbChzdGFydC50byhlbmQpLmxlbmd0aCgpIC8gdGhpcy50aWxlc2l6ZSkgKyAxXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZnBvaW50cztpKyspe1xyXG4gICAgICAgICAgICByZXMucHVzaChzdGFydC5sZXJwKGVuZCwoaSAvIChub2Zwb2ludHMgLSAxKSkpKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBlbXB0eUZpcmVkUmF5cygpe1xyXG4gICAgICAgIHRoaXMuZmlyZWRSYXlzID0gW11cclxuICAgIH1cclxuXHJcbiAgICBpc0Jsb2NrZWQod29ybGQ6VmVjdG9yKXtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLndvcmxkMmluZGV4KHdvcmxkKVxyXG4gICAgICAgIGlmKGluUmFuZ2UoMCx0aGlzLmdyaWRzaXplLnggLSAxLGluZGV4LngpICYmIGluUmFuZ2UoMCx0aGlzLmdyaWRzaXplLnkgLSAxLGluZGV4LnkpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZFtpbmRleC55XVtpbmRleC54XVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICBpc0Jsb2NrZWRJbmRleChpbmRleDpWZWN0b3Ipe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRbaW5kZXgueV1baW5kZXgueF1cclxuICAgIH1cclxuXHJcbiAgICBnZXRCbG9jayh3b3JsZDpWZWN0b3Ipe1xyXG4gICAgICAgIHZhciB0b3BsZWZ0ID0gdGhpcy53b3JsZDJpbmRleCh3b3JsZCkuc2NhbGUodGhpcy50aWxlc2l6ZSlcclxuICAgICAgICByZXR1cm4gQmxvY2suZnJvbVNpemUodG9wbGVmdCxuZXcgVmVjdG9yKHRoaXMudGlsZXNpemUsdGhpcy50aWxlc2l6ZSkpXHJcbiAgICB9XHJcblxyXG4gICAgd29ybGQyaW5kZXgod29ybGQ6VmVjdG9yKTpWZWN0b3J7XHJcbiAgICAgICAgcmV0dXJuIHdvcmxkLmMoKS5kaXYobmV3IFZlY3Rvcih0aGlzLnRpbGVzaXplLHRoaXMudGlsZXNpemUpKS5mbG9vcigpXHJcbiAgICB9XHJcblxyXG4gICAgaW5kZXgyd29ybGQoaW5kZXg6VmVjdG9yKTpWZWN0b3J7XHJcbiAgICAgICAgcmV0dXJuIGluZGV4LmMoKS5zY2FsZSh0aGlzLnRpbGVzaXplKVxyXG4gICAgfVxyXG5cclxuICAgIGRlYnVnRHJhd0dyaWQoY3R4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpe1xyXG4gICAgICAgIGN0eHQuZmlsbFN0eWxlID0gJ2JsYWNrJ1xyXG4gICAgICAgIHRoaXMuZ3JpZHNpemUubG9vcDJkKGkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzQmxvY2tlZEluZGV4KGkpKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmxvY2sodGhpcy5pbmRleDJ3b3JsZChpKSkuZHJhdyhjdHh0KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjdHh0LmZpbGxTdHlsZSA9ICdncmV5J1xyXG4gICAgICAgIGZvcih2YXIgZW50aXR5IG9mIHRoaXMuZW50aXRpZXMpe1xyXG4gICAgICAgICAgICBlbnRpdHkuYmxvY2suZHJhdyhjdHh0KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1Z0RyYXdSYXlzKGN0eHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKXtcclxuICAgICAgICBmb3IodmFyIHJheSBvZiB0aGlzLmZpcmVkUmF5cyl7XHJcbiAgICAgICAgICAgIGlmKHJheS5oaXQpe1xyXG4gICAgICAgICAgICAgICAgY3R4dC5zdHJva2VTdHlsZSA9ICdyZWQnXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY3R4dC5zdHJva2VTdHlsZSA9ICdibHVlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgZGlyID0gcmF5LmRpci5jKCkubm9ybWFsaXplKClcclxuICAgICAgICAgICAgbGluZShjdHh0LHJheS5vcmlnaW4scmF5Lm9yaWdpbi5jKCkuYWRkKGRpci5zY2FsZSgxMCkpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gVkZyb21BeGlzQW1vdW50KGF4aXM6bnVtYmVyLGFtb3VudDpudW1iZXIpe1xyXG4gICAgdmFyIHYgPSBuZXcgVmVjdG9yKDAsMClcclxuICAgIHYudmFsc1theGlzXSA9IGFtb3VudFxyXG4gICAgcmV0dXJuIHZcclxufVxyXG5cclxuZnVuY3Rpb24gY29sbGlkZUxpbmUoYTpWZWN0b3IsYjpWZWN0b3IsYm94OkJsb2NrLG91dDpbbnVtYmVyLG51bWJlcl0pOmJvb2xlYW57XHJcbiAgICB2YXIgY2xpcDE6W251bWJlcixudW1iZXJdID0gWzAsMF1cclxuICAgIHZhciBjbGlwMjpbbnVtYmVyLG51bWJlcl0gPSBbMCwwXVxyXG5cclxuICAgIHJlbEludGVyc2VjdChhLngsYi54LCBib3gubWluLngsIGJveC5tYXgueCwgY2xpcDEpXHJcbiAgICByZWxJbnRlcnNlY3QoYS55LGIueSwgYm94Lm1pbi55LCBib3gubWF4LnksIGNsaXAyKVxyXG4gICAgXHJcbiAgICAvL3Jlc3VsdCBjb250YWlucyBpZiB0aGUgbGluZXMgaW50ZXJzZWN0ZWRcclxuICAgIHZhciByZXN1bHQgPSBpbnRlcnNlY3RMaW5lKGNsaXAxWzBdLGNsaXAxWzFdLGNsaXAyWzBdLGNsaXAyWzFdLG91dClcclxuICAgIHJldHVybiByZXN1bHQgJiYgaW5SYW5nZSgwLDEsb3V0WzBdKS8vICYmIGluUmFuZ2UoMCwxLG91dFsxXSlcclxufVxyXG5cclxuZnVuY3Rpb24gcmVsSW50ZXJzZWN0KGFtaW46bnVtYmVyLGFtYXg6bnVtYmVyLGJtaW46bnVtYmVyLGJtYXg6bnVtYmVyLG91dDpbbnVtYmVyLG51bWJlcl0pe1xyXG4gICAgaWYoYW1pbiA9PSBhbWF4KXsvL3RoaXMgY291bGQgdXNlIHNvbWUgd29ya1xyXG4gICAgICAgIG91dFswXSA9IC1JbmZpbml0eVxyXG4gICAgICAgIG91dFsxXSA9IEluZmluaXR5XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5hYnModG8oYW1pbiwgYW1heCkpXHJcbiAgICBvdXRbMF0gPSBNYXRoLmFicyh0byhhbWluLGJtaW4pKSAvIGxlbmd0aDtcclxuICAgIG91dFsxXSA9IE1hdGguYWJzKHRvKGFtaW4sYm1heCkpIC8gbGVuZ3RoO1xyXG4gICAgaWYoYW1pbiA+IGFtYXgpe1xyXG4gICAgICAgIHN3YXAob3V0LDAsMSlcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaW50ZXJzZWN0TGluZShhbWluOm51bWJlcixhbWF4Om51bWJlcixibWluOm51bWJlcixibWF4Om51bWJlcixvdXQ6W251bWJlcixudW1iZXJdKXtcclxuICAgIHZhciBpYmVnaW4gPSBNYXRoLm1heChhbWluLGJtaW4pXHJcbiAgICB2YXIgaWVuZCA9IE1hdGgubWluKGFtYXgsYm1heClcclxuICAgIG91dFswXSA9IGliZWdpblxyXG4gICAgb3V0WzFdID0gaWVuZFxyXG4gICAgaWYoaWJlZ2luIDw9IGllbmQpe1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5U3RvcHBpbmdGb3JjZSh2ZWw6VmVjdG9yLGR0Zm9yY2U6VmVjdG9yKXtcclxuICAgIHZlbC54ID0gbW92ZVRvd2FyZHModmVsLngsMCxkdGZvcmNlLngpXHJcbiAgICB2ZWwueSA9IG1vdmVUb3dhcmRzKHZlbC55LDAsZHRmb3JjZS55KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbW92ZVRvd2FyZHMoY3VyOm51bWJlcixkZXN0aW5hdGlvbjpudW1iZXIsbWF4YW1vdW50Om51bWJlcil7XHJcbiAgICB2YXIgZGlyID0gdG8oY3VyLGRlc3RpbmF0aW9uKVxyXG4gICAgaWYoTWF0aC5hYnMoZGlyKSA8PSBtYXhhbW91bnQpe1xyXG4gICAgICAgIHJldHVybiBkZXN0aW5hdGlvblxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIGN1ciArIE1hdGguc2lnbihkaXIpICogbWF4YW1vdW50XHJcbiAgICB9XHJcbn0iXX0=
