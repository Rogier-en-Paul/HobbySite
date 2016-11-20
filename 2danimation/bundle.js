define("eventHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    class EventHandler {
        // static getInstance():EventHandler{
        //     if(EventHandler.instance == null){
        //         EventHandler.instance = new EventHandler();
        //     }
        //     return EventHandler.instance;
        // }
        static trigger(event, data) {
            if (EventHandler.eventMap.get(event) == null)
                return;
            for (var callback of EventHandler.eventMap.get(event))
                callback(data);
        }
        static subscribe(event, callback) {
            if (EventHandler.eventMap.get(event) == null)
                EventHandler.eventMap.set(event, []);
            EventHandler.eventMap.get(event).push(callback);
        }
        static detach(event, callback) {
            var sublist = EventHandler.eventMap.get(event);
            for (var i = 0; i < sublist.length; i++) {
                var callbackInMap = sublist[i];
                if (callbackInMap == callback) {
                    sublist.splice(i, 1);
                    return;
                }
            }
        }
    }
    EventHandler.eventMap = new Map();
    return EventHandler;
});
define("bone", ["require", "exports", "vector"], function (require, exports, Vector) {
    "use strict";
    class Bone {
        constructor(pos) {
            //sets not nescessary if copy is used
            this.pos = pos;
            this.rotation = new Vector(1, 0);
            this.vertices = [];
            this.children = [];
        }
        add(vector) {
            this.pos.add(vector);
            for (var vertex of this.vertices)
                vertex.add(vector);
            for (var child of this.children)
                child.add(vector);
        }
        subtract(vector) {
            this.pos.subtract(vector);
            for (var vertex of this.vertices)
                vertex.subtract(vector);
            for (var child of this.children)
                child.subtract(vector);
        }
        scale(scalar) {
            this.pos.scale(scalar);
            for (var vertex of this.vertices)
                vertex.scale(scalar);
            for (var child of this.children)
                child.scale(scalar);
        }
        setRotation(r) {
            this.rotate(-Math.atan2(this.rotation.y, this.rotation.x) + r);
            this.rotation = new Vector(1, 0).rotate(r);
        }
        rotate(r, center = this.pos) {
            this.pos.rotate(r, center);
            this.rotation.rotate(r);
            for (var vertex of this.vertices)
                vertex.rotate(r, center);
            for (var child of this.children)
                child.rotate(r, center);
        }
        set(vector) {
            var newSpot = vector;
            if (this.parent)
                newSpot = this.parent.pos.copy().add(vector);
            var change = newSpot.copy().subtract(this.pos);
            this.pos.set(newSpot);
            for (var vertex of this.vertices)
                vertex.add(change);
            for (var child of this.children)
                child.add(change);
        }
        addChild(bone) {
            bone.parent = this;
            this.children.push(bone);
        }
        draw(ctxt) {
            this.pos.draw(ctxt);
            for (var child of this.children)
                child.draw(ctxt);
        }
        copy() {
            var bone = new Bone(this.pos.copy());
            bone.vertices = this.vertices.map((entry) => entry.copy());
            bone.rotation = this.rotation.copy();
            bone.children = this.children.map((entry) => entry.copy());
            for (var child of bone.children)
                child.parent = this;
            return bone;
        }
    }
    return Bone;
});
define("vector", ["require", "exports"], function (require, exports) {
    "use strict";
    class Vector {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        add(vector) {
            this.x += vector.x;
            this.y += vector.y;
            return this;
        }
        subtract(vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            return this;
        }
        length() {
            return Math.pow(this.x * this.x + this.y * this.y, 0.5);
        }
        normalize() {
            var length = this.length();
            return this.scale(1 / length);
        }
        scale(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }
        rotate(r, origin = new Vector()) {
            var offset = this.copy().subtract(origin);
            var x = offset.x * Math.cos(r) - offset.y * Math.sin(r);
            var y = offset.x * Math.sin(r) + offset.y * Math.cos(r);
            offset.x = x;
            offset.y = y;
            var back = offset.add(origin);
            this.x = back.x;
            this.y = back.y;
            return this;
        }
        lerp(vector, weigth) {
            return this.scale(1 - weigth).add(vector.copy().scale(weigth));
        }
        copy() {
            return new Vector(this.x, this.y);
        }
        set(vector) {
            this.x = vector.x;
            this.y = vector.y;
            return this;
        }
        perpDot(vector) {
            return Math.atan2(this.x * vector.y - this.y * vector.x, this.x * vector.x + this.y * vector.y);
        }
        draw(ctxt) {
            var width = 10;
            var half = width / 2;
            ctxt.fillRect(this.x - half, this.y - half, width, width);
        }
    }
    return Vector;
});
define("polygon", ["require", "exports"], function (require, exports) {
    "use strict";
    class Polygon {
        constructor(vertices) {
            this.vertices = vertices;
        }
        stroke(ctxt) {
            ctxt.beginPath();
            for (var vertex of this.vertices)
                ctxt.lineTo(vertex.x, vertex.y);
            ctxt.stroke();
        }
        strokeClose(ctxt) {
            ctxt.beginPath();
            for (var vertex of this.vertices)
                ctxt.lineTo(vertex.x, vertex.y);
            ctxt.closePath();
            ctxt.stroke();
        }
        fill(ctxt) {
            ctxt.beginPath();
            for (var vertex of this.vertices)
                ctxt.lineTo(vertex.x, vertex.y);
            ctxt.fill();
        }
    }
    return Polygon;
});
define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    var utils;
    (function (utils) {
        function map(val1, start1, stop1, start2, stop2) {
            return start2 + (stop2 - start2) * ((val1 - start1) / (stop1 - start1));
        }
        utils.map = map;
        function inRange(min, max, value) {
            if (min > max) {
                var temp = min;
                min = max;
                max = temp;
            }
            return value <= max && value >= min;
        }
        utils.inRange = inRange;
        function line(ctxt, a, b) {
        }
        utils.line = line;
    })(utils || (utils = {}));
    return utils;
});
define("bezier", ["require", "exports", "utils"], function (require, exports, Utils) {
    "use strict";
    class Bezier {
        constructor(path, degree) {
            if (path.length < degree + 1 || path.length % degree == 0)
                throw new Error('path.length < degree + 1 || path.length % degree == 0');
            this.path = path;
            this.degree = degree;
        }
        static pathlerp(t, path) {
            var pos = Utils.map(t, 0, 1, 0, path.length - 1);
            var floor = Math.floor(pos);
            return path[floor].copy().lerp(path[floor + 1], pos - floor);
        }
        static pathquerp(t, path) {
            if (path.length < 3 || path.length % 2 == 0)
                throw new Error('path length must follow pattern 2x + 3 where x cant be negative and must be a whole number');
            var absoluteT = t * (path.length - 1);
            var floor = Math.floor(absoluteT / 2) * 2;
            var ceil = floor + 2;
            return Bezier.bezier(path[floor], path[floor + 1], path[floor + 2], (absoluteT - floor) / (ceil - floor));
        }
        static bezierPath(path, quality) {
            var positions = [Bezier.bezier(path[0], path[1], path[2], 0)];
            for (var i = 2; i < path.length; i += 2) {
                for (var j = 1; j <= quality; j++) {
                    var t = j / quality;
                    positions.push(Bezier.bezier(path[i - 2], path[i - 1], path[i], t));
                }
            }
            return positions;
        }
        static bezier(A, B, C, t) {
            return A.copy().scale(Math.pow((1 - t), 2)).add(B.copy().scale(2 * (1 - t) * t)).add(C.copy().scale(t * t));
        }
        static pathFindRoot(x, path) {
            if (path.length < 4 || (path.length - 1) % 3 != 0)
                throw new Error('path length must follow pattern 3x + 4 where x cant be negative and must be a whole number');
            if (!Utils.inRange(path[0].x, path[path.length - 1].x, x))
                throw new Error('cant guarantee x intersects with the graph');
            for (var i = 0; i < path.length - 3; i += 3) {
                if (Utils.inRange(path[i].x, path[i + 3].x, x))
                    return Bezier.findRoot(path[i], path[i + 1], path[i + 2], path[i + 3], x);
            }
            throw new Error('x outside base points or x out of range of path');
        }
        static findRoot(A, B, C, D, x) {
            var fudge = 0.001;
            var t = 0.5;
            var precision = 0.25;
            var spot = Bezier.cubier(A, B, C, D, t);
            while (!Utils.inRange(spot.x - fudge, spot.x + fudge, x)) {
                if (spot.x > x)
                    t -= precision;
                else
                    t += precision;
                precision /= 2;
                spot = Bezier.cubier(A, B, C, D, t);
            }
            return spot.y;
        }
        static cubier(A, B, C, D, t) {
            var pow = Math.pow;
            var it = 1 - t;
            return A.copy().scale(pow(it, 3)).add(B.copy().scale(3 * pow(it, 2) * t)).add(C.copy().scale(3 * it * t * t)).add(D.copy().scale(pow(t, 3)));
        }
    }
    return Bezier;
});
define("animation", ["require", "exports", "bezier"], function (require, exports, Bezier) {
    "use strict";
    class Animation {
        constructor(bone, graph, property) {
            this.animationPoint = 0;
            this.graph = graph;
            this.bone = bone;
            this.property = property;
        }
        update(dt) {
            this.animationPoint += dt;
            this.animationPoint %= this.graph[this.graph.length - 1].x;
            this.property(this.bone, Bezier.pathFindRoot(this.animationPoint, this.graph));
            // this.property(this.bone, Bezier.pathquerp(this.animationPoint / this.graph[this.graph.length -1].x, this.graph))
        }
    }
    return Animation;
});
define("rig", ["require", "exports", "eventHandler"], function (require, exports, EventHandler) {
    "use strict";
    class Rig {
        constructor() {
            this.animations = [];
            this.polygons = [];
            EventHandler.subscribe('ticktock', (data) => {
                for (var animation of this.animations)
                    animation.update(data.dt);
            });
        }
        draw(ctxt) {
            for (var polygon of this.polygons)
                polygon.stroke(ctxt);
        }
        copy() {
            return null;
        }
    }
    return Rig;
});
define("main", ["require", "exports", "polygon", "vector", "bone", "eventHandler", "rig", "animation"], function (require, exports, Polygon, Vector, Bone, EventHandler, Rig, Animation) {
    "use strict";
    var canvas = document.getElementById('canvas');
    var ctxt = canvas.getContext('2d');
    var lastUpdate = Date.now();
    var dt;
    var pi = Math.PI;
    var canvasContainer = document.querySelector('#canvas-container');
    canvas.width = canvasContainer.offsetWidth - 3;
    canvas.height = canvasContainer.offsetHeight - 3;
    var rig = new Rig();
    //maybe keep default and use copy for posing and animating
    var headMesh = new Polygon([
        new Vector(-50, 250),
        new Vector(0, 200),
        new Vector(50, 250)
    ]);
    rig.polygons.push(headMesh);
    var spineMesh = new Polygon([
        new Vector(),
        new Vector(0, 100),
        new Vector(0, 200)
    ]);
    rig.polygons.push(spineMesh);
    var feetMesh = new Polygon([
        new Vector(-50, 0),
        new Vector(50, 0)
    ]);
    rig.polygons.push(feetMesh);
    var feet = new Bone(new Vector());
    var lowerArm = new Bone(new Vector());
    feet.addChild(lowerArm);
    var upperArm = new Bone(spineMesh.vertices[1].copy());
    lowerArm.addChild(upperArm);
    var head = new Bone(spineMesh.vertices[2].copy());
    upperArm.addChild(head);
    rig.bone = feet;
    feet.vertices = feetMesh.vertices;
    lowerArm.vertices.push(spineMesh.vertices[0]);
    upperArm.vertices.push(spineMesh.vertices[1]);
    head.vertices.push(spineMesh.vertices[2]);
    head.vertices = head.vertices.concat(headMesh.vertices);
    feet.set(new Vector(400, 400));
    feet.setRotation(pi);
    //feet position x, y
    rig.animations.push(new Animation(feet, [
        new Vector(0, 400),
        new Vector(0.33, 400),
        new Vector(0.66, 400),
        new Vector(1, 400),
        new Vector(1.33, 400),
        new Vector(1.66, 600),
        new Vector(2, 600),
        new Vector(2.33, 600),
        new Vector(2.66, 600),
        new Vector(3, 600),
    ], (bone, y) => {
        bone.set(new Vector(y, bone.pos.y));
    }));
    rig.animations.push(new Animation(feet, [
        new Vector(0, 400),
        new Vector(0.33, 400),
        new Vector(0.66, 400),
        new Vector(1, 400),
        new Vector(1.4, 200),
        new Vector(1.6, 200),
        new Vector(2, 400),
        new Vector(2.33, 400),
        new Vector(2.66, 400),
        new Vector(3, 400),
    ], (bone, y) => {
        bone.set(new Vector(bone.pos.x, y));
    }));
    // lowerArm rotation
    rig.animations.push(new Animation(lowerArm, [
        new Vector(0, pi * (3 / 4)),
        new Vector(0.2, pi * (3 / 4)),
        new Vector(0.3, pi / 2 + 0.2),
        new Vector(0.5, pi / 2 + 0.2),
        new Vector(0.6, pi / 2 + 0.2),
        new Vector(0.7, pi / 2 + 0.2),
        new Vector(1, pi + 0.2),
        new Vector(1.66, pi + 0.2),
        new Vector(2.33, pi * (1 / 4)),
        new Vector(3, pi * (3 / 4)),
    ], (bone, y) => {
        bone.setRotation(y);
    }));
    //upperArm rotation
    rig.animations.push(new Animation(upperArm, [
        new Vector(0, pi * (5 / 4)),
        new Vector(0.2, pi * (5 / 4)),
        new Vector(0.3, pi * (6 / 4)),
        new Vector(0.5, pi * (6 / 4)),
        new Vector(0.6, pi * (6 / 4)),
        new Vector(0.7, pi),
        new Vector(1, pi + 0.2),
        new Vector(2.33, pi * (5 / 4)),
        new Vector(2.66, pi * (5 / 4)),
        new Vector(3, pi * (5 / 4)),
    ], (bone, y) => {
        bone.setRotation(y);
    }));
    //head rotation
    rig.animations.push(new Animation(head, [
        new Vector(0, pi * (6 / 4)),
        new Vector(0.2, pi * (6 / 4)),
        new Vector(0.3, pi * (4.5 / 4)),
        new Vector(0.5, pi * (4.5 / 4)),
        new Vector(0.6, pi * (4.5 / 4)),
        new Vector(0.7, pi * (4.5 / 4)),
        new Vector(1, pi * (4.5 / 4)),
        new Vector(2.33, pi * (9 / 4)),
        new Vector(2.66, pi * (6 / 4)),
        new Vector(3, pi * (6 / 4)),
    ], (bone, y) => {
        bone.setRotation(y);
    }));
    setInterval(function () {
        var now = Date.now();
        dt = (now - lastUpdate) / 1000;
        lastUpdate = now;
        EventHandler.trigger('ticktock', { dt });
        draw();
    }, 1000 / 60);
    function draw() {
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
        rig.draw(ctxt);
        feet.draw(ctxt);
    }
});
//# sourceMappingURL=bundle.js.map