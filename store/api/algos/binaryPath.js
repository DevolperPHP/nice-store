const binaryPath = (value, arr) => {
    let left = 0;
    let right = arr.length - 1;
   
    while (left <= right) {
        let middle = left + Math.floor((right - left) / 2);
        let res = value.localeCompare(arr[middle].path);
        if (res === 0) return arr[middle];
        if (res > 0) {
            arr[left = middle + 1]
        }
        else {
            arr[right = middle - 1]
        }
    }
    if (value == arr[arr.length - 1].path) return arr[arr.length - 1];
    return null
}
module.exports = binaryPath