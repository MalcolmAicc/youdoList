export default function deepClone(obj, newObj) {
    var newObj = newObj || {};
    for (let key in obj) {
        if (typeof obj[key] == 'object') {
            newObj[key] = (obj[key].constructor === Array) ? [] : {}
            deepClone(obj[key], newObj[key]);
        } else {
            newObj[key] = obj[key]
        }
    }
    return newObj;
}
