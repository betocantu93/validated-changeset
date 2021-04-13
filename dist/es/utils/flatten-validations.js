var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import isObject from './is-object';
function flatten(validatorMap, obj, keys, keysUpToFunction) {
    var e_1, _a;
    if (keysUpToFunction === void 0) { keysUpToFunction = []; }
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            var value = validatorMap[key];
            if (typeof value.validate === 'function') {
                // class with .validate function
                obj[key] = value;
            }
            else if (isObject(value)) {
                flatten(value, obj, Object.keys(value), __spread(keysUpToFunction, [key]));
            }
            else if (typeof value === 'function') {
                var dotSeparatedKeys = __spread(keysUpToFunction, [key]).join('.');
                obj[dotSeparatedKeys] = value;
            }
            else if (Array.isArray(value)) {
                var isAllFuncs = value.every(function (item) { return typeof item === 'function' || typeof item.validate === 'function'; });
                if (isAllFuncs) {
                    var dotSeparatedKeys = __spread(keysUpToFunction, [key]).join('.');
                    obj[dotSeparatedKeys] = value;
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return obj;
}
/**
 * With nested validations, we flatten to a dot separated 'user.email': validationFunc
 * Once doing so, validation will happen with a single level key or dot separated key
 *
 * @method flattenValidations
 * @return {object}
 */
export function flattenValidations(validatorMap) {
    if (!validatorMap) {
        return {};
    }
    var obj = {};
    return flatten(validatorMap, obj, Object.keys(validatorMap));
}
//# sourceMappingURL=flatten-validations.js.map