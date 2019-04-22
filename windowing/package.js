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
function inverselerp(a, b, v) {
    return to(a, v) / to(a, b);
}
function to(a, b) {
    return b - a;
}
function swap(arr, a = 0, b = 1) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
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
class Rect {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    static fromWidthHeight(width, height, pos) {
        var halfwidth = width / 2;
        var halfheight = height / 2;
        return new Rect(new Vector(-halfwidth, -halfheight).add(pos), new Vector(halfwidth, halfheight).add(pos));
    }
    copy() {
        return new Rect(this.min.c(), this.max.c());
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
        ctxt.strokeRect(Math.floor(this.min.x) + 0.5, Math.floor(this.min.y) + 0.5, size.x, size.y);
    }
    move(pos) {
        var size = this.size();
        this.min = pos;
        this.max = this.min.c().add(size);
    }
    moveEdgeTo(to, relpos) {
        var from = this.getPoint(relpos);
        var diff = from.to(to);
        this.add(diff);
        return this;
    }
    add(pos) {
        this.min.add(pos);
        this.max.add(pos);
        return this;
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
class Box {
    constructor(value) {
        this.isSet = false;
        this.onchange = new EventSystem();
        this.value = value;
        this.onClear = new EventSystemVoid();
    }
    get() {
        return this.value;
    }
    set(value, silent = false) {
        this.oldValue = this.value;
        this.value = value;
        if (this.oldValue != value || !this.isSet) {
            this.isSet = true;
            if (!silent) {
                this.onchange.trigger(this.value, this.oldValue);
            }
        }
    }
    clear() {
        this.isSet = false;
        this.set(null);
        this.onClear.trigger();
    }
    boxtrigger() {
        this.onchange.trigger(this.value, this.oldValue);
    }
}
class EventSystem {
    constructor() {
        this.callbacks = [];
    }
    listen(callback) {
        this.callbacks.push(callback);
    }
    deafen(callback) {
        this.callbacks.splice(this.callbacks.findIndex(v => v === callback), 1);
    }
    trigger(value, old) {
        for (var callback of this.callbacks) {
            callback(value, old);
        }
    }
}
class EventSystemVoid {
    constructor() {
        this.callbacks = [];
    }
    listen(callback) {
        this.callbacks.push(callback);
    }
    deafen(callback) {
        this.callbacks.splice(this.callbacks.findIndex(v => v === callback), 1);
    }
    trigger() {
        for (var callback of this.callbacks) {
            callback();
        }
    }
}
class ObjectBox {
    constructor(val) {
        this.isSet = false;
        this.val = val;
    }
    get(selector) {
        return selector(this.val).get();
    }
    set(selector, val) {
        var old = selector(this.val);
        old.set(val);
        if (old.get() != val || !this.isSet) {
            this.isSet = true;
            this.onChange.trigger();
        }
    }
}
class PEvent {
    constructor(val) {
        this.val = val;
        this.handled = false;
    }
    static create(handled, val) {
        var e = new PEvent(val);
        e.handled = handled;
        return e;
    }
}
class PBox {
    constructor(val) {
        this.onchange = new EventSystem();
        this.isProtected = false;
        this.box = new Box(val);
        this.box.onchange.listen((val, old) => {
            this.onchange.trigger(PEvent.create(this.isProtected, val), null);
        });
    }
    get() {
        return this.box.value;
    }
    set(v) {
        this.box.set(v);
    }
    setHP(handled, val) {
        this.setProtected(PEvent.create(handled, val));
    }
    setProtected(e) {
        if (!e.handled) {
            e.handled = true;
            this.setS(e);
        }
    }
    setS(e) {
        this.isProtected = e.handled;
        this.box.set(e.val);
        this.isProtected = false;
    }
}
var HandleType;
(function (HandleType) {
    HandleType[HandleType["anchor"] = 0] = "anchor";
    HandleType[HandleType["offset"] = 1] = "offset";
})(HandleType || (HandleType = {}));
class Handle {
    constructor(pos, clickmanager, type) {
        this.type = type;
        this.pos = new PBox(pos);
        this.pos.onchange.listen(e => {
            this.rect.moveEdgeTo(e.val, new Vector(0.5, 0.5));
        });
        this.rect = Rect.fromWidthHeight(10, 10, pos);
        clickmanager.listen(this.rect, () => {
            this.selected = true;
        });
        document.addEventListener('mouseup', e => {
            this.selected = false;
        });
        document.addEventListener('mousemove', e => {
            var mousepos = getMousePos(canvas, e);
            if (this.selected) {
                this.pos.set(mousepos);
            }
        });
    }
    draw(ctxt) {
        // this.pos.get().draw(ctxt)
        if (this.type == HandleType.anchor) {
            ctxt.strokeStyle = 'red';
            this.rect.draw(ctxt);
        }
        else {
            ctxt.strokeStyle = 'blue';
            this.rect.draw(ctxt);
        }
        ctxt.strokeStyle = 'black';
    }
}
class ClickManager {
    constructor() {
        this.rects = new Map();
    }
    listenToDocument() {
        document.addEventListener('mousedown', e => {
            this.click(getMousePos(canvas, e));
        });
    }
    click(pos) {
        for (var pair of this.rects.entries()) {
            if (pair[0].collidePoint(pos)) {
                pair[1](pos);
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
class UIRect {
    constructor(anchormin, anchormax, offsetmin, offsetmax, parent) {
        this.children = [];
        this.shouldupdateAbsRect = true;
        this.anchorchangeenabled = true;
        this.offsetchangeenabled = true;
        this.parent = parent;
        this.anchormin = new PBox(anchormin);
        this.anchormax = new PBox(anchormax);
        this.offsetmin = new PBox(offsetmin);
        this.offsetmax = new PBox(offsetmax);
        this.absRect = new PBox(this.calcAbsRect());
        this.parent.onchange.listen((val, old) => {
            this.updateAbsRect(false);
        });
    }
    addChild(anchmin, anchmax, offmin, offmax) {
        var child = new UIRect(anchmin, anchmax, offmin, offmax, this.absRect.box);
        this.children.push(child);
        return child;
    }
    updateAbsRect(handled) {
        if (!handled) {
            var absrect = this.calcAbsRect();
            this.absRect.setHP(handled, absrect);
        }
    }
    attachHandles2UIRect(clickmanager) {
        let Loc;
        (function (Loc) {
            Loc[Loc["NW"] = 0] = "NW";
            Loc[Loc["NE"] = 1] = "NE";
            Loc[Loc["SE"] = 2] = "SE";
            Loc[Loc["SW"] = 3] = "SW";
        })(Loc || (Loc = {}));
        var that = this;
        var absrect = this.absRect.get();
        var handleoffsetmin = new Handle(absrect.min, clickmanager, HandleType.offset);
        var handleoffsetmax = new Handle(absrect.max, clickmanager, HandleType.offset);
        var handleoffsetbotleft = new Handle(absrect.getPoint(new Vector(0, 1)), clickmanager, HandleType.offset);
        var handleoffsettopright = new Handle(absrect.getPoint(new Vector(1, 0)), clickmanager, HandleType.offset);
        var handleanchormin = new Handle(this.calcAbsAnchorPos(this.anchormin.get()), clickmanager, HandleType.anchor);
        var handleanchormax = new Handle(this.calcAbsAnchorPos(this.anchormax.get()), clickmanager, HandleType.anchor);
        var handleanchorbotleft = new Handle(this.calcAbsAnchorPos(new Vector(this.anchormin.get().x, this.anchormax.get().y)), clickmanager, HandleType.anchor);
        var handleanchortopright = new Handle(this.calcAbsAnchorPos(new Vector(this.anchormax.get().x, this.anchormin.get().y)), clickmanager, HandleType.anchor);
        var draghandle = new Handle(absrect.getPoint(new Vector(0.5, 0)), clickmanager, HandleType.offset);
        var anchorhandles = [
            handleanchormin,
            handleanchortopright,
            handleanchormax,
            handleanchorbotleft,
        ];
        var offsethandles = [
            handleoffsetmin,
            handleoffsettopright,
            handleoffsetmax,
            handleoffsetbotleft,
        ];
        var handles = anchorhandles.concat(offsethandles).concat(draghandle);
        // var dirs = [
        //     [Loc.NW0,Loc.NE1],
        //     [Loc.SW3,Loc.SE2]
        // ]
        var dirmap = [
            [Loc.NE, Loc.SW],
            [Loc.SE, Loc.NW],
            [Loc.SW, Loc.NE],
            [Loc.NW, Loc.SE],
        ];
        var updateAnchorHandles = (handled) => {
            anchorhandles.forEach((ah, i) => updateAnchorHandle(handled, i));
        };
        var updateOffsetHandles = (handled) => {
            offsethandles.forEach((ah, i) => updateOffsetHandle(handled, i));
        };
        var updateDragHandle = (handled) => {
            draghandle.pos.setHP(handled, this.absRect.box.value.getPoint(new Vector(0.5, 0)));
        };
        var updateAnchorHandle = (handled, loc) => {
            var pos = new Vector();
            if (loc == Loc.NW || loc == Loc.NE) {
                pos.y = this.anchormin.get().y;
            }
            else {
                pos.y = this.anchormax.get().y;
            }
            if (loc == Loc.NW || loc == Loc.SW) {
                pos.x = this.anchormin.get().x;
            }
            else {
                pos.x = this.anchormax.get().x;
            }
            var absAnchorHandlePos = this.calcAbsAnchorPos(pos);
            anchorhandles[loc].pos.setHP(handled, absAnchorHandlePos);
        };
        var updateOffsetHandle = (handled, loc) => {
            var absOffsetHandlePos = new Vector();
            var minAbsOffsetPos = this.calcAbsOffsetPos(this.anchormin.get(), this.offsetmin.get());
            var maxAbsOffsetPos = this.calcAbsOffsetPos(this.anchormax.get(), this.offsetmax.get());
            if (loc == Loc.NW || loc == Loc.NE) {
                absOffsetHandlePos.y = minAbsOffsetPos.y;
            }
            else {
                absOffsetHandlePos.y = maxAbsOffsetPos.y;
            }
            if (loc == Loc.NW || loc == Loc.SW) {
                absOffsetHandlePos.x = minAbsOffsetPos.x;
            }
            else {
                absOffsetHandlePos.x = maxAbsOffsetPos.x;
            }
            offsethandles[loc].pos.setHP(handled, absOffsetHandlePos);
        };
        var readAnchorHandleSetdata = (handled, loc) => {
            var handlePos = anchorhandles[loc].pos.get();
            var isMinDirty = false;
            var isMaxDirty = false;
            if (loc == Loc.NW || loc == Loc.NE) {
                this.anchormin.get().y = inverselerp(this.parent.value.min.y, this.parent.value.max.y, handlePos.y);
                isMinDirty = true;
            }
            else {
                this.anchormax.get().y = inverselerp(this.parent.value.min.y, this.parent.value.max.y, handlePos.y);
                isMaxDirty = true;
            }
            if (loc == Loc.NW || loc == Loc.SW) {
                this.anchormin.get().x = inverselerp(this.parent.value.min.x, this.parent.value.max.x, handlePos.x);
                isMinDirty = true;
            }
            else {
                this.anchormax.get().x = inverselerp(this.parent.value.min.x, this.parent.value.max.x, handlePos.x);
                isMaxDirty = true;
            }
            if (!handled) {
                if (isMinDirty) {
                    this.anchormin.box.boxtrigger();
                }
                if (isMaxDirty) {
                    this.anchormax.box.boxtrigger();
                }
            }
        };
        var readOffsetHandleSetData = (handled, loc) => {
            var handlePos = offsethandles[loc].pos.get();
            var absAnchorMin = this.calcAbsAnchorPos(this.anchormin.get());
            var absAnchorMax = this.calcAbsAnchorPos(this.anchormax.get());
            this.offsetmin;
            this.offsetmax;
            var isMinDirty = false;
            var isMaxDirty = false;
            if (loc == Loc.NW || loc == Loc.NE) {
                this.offsetmin.get().y = to(absAnchorMin.y, handlePos.y);
                isMinDirty = true;
            }
            else {
                this.offsetmax.get().y = to(absAnchorMax.y, handlePos.y);
                isMaxDirty = true;
            }
            if (loc == Loc.NW || loc == Loc.SW) {
                this.offsetmin.get().x = to(absAnchorMin.x, handlePos.x);
                isMinDirty = true;
            }
            else {
                this.offsetmax.get().x = to(absAnchorMax.x, handlePos.x);
                isMaxDirty = true;
            }
            if (!handled) {
                if (isMinDirty) {
                    this.offsetmin.box.boxtrigger();
                }
                if (isMaxDirty) {
                    this.offsetmin.box.boxtrigger();
                }
            }
        };
        //update functions----------------------------------------------
        var updateAbsRect = this.updateAbsRect.bind(this);
        //parent-------------------------------
        this.parent.onchange.listen((val, old) => {
            this.anchorchangeenabled = false;
            updateAnchorHandles(false);
            this.anchorchangeenabled = true;
            updateAbsRect(false);
            this.offsetchangeenabled = false;
            updateOffsetHandles(false);
            this.offsetchangeenabled = true;
            updateDragHandle(false);
        });
        //absrect-------------------------------
        this.absRect.onchange.listen((e, old) => {
            updateOffsetHandles(e.handled);
            updateDragHandle(e.handled);
        });
        this.anchormin.onchange.listen(e => {
            updateAnchorHandle(e.handled, Loc.NW);
            updateAnchorHandle(e.handled, Loc.NE);
            updateAnchorHandle(e.handled, Loc.SW);
            updateAbsRect(e.handled);
            updateDragHandle(e.handled);
        });
        this.anchormax.onchange.listen(e => {
            updateAnchorHandle(e.handled, Loc.SE);
            updateAnchorHandle(e.handled, Loc.NE);
            updateAnchorHandle(e.handled, Loc.SW);
            updateAbsRect(e.handled);
            updateDragHandle(e.handled);
        });
        this.offsetmin.onchange.listen(e => {
            updateOffsetHandle(e.handled, Loc.NW);
            updateOffsetHandle(e.handled, Loc.NE);
            updateOffsetHandle(e.handled, Loc.SW);
            updateAbsRect(e.handled);
            updateDragHandle(e.handled);
        });
        this.offsetmax.onchange.listen(e => {
            updateOffsetHandle(e.handled, Loc.SE);
            updateOffsetHandle(e.handled, Loc.NE);
            updateOffsetHandle(e.handled, Loc.SW);
            updateAbsRect(e.handled);
            updateDragHandle(e.handled);
        });
        function processAnchorHandleChange(e, dir) {
            if (that.anchorchangeenabled) {
                // var cwDir = dirmap[dir][0]
                // var ccwDir = dirmap[dir][1]
                // readAnchorHandleSetdata(e.handled,dir)
                // updateOffsetHandle(e.handled,dir)
                // updateOffsetHandle(e.handled,cwDir)
                // updateOffsetHandle(e.handled,ccwDir)
                readOffsetHandleSetData(e.handled, dir);
                readAnchorHandleSetdata(e.handled, dir);
            }
        }
        handleanchormin.pos.onchange.listen(e => {
            processAnchorHandleChange(e, Loc.NW);
        });
        handleanchortopright.pos.onchange.listen(e => {
            processAnchorHandleChange(e, Loc.NE);
        });
        handleanchormax.pos.onchange.listen(e => {
            processAnchorHandleChange(e, Loc.SE);
        });
        handleanchorbotleft.pos.onchange.listen(e => {
            processAnchorHandleChange(e, Loc.SW);
        });
        function processOffsetHandleChange(e, dir) {
            if (that.offsetchangeenabled) {
                var cwDir = dirmap[dir][0];
                var ccwDir = dirmap[dir][1];
                readOffsetHandleSetData(e.handled, dir);
                updateAbsRect(e.handled);
                updateOffsetHandle(e.handled, cwDir);
                updateOffsetHandle(e.handled, ccwDir);
            }
        }
        handleoffsetmin.pos.onchange.listen(e => {
            processOffsetHandleChange(e, Loc.NW);
        });
        handleoffsettopright.pos.onchange.listen(e => {
            processOffsetHandleChange(e, Loc.NE);
        });
        handleoffsetmax.pos.onchange.listen(e => {
            processOffsetHandleChange(e, Loc.SE);
        });
        handleoffsetbotleft.pos.onchange.listen(e => {
            processOffsetHandleChange(e, Loc.SW);
        });
        //draghandle--------------------
        draghandle.pos.onchange.listen(e => {
            var source = this.absRect.box.value.getPoint(new Vector(0.5, 0));
            var offset = source.to(e.val);
            this.offsetmin.setHP(e.handled, this.offsetmin.box.value.c().add(offset));
            this.offsetmax.setHP(e.handled, this.offsetmax.box.value.c().add(offset));
            updateOffsetHandles(e.handled);
            updateAbsRect(e.handled);
        });
        return handles;
    }
    draw(ctxt) {
        var absrect = this.absRect.get(); //this.calcAbsRect(this.parent.get())
        var size = absrect.size();
        ctxt.strokeRect(Math.floor(absrect.min.x) + 0.5, Math.floor(absrect.min.y) + 0.5, size.x, size.y);
        this.children.forEach(c => c.draw(ctxt));
    }
    calcAbsAnchorPos(anchor) {
        return this.uirectlerp(this.parent.get().min, this.parent.get().max, anchor);
    }
    calcAbsOffsetPos(anchor, offset) {
        return this.calcAbsAnchorPos(anchor).add(offset);
    }
    calcAbsRect() {
        var absmin = this.calcAbsOffsetPos(this.anchormin.get(), this.offsetmin.get());
        var absmax = this.calcAbsOffsetPos(this.anchormax.get(), this.offsetmax.get());
        return new Rect(absmin, absmax);
    }
    uirectlerp(a, b, w) {
        return new Vector(lerp(a.x, b.x, w.x), lerp(a.y, b.y, w.y));
    }
    uirectInvlerp(a, b, w) {
        return new Vector(inverselerp(a.x, b.x, w.x), inverselerp(a.y, b.y, w.y));
    }
}
var Justification;
(function (Justification) {
    Justification[Justification["start"] = 0] = "start";
    Justification[Justification["end"] = 1] = "end";
    Justification[Justification["center"] = 2] = "center";
    Justification[Justification["spacebetween"] = 3] = "spacebetween";
    Justification[Justification["spacearound"] = 4] = "spacearound";
    Justification[Justification["spaceevenly"] = 5] = "spaceevenly";
})(Justification || (Justification = {}));
var Alignment;
(function (Alignment) {
    Alignment[Alignment["start"] = 0] = "start";
    Alignment[Alignment["end"] = 1] = "end";
    Alignment[Alignment["center"] = 2] = "center";
    Alignment[Alignment["stretch"] = 3] = "stretch";
})(Alignment || (Alignment = {}));
class FlexBox {
    constructor(uirect, justifyContent) {
        this.uirect = uirect;
        this.justifyContent = justifyContent;
        this.AlignItems = Alignment.center;
        this.draw = this.uirect.draw.bind(uirect);
        this.children = uirect.children;
        for (var child of this.children) {
            child.anchormin.set(new Vector(0, 0));
            child.anchormax.set(new Vector(0, 0));
        }
        var posses = [this.positionStart, this.positionEnd, this.positionCenter, this.positionBetween, this.positionAround, this.positionEvenly].map(p => p.bind(this));
        this.uirect.absRect.onchange.listen((val, old) => {
            var rects = posses[this.justifyContent]();
            for (var i = 0; i < rects.length; i++) {
                this.children[i].offsetmin.set(rects[i].min);
                this.children[i].offsetmax.set(rects[i].max);
            }
        });
        this.uirect.absRect.box.boxtrigger();
    }
    width() {
        return this.uirect.absRect.get().size().x;
    }
    positionStart() {
        return this.spaceBlocks(0, 0);
    }
    freespace(margin) {
        return this.width() - this.calcChildrenWidth(margin);
    }
    positionEnd() {
        return this.spaceBlocks(this.freespace(0), 0);
    }
    positionCenter() {
        var width = this.calcChildrenWidth(0);
        var center = this.uirect.absRect.get().size().scale(0.5);
        return this.spaceBlocks(center.x - width / 2, 0);
    }
    positionBetween() {
        return this.spaceBlocks(0, this.freespace(0) / (this.children.length - 1));
    }
    positionAround() {
        var freespacePerBlock = this.freespace(0) / this.children.length;
        return this.spaceBlocks(freespacePerBlock / 2, freespacePerBlock);
    }
    positionEvenly() {
        var freespacepergap = this.freespace(0) / (this.children.length + 1);
        return this.spaceBlocks(freespacepergap, freespacepergap);
    }
    spaceBlocks(begin, margin) {
        var result = [];
        var current = begin;
        for (var rect of this.children) {
            var size = rect.absRect.get().size();
            var start = current;
            var end = start + size.x;
            result.push(new Rect(new Vector(start, 0), new Vector(end, size.y)));
            current += size.x + margin;
        }
        return result;
    }
    // calcTopBottom(alignment:Alignment, rect:Rect):[number,number]{
    // var bot = 0;
    // var size = rect.size()
    // var top = this.rect.value.size().y
    // switch(alignment){
    //     case Alignment.start:{
    //         return [bot,size.y];
    //     }
    //     case Alignment.end:{
    //         return [top - size.y, top];
    //     }
    //     case Alignment.center:{
    //         var center = top / 2
    //         var halfsize = size.y / 2
    //         return [center - halfsize, center + halfsize];
    //     }
    //     case Alignment.stretch:{
    //         return [bot,top];
    //     }
    // }
    // }
    calcChildrenWidth(margin) {
        return this.children.reduce((p, c) => p += c.absRect.get().size().x, 0) + max(this.children.length - 1, 0) * margin;
    }
}
/// <reference path="utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="rect.ts" />
/// <reference path="EventSystem.ts" />
/// <reference path="handle.ts" />
/// <reference path="clickmanager.ts" />
/// <reference path="uirect.ts" />
/// <reference path="flexbox.ts" />
var zero = new Vector(0, 0);
var one = new Vector(1, 1);
var canvasize = new Vector(window.innerWidth - 10, window.innerHeight - 10);
var canvasrect = new Rect(zero.c(), canvasize);
var demoRect = new Box(canvasrect.copy());
var crret = createCanvas(canvasize.x, canvasize.y);
var canvas = crret.canvas;
var ctxt = crret.ctxt;
var handles = [];
var clickmanager = new ClickManager();
clickmanager.listenToDocument();
// var handles = attachHandles2Rect(demoRect,clickmanager)
var flexboxes = [];
var containerRect = new UIRect(new Vector(0, 0), new Vector(1, 1), new Vector(50, 50), new Vector(-50, -50), demoRect);
handles = handles.concat(containerRect.attachHandles2UIRect(clickmanager));
var smallrect = new Rect(new Vector(10, 10), new Vector(200, 200));
var uirects = [
    new UIRect(new Vector(0, 0), new Vector(0, 0), smallrect.min.c(), smallrect.max.c(), containerRect.absRect.box),
    new UIRect(new Vector(1, 0), new Vector(1, 0), smallrect.min.c().add(new Vector(-210, 0)), smallrect.max.c().add(new Vector(-210, 0)), containerRect.absRect.box),
    new UIRect(new Vector(1, 1), new Vector(1, 1), smallrect.min.c().add(new Vector(-210, -210)), smallrect.max.c().add(new Vector(-210, -210)), containerRect.absRect.box),
    new UIRect(new Vector(0, 1), new Vector(0, 1), smallrect.min.c().add(new Vector(0, -210)), smallrect.max.c().add(new Vector(0, -210)), containerRect.absRect.box),
    new UIRect(new Vector(0, 0.5), new Vector(1, 0.5), new Vector(10, -100), new Vector(-10, 100), containerRect.absRect.box),
    new UIRect(new Vector(0.5, 0), new Vector(0.5, 0), smallrect.min.c().add(new Vector(-210, 0)), smallrect.max.c(), containerRect.absRect.box),
];
uirects.forEach((uirect, i) => {
    for (var j = 0; j < 4; j++) {
        var child = uirect.addChild(new Vector(0, 0), new Vector(0, 0), new Vector(-10, -10), new Vector(10, 10));
        if (i == 4) {
            handles = handles.concat(child.attachHandles2UIRect(clickmanager));
        }
    }
    handles = handles.concat(uirect.attachHandles2UIRect(clickmanager));
    flexboxes.push(new FlexBox(uirect, i));
});
// for(var i = 0; i < 6; i++){
//     var offset = new Vector(i * 220, 0)
//     var uirect = new UIRect(
//         new Vector(0,0),new Vector(0,0),
//         new Vector(10,10).add(offset), new Vector(200,200).add(offset),
//         containerRect.absRect.box
//     )
//     handles = handles.concat(uirect.attachHandles2UIRect(clickmanager))
//     for(var j = 0; j < 4; j++){
//         uirect.addChild(
//             new Vector(0,0),new Vector(0,0),
//             new Vector(-10,-10), new Vector(10,10),
//         )
//     }
//     var flexbox = new FlexBox(uirect,i)
//     flexboxes.push(flexbox)
// }
// function attachHandles2Rect(prect:Box<Rect>,clickmanager:ClickManager){
//     var rect = prect.get()
//     var minhandle = new Handle(rect.min,clickmanager)
//     var maxhandle = new Handle(rect.max,clickmanager)
//     minhandle.pos.onchange.listen(e => {
//         rect.min = e.val
//         prect.onchange.trigger(rect,null)
//     })
//     maxhandle.pos.onchange.listen(e => {
//         rect.max = e.val
//         prect.onchange.trigger(rect,null)
//     })
//     return [minhandle,maxhandle]
// }
loop(dodraw);
function dodraw(dt) {
    ctxt.clearRect(0, 0, canvasize.x, canvasize.y);
    handles.forEach(h => h.draw(ctxt));
    // demoRect.get().draw(ctxt)
    flexboxes.forEach(fb => fb.draw(ctxt));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLnRzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcngvdmVjdG9yLnRzIiwicmVjdC50cyIsIkV2ZW50U3lzdGVtLnRzIiwiaGFuZGxlLnRzIiwiY2xpY2ttYW5hZ2VyLnRzIiwidWlyZWN0LnRzIiwiZmxleGJveC50cyIsIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYSxJQUFZLEVBQUUsTUFBYyxFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQUUsS0FBYTtJQUNuRixNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUMzRSxDQUFDO0FBRUQsaUJBQWlCLEdBQVcsRUFBRSxHQUFXLEVBQUUsS0FBYTtJQUNwRCxFQUFFLENBQUEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUEsQ0FBQztRQUNWLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNmLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDVixHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ2YsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxHQUFHLENBQUM7QUFDeEMsQ0FBQztBQUVELGFBQWEsQ0FBUyxFQUFFLENBQVM7SUFDN0IsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbEIsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNiLENBQUM7QUFFRCxhQUFhLENBQVMsRUFBRSxDQUFTO0lBQzdCLEVBQUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLE1BQU0sQ0FBQyxDQUFDLENBQUM7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QUNELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyxDQUFRO1FBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVELFNBQVM7UUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDeEMsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFRO1FBQ1AsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFRLEVBQUMsTUFBYTtRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQ2pELENBQUM7SUFFRCxDQUFDO1FBQ0csTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQzlDLENBQUM7SUFFRCxTQUFTLENBQUMsQ0FBUTtRQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNsRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FB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Q0FBQTtJQUN2QixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdkIsQ0FBQztJQUVELElBQUksQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLENBQUMsQ0FBQyxHQUFHO1FBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7SUFDdEIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDLEdBQUc7UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtJQUN0QixDQUFDO0lBRUQsSUFBSSxDQUFDLENBQUMsR0FBRztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBNkI7UUFDOUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFBO1FBQ2QsSUFBSSxTQUFTLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQTtRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxFQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxFQUFDLEtBQUssRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUNwRSxDQUFDO0lBRUQsS0FBSyxDQUFDLENBQVE7UUFDVixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25DLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FB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QUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDM0csQ0FBQztJQUVELElBQUk7UUFDQSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDOUMsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUFZO1FBRXJCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakUsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNkLENBQUM7UUFDRixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNWLENBQUM7SUFFRCxJQUFJO1FBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVU7UUFDakIsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsQ0FBQztZQUNoQyxFQUFFLENBQUEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENB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QUFBO1lBQ3BDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDeEIsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQy9CLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQy9CLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDeEIsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQy9CLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQy9CLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDeEIsZ0JBQWdCLENBQUMsQ0FB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SSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFDbkYsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQzVCO0lBQ0QsSUFBSSxNQUFNLENBQ04sSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFDL0IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDekYsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQzVCO0lBQ0QsSUFBSSxNQUFNLENBQ04sSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFDL0IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUNuRixhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDNUI7SUFDRCxJQUFJLE1BQU0sQ0FDTixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLEVBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxFQUNuQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxJQUFJLE1BQU0sQ0FBQyxDQUFD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