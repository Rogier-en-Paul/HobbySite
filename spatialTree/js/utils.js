function clamp(val, min, max){
    if(val < min) return min;
    if(val > max) return max;
    return val;
}

function min(a, b){
    if(a < b)return a;
    return b;
}

function max(a, b){
    if(a > b)return a;
    return b;
}

function pythagoras(a, b){
    return Math.pow(a * a + b * b, 0.5);
}

function inRange(from, to, x){//assumes  from < to
    return x >= min(from, to) && x <= max(from, to);
}

function rangeIntersect(a1,a2,b1,b2){
    return max(a1,a2) >= min(b1, b2) && min(a1, a2) <= max(b1,b2);
}

function rangeContain(a1,a2,b1,b2){//as in does a enclose b----- so returns true if b is smaller in all ways
    return max(a1, a2) >= max(b1, b2) && min(a1,a2) <= max(b1,b2);
}

function getMousePos(e){
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}
