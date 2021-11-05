const binaryId = (value, arr) => {
    let left = 0;
    let right = arr.length - 1;
    if (!value) return null;

    if (value === arr[0]) return arr[0];

    if (value === [right]) return arr[right];

    while (left <= right) {
        let middle = left + Math.floor((right - left) / 2);
        let res = value.localeCompare(arr[middle]._id);

        if (res === 0) return arr[middle];

        if (res > 0) {
            arr[left = middle + 1]
        }
        else {
            arr[right = middle - 1]
        }
    }
    return null
}
module.exports = binaryId