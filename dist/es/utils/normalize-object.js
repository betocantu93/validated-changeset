var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { getChangeValue, isChange } from '../-private/change';
import isObject from './is-object';
/**
 * traverse through target and unset `value` from leaf key so can access normally
 * {
 *  name: Change {
 *    value: 'Charles'
 *  }
 * }
 *
 * to
 *
 * {
 *  name: 'Charles'
 * }
 *
 * Shallow copy here is fine because we are swapping out the leaf nested object
 * rather than mutating a property in something with reference
 *
 * @method normalizeObject
 * @param {Object} target
 * @return {Object}
 */
export default function normalizeObject(target, isObj) {
    if (isObj === void 0) { isObj = isObject; }
    if (!target || !isObj(target)) {
        return target;
    }
    if (isChange(target)) {
        return getChangeValue(target);
    }
    var obj = __assign({}, target);
    for (var key in obj) {
        var next = obj[key];
        if (next && isObj(next)) {
            if (isChange(next)) {
                obj[key] = getChangeValue(next);
            }
            else {
                try {
                    JSON.stringify(next);
                }
                catch (e) {
                    break;
                }
                obj[key] = normalizeObject(next);
            }
        }
    }
    return obj;
}
//# sourceMappingURL=normalize-object.js.map