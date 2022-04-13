export function toggleInArray(array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    } else {
        array.push(value);
    }
    return array;
}

export function isInArray(array, value) {
    const index = array.indexOf(value);
    return index > -1;
}

export function objectToQueryString(obj) {
    const str = [];
    for (let p in obj)
        if (Object.prototype.hasOwnProperty.call(obj, p) && encodeURIComponent(obj[p]) !== "") {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}
