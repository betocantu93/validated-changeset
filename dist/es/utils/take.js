export default function take(originalObj, keysToTake) {
    if (originalObj === void 0) { originalObj = {}; }
    if (keysToTake === void 0) { keysToTake = []; }
    var newObj = {};
    for (var key in originalObj) {
        if (keysToTake.indexOf(key) !== -1) {
            newObj[key] = originalObj[key];
        }
    }
    return newObj;
}
//# sourceMappingURL=take.js.map