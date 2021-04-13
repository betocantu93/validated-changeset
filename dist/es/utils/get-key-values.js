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
import { getChangeValue, isChange } from '../-private/change';
import isObject from './is-object';
import Err from '../-private/err';
/**
 * traverse through target and return leaf nodes with `value` property and key as 'person.name'
 *
 * @method getKeyValues
 * @return {Array} [{ 'person.name': value }]
 */
export function getKeyValues(obj, keysUpToValue) {
    if (keysUpToValue === void 0) { keysUpToValue = []; }
    var map = [];
    for (var key in obj) {
        if (obj[key] && isObject(obj[key])) {
            if (isChange(obj[key])) {
                map.push({ key: __spread(keysUpToValue, [key]).join('.'), value: getChangeValue(obj[key]) });
            }
            else {
                map.push.apply(map, __spread(getKeyValues(obj[key], __spread(keysUpToValue, [key]))));
            }
        }
    }
    return map;
}
/**
 * traverse through target and return leaf nodes with `value` property and key as 'person.name'
 *
 * @method getKeyErrorValues
 * @return {Array} [{ key: 'person.name', validation: '', value: '' }]
 */
export function getKeyErrorValues(obj, keysUpToValue) {
    if (keysUpToValue === void 0) { keysUpToValue = []; }
    var map = [];
    for (var key in obj) {
        if (obj[key] && isObject(obj[key])) {
            if (Object.prototype.hasOwnProperty.call(obj[key], 'value') &&
                obj[key] instanceof Err) {
                map.push({
                    key: __spread(keysUpToValue, [key]).join('.'),
                    validation: obj[key].validation,
                    value: obj[key].value
                });
            }
            else if (key !== 'value') {
                map.push.apply(map, __spread(getKeyErrorValues(obj[key], __spread(keysUpToValue, [key]))));
            }
        }
    }
    return map;
}
//# sourceMappingURL=get-key-values.js.map