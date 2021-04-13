var getOwnPropertyDescriptors;
if (Object.getOwnPropertyDescriptors !== undefined) {
    getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
}
else {
    getOwnPropertyDescriptors = function (obj) {
        var desc = {};
        Object.keys(obj).forEach(function (key) {
            desc[key] = Object.getOwnPropertyDescriptor(obj, key);
        });
        return desc;
    };
}
// keep getters and setters
export default function pureAssign() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    return objects.reduce(function (acc, obj) {
        return Object.defineProperties(acc, getOwnPropertyDescriptors(obj));
    }, {});
}
//# sourceMappingURL=assign.js.map