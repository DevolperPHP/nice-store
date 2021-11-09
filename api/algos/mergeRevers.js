const merge = (arr) => {
    if (arr.length < 2) return arr;
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return mergeArr(merge(left), merge(right));
}
const mergeArr = (left, right) => {
    const result = [];

    while (left.length && right.length) {
        if (left[0].score >= right[0].score) {
            result.push(left.shift())
        }
        else {
            result.push(right.shift())
        }
    }
    while (left.length) {
        result.push(left.shift())
    }
    while (right.length) {
        result.push(right.shift())
    }
    return result
}
module.exports = merge