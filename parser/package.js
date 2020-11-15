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
    callback(now - lastUpdate);
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
function updateParserError(state, error) {
    return Object.assign(Object.assign({}, state), { isError: true, error: error + ` error at index ${state.index}: '${state.targetString.slice(state.index, 10)}'` });
}
function updateParserState(state, index, result) {
    return Object.assign(Object.assign({}, state), { index,
        result });
}
function updateParserResult(state, result) {
    return Object.assign(Object.assign({}, state), { result });
}
class ParserState {
}
class Parser {
    constructor(cb) {
        this.transformer = cb;
    }
    run(string) {
        var startstate = {
            index: 0,
            targetString: string,
            result: null,
            isError: false,
            error: null,
        };
        return this.transformer(startstate);
    }
    map(cb) {
        return new Parser((state) => {
            var nextstate = this.transformer(state);
            return updateParserState(nextstate, nextstate.index, cb(nextstate.result));
        });
    }
    chain(cb) {
        return new Parser((state) => {
            var nextstate = this.transformer(state);
            var nextparser = cb(nextstate);
            return nextparser.transformer(nextstate);
        });
    }
}
var str = (s) => new Parser(state => {
    if (state.isError) {
        return state;
    }
    if (state.targetString.startsWith(s, state.index)) {
        return updateParserState(state, state.index + s.length, s);
    }
    else {
        return updateParserError(state, `str: Tried to match "${s}"`);
    }
});
var tap = (cb) => new Parser((state) => {
    cb(state);
    return state;
});
var brk = new Parser((state) => {
    console.log(state);
    debugger;
    return state;
});
var regex = (reg) => new Parser(state => {
    if (state.isError) {
        return state;
    }
    reg.lastIndex = state.index;
    var slicedtarget = state.targetString.slice(state.index);
    if (slicedtarget.length == 0) {
        return updateParserError(state, `regex: unexpected end of input`);
    }
    var res = reg.exec(slicedtarget);
    if (res == null) {
        return updateParserError(state, `regex: Tried to match "${reg.source}"`);
    }
    else {
        return updateParserState(state, state.index + res[0].length, res[0]);
    }
});
var optional = (parser) => new Parser(state => {
    if (state.isError)
        return state;
    var nextstate = parser.transformer(state);
    if (nextstate.isError == true) {
        updateParserResult(state, null);
    }
    else {
        return nextstate;
    }
    return state;
});
var letter = regex(/^[a-zA-Z]/);
var letters = regex(/^[a-zA-Z]+/);
var digit = regex(/^[0-9]/);
var digits = regex(/^[0-9]+/);
var whitespace = regex(/^\s+/);
var optws = optional(whitespace);
var lettersandws = regex(/^[a-zA-Z\s]+/);
var sequenceOf = (parsers) => new Parser(state => {
    if (state.isError) {
        return state;
    }
    var res = [];
    var nextstate = state;
    for (var parser of parsers) {
        nextstate = parser.transformer(nextstate);
        res.push(nextstate.result);
    }
    return updateParserResult(nextstate, res);
});
var namedSequence = (parserpairs) => {
    return sequenceOf(parserpairs.map(p => p[1])).map(res => {
        var object = {};
        res.forEach((element, i) => {
            object[parserpairs[i][0]] = element;
        });
        return object;
    });
};
var choice = (parsers) => new Parser(state => {
    if (state.isError) {
        return state;
    }
    for (var parser of parsers) {
        var nextstate = parser.transformer(state);
        if (nextstate.isError == false) {
            return nextstate;
        }
    }
    return updateParserError(state, `Choice: unable to match any parsers`);
});
var between = (left, right) => (item) => sequenceOf([left, item, right]).map((state) => state[1]);
var sepby = (separator) => (item) => new Parser(state => {
    var results = [];
    let nextstate = state;
    while (true) {
        var wewantstate = item.transformer(nextstate);
        if (wewantstate.isError) {
            break;
        }
        results.push(wewantstate.result);
        nextstate = wewantstate;
        var separatorstate = separator.transformer(nextstate);
        if (separatorstate.isError) {
            break;
        }
        nextstate = separatorstate;
    }
    return updateParserState(nextstate, nextstate.index, results);
});
var sepby1 = (separator) => (item) => new Parser(state => {
    var res = sepby(separator)(item).transformer(state);
    if (res.result.length == 0) {
        return updateParserError(res, `sepby1: Unable to capture atleast 1`);
    }
    else {
        return res;
    }
});
var many = (parser) => new Parser(state => {
    if (state.isError) {
        return state;
    }
    var res = [];
    var nextstate = state;
    while (nextstate.isError == false) {
        var teststate = parser.transformer(nextstate);
        if (teststate.isError == false) {
            res.push(teststate.result);
            nextstate = teststate;
        }
        else {
            break;
        }
    }
    return updateParserResult(nextstate, res);
});
var many1 = (parser) => new Parser(state => {
    if (state.isError) {
        return state;
    }
    var res = many(parser).transformer(state);
    if (res.result.length == 0) {
        return updateParserError(res, `many1: Unable to capture atleast 1`);
    }
    else {
        return res;
    }
});
var lazy = (parserThunk) => new Parser(parserState => {
    const parser = parserThunk();
    return parser.transformer(parserState);
});
var startOfInput;
var endOfInput;
var tag = (type) => (value) => ({ type, value });
/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="parser.ts" />
var inputarea = document.querySelector('#input');
var outputarea = document.querySelector('#output');
inputarea.addEventListener('input', () => {
    convertInput2Output();
});
function convertInput2Output() {
    var sassast = stylesheet.run(inputarea.value).result;
    var cssAst = transpileSassAst(sassast);
    outputarea.value = csstree2string(cssAst);
}
var betweenoptws = between(optws, optws);
var betweenquotes = between(str('"'), str('"'));
var keyvalueseparator = betweenoptws(str(':'));
var selector = letters;
var selectorgroup = sepby(str(','))(selector);
var property = regex(/^[a-zA-Z\-]+/);
var pixels = sequenceOf([digits, str('px')]).map(res => ({ type: 'px', res: res.join('') }));
var hexcode = sequenceOf([str('#'), regex(/[a-fA-F0-9]{6}|[a-fA-F0-9]{3}/)]).map(res => ({ type: 'hex', res: res.join('') }));
var lettervalue = letters.map(res => ({ type: 'prop', res }));
var value = choice([pixels, hexcode, lettervalue]);
var declaration = betweenoptws(sequenceOf([property, keyvalueseparator, value]).map(res => ({ type: 'declaration', key: res[0], val: res[2] })));
var recursionbit = lazy(() => choice([
    ruleset,
    declaration,
]));
var declarationblock = between(str('{'), str('}'))(sepby(sequenceOf([str(';'), optws]))(recursionbit));
var ruleset = betweenoptws(namedSequence([['selectorgroup', selectorgroup], ['declarations', declarationblock]])).map(res => (Object.assign(Object.assign({}, res), { type: 'ruleset' })));
var stylesheet = many(ruleset);
// var res = stylesheet.run(css)
// console.log(res)
// var flattenedcssast = transpileSassAst(res.result)
// console.log(flattenedcssast)
// console.log(csstree2string(flattenedcssast))
function transpileSassAst(ast) {
    return ast.flatMap(rs => flatten(rs));
}
function flatten(baseruleset) {
    baseruleset.selectorgroup;
    baseruleset.declarations;
    var normaldeclarations = baseruleset.declarations.filter(d => d.type == 'declaration');
    var rulesets = [{
            selectorgroup: baseruleset.selectorgroup,
            declarations: normaldeclarations,
        }];
    var rulesetdeclarations = baseruleset.declarations.filter(d => d.type == 'ruleset');
    rulesets.push(...rulesetdeclarations.flatMap(rs => {
        var flats = flatten(rs);
        flats.forEach(rs => rs.selectorgroup.unshift(...baseruleset.selectorgroup));
        return flats;
    }));
    return rulesets;
}
function csstree2string(rulesets) {
    var res = '';
    for (var ruleset of rulesets) {
        var decs = ruleset.declarations.map(dec => `${dec.key}:${dec.val.res};`);
        res += `${ruleset.selectorgroup.join(' ')}{
\t${decs.join('\n\t')}
}\n\n`;
    }
    return res;
}
convertInput2Output();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYnMvdmVjdG9yL3ZlY3Rvci50cyIsImxpYnMvdXRpbHMvcm5nLnRzIiwibGlicy91dGlscy9zdG9yZS50cyIsImxpYnMvdXRpbHMvdGFibGUudHMiLCJsaWJzL3V0aWxzL3V0aWxzLnRzIiwibGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJsaWJzL3V0aWxzL2FuaW0udHMiLCJsaWJzL3JlY3QvcmVjdC50cyIsImxpYnMvZXZlbnQvZXZlbnRxdWV1ZS50cyIsImxpYnMvZXZlbnQvZXZlbnRzeXN0ZW0udHMiLCJwYXJzZXIudHMiLCJtYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sTUFBTTtJQUdSLFlBQVksR0FBRyxJQUFhO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsUUFBd0M7UUFDeEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO1lBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3hCO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMs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