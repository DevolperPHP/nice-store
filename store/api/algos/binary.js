const binary = (value, arr) => {
    let left = 0;
    let right = arr.length - 1;
    if (!value) return null
    while (left <= right) {
        let middle = left + Math.floor((right - left) / 2);
        let res = value.localeCompare(arr[middle].email);
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
module.exports = binary