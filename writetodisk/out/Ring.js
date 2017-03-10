/// <reference path="Bit.ts" />
/// <reference path="Head.ts" />
/// <reference path="Swap.ts" />
/// <reference path="../node_modules/utilsx/utils.js" />
var State;
(function (State) {
    State[State["rolling"] = 0] = "rolling";
    State[State["writing"] = 1] = "writing";
})(State || (State = {}));
var SwapProgress;
(function (SwapProgress) {
    SwapProgress[SwapProgress["toB"] = 0] = "toB";
    SwapProgress[SwapProgress["toA"] = 1] = "toA";
    SwapProgress[SwapProgress["toB2"] = 2] = "toB2";
})(SwapProgress || (SwapProgress = {}));
class Ring {
    constructor(diskSize, radius, sortingAlgroithm) {
        this.flag = false;
        var values = generateArray(diskSize);
        shuffle(values);
        this.swapIndex = 0;
        this.swaps = [];
        sortingAlgroithm(clone(values), this.swaps);
        this.state = State.rolling;
        this.swapProgress = SwapProgress.toB;
        this.bits = [];
        this.diskSize = diskSize;
        this.spacing = Math.PI * 2 / diskSize;
        this.startMarker = new Bit(new THREE.Vector3(0, -radius, -1), diskSize, diskSize);
        for (var i = 0; i < diskSize; i++) {
            var pos = new THREE.Vector3(0, -radius, 1);
            pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), i * this.spacing);
            var bit = new Bit(pos, values[i], diskSize);
            this.bits.push(bit);
        }
        this.rotationSpeed = 0.05;
        this.currentRotation = 0;
        this.targetRotation = this.spacing * 10;
        this.head = new Head(new THREE.Vector3(0, -radius, 3));
    }
    update() {
        if (this.state == State.rolling) {
            this.setTargetRotation();
            var step = min(this.rotationSpeed, Math.abs(this.targetRotation - this.currentRotation));
            if (this.targetRotation < this.currentRotation)
                step = -step;
            this.currentRotation += step;
            for (var bit of this.bits) {
                bit.mesh.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), -step);
            }
            this.startMarker.mesh.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), -step);
            if (step == 0) {
                this.swapRemember = this.swapProgress;
                this.oldSwapIndex = this.swapIndex;
                if (this.swapProgress == SwapProgress.toB2)
                    this.swapIndex++;
                this.swapProgress = swapMachine.get(this.swapProgress); //go to next state
                this.state = State.writing;
                this.writeCompletion = 0;
            }
        }
        else if (this.state == State.writing) {
            this.writeCompletion += 0.05;
            if (this.writeCompletion >= 1) {
                if (this.swapIndex == this.swaps.length)
                    return;
                this.state = State.rolling;
            }
            if (floatEquals(this.writeCompletion, 0.5)) {
                switch (this.swapRemember) {
                    case SwapProgress.toB:
                        this.head.read(this.bits[this.swaps[this.oldSwapIndex].b]);
                        break;
                    case SwapProgress.toA:
                        this.head.swap(this.bits[this.swaps[this.oldSwapIndex].a]);
                        break;
                    case SwapProgress.toB2:
                        if (this.oldSwapIndex == this.swaps.length)
                            return;
                        this.head.write(this.bits[this.swaps[this.oldSwapIndex].b]);
                        break;
                }
            }
            var y = -(Math.pow(2 * this.writeCompletion - 1, 2)) + 1;
            var target = this.head.originalPosition.clone().add(headSinkDepth);
            this.head.mesh.position.lerpVectors(this.head.originalPosition, target, y);
        }
    }
    setTargetRotation() {
        switch (this.swapProgress) {
            case SwapProgress.toB:
                this.targetRotation = this.swaps[this.swapIndex].b * this.spacing;
                break;
            case SwapProgress.toA:
                this.targetRotation = this.swaps[this.swapIndex].a * this.spacing;
                break;
            case SwapProgress.toB2:
                this.targetRotation = this.swaps[this.swapIndex].b * this.spacing;
                break;
        }
    }
}
var swapMachine = new Map();
swapMachine.set(SwapProgress.toB, SwapProgress.toA);
swapMachine.set(SwapProgress.toA, SwapProgress.toB2);
swapMachine.set(SwapProgress.toB2, SwapProgress.toB);
//# sourceMappingURL=Ring.js.map