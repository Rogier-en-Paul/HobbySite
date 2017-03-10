function heapSort(array, swaps) {
    heapify(array, swaps);
    for (var i = 0; i < array.length - 1; i++) {
        swap(array, 0, array.length - 1 - i);
        swaps.push({ a: 0, b: array.length - 1 - i });
        bubbleDown(array, 0, array.length - 1 - i, swaps);
    }
}
function heapify(array, swaps) {
    for (var i = 1; i < array.length; i++) {
        bubbleUp(array, i, swaps);
    }
}
function bubbleUp(array, i, swaps) {
    if (i == 0)
        return;
    var pa = getParent(i);
    if (array[i] > array[pa]) {
        swap(array, i, pa);
        swaps.push({ a: i, b: pa });
        bubbleUp(array, pa, swaps);
    }
}
function bubbleDown(array, i, length, swaps) {
    var bigChild = leftChild(i);
    if (bigChild >= length)
        return;
    var rchild = rightChild(i);
    if (rchild < length && array[rchild] > array[bigChild])
        bigChild = rchild;
    if (array[i] > array[bigChild])
        return; //if current element is bigger and thus in the right spot, just return
    else {
        swap(array, i, bigChild);
        swaps.push({ a: i, b: bigChild });
    }
    bubbleDown(array, bigChild, length, swaps);
}
function getParent(i) {
    return Math.floor((i - 1) / 2);
}
function leftChild(i) {
    return i * 2 + 1;
}
function rightChild(i) {
    return i * 2 + 2;
}
function bubbleSort(array, swaps) {
    var swapped = true;
    var toSort = array.length;
    while (swapped) {
        swapped = false;
        for (var i = 1; i < toSort; i++) {
            if (array[i - 1] > array[i]) {
                swap(array, i - 1, i);
                swaps.push({ a: i - 1, b: i });
                swapped = true;
            }
        }
        toSort--;
    }
}
function insertionSort(array, swaps) {
    for (var i = 1; i < array.length; i++) {
        for (var j = i; j > 0; j--) {
            if (array[j - 1] > array[j]) {
                swaps.push({ a: j - 1, b: j });
                swap(array, j - 1, j);
            }
            else
                break;
        }
    }
}
function quikSort(array, swaps) {
    quikSortPr(array, 0, array.length - 1, swaps);
}
function quikSortPr(array, low, high, swaps) {
    if (low >= high)
        return;
    var pivot = array[Math.floor((low + high) / 2)];
    var wall = partition(array, low, high, pivot, swaps);
    quikSortPr(array, low, wall - 1, swaps);
    quikSortPr(array, wall, high, swaps);
}
function partition(array, low, high, pivot, swaps) {
    var left = low;
    var right = high;
    while (left <= right) {
        while (array[left] < pivot)
            left++;
        while (array[right] > pivot)
            right--;
        if (left <= right) {
            if (left != right) {
                swap(array, left, right);
                swaps.push({ a: left, b: right });
            }
            left++;
            right--;
        }
    }
    return left;
}
function swap(array, a, b) {
    var temp = array[a]; //go to b, store color in head
    array[a] = array[b]; //go to a, swap color in a with color in head
    array[b] = temp; //go to b, set to color to head(a)
}
function _mergeSort(array) {
    mergeSort(array, 0, array.length, []);
}
function mergeSort(array, from, to, temp) {
    if (to - from < 2)
        return;
    var middle = Math.floor((from + to) / 2);
    mergeSort(array, from, middle, temp);
    mergeSort(array, middle, to, temp);
    merge(array, from, middle, to, temp);
}
function merge(array, from, middle, end, scratch) {
    var left = from;
    var right = middle;
    var index = left;
    while (left < middle && right < end) {
        if (array[left] < array[right]) {
            scratch[index] = array[left];
            left++;
        }
        else {
            scratch[index] = array[right];
            right++;
        }
        index++;
    }
    copy(array, left, scratch, index, middle - left);
    copy(array, right, scratch, index, end - right);
    copy(scratch, from, array, from, end - from);
}
function copy(source, srcFrom, dest, destFrom, length) {
    for (var i = srcFrom; i < srcFrom + length; i++)
        dest[destFrom++] = source[i];
}
function clone(array) {
    var clone = [];
    copy(array, 0, clone, 0, array.length);
    return clone;
}
function generateArray(diskSize) {
    var values = [];
    for (var i of iter(diskSize))
        values[i] = i;
    return values;
}
function shuffle(array) {
    var m = array.length, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        swap(array, m, i);
    }
    return array;
}
//# sourceMappingURL=sorts.js.map