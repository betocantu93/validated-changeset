import setDeep from './set-deep';
var keys = Object.keys;
/**
 * Given an array of objects, merge their keys into a new object and
 * return the new object.
 *
 * This function merges using `setNestedProperty`.
 */
export default function mergeNested() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var finalObj = {};
    objects.forEach(function (obj) { return keys(obj).forEach(function (key) { return setDeep(finalObj, key, obj[key]); }); });
    return finalObj;
}
//# sourceMappingURL=merge-nested.js.map