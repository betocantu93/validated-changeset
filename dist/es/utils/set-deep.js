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
import Change, { getChangeValue, isChange } from '../-private/change';
import isObject from './is-object';
import { isArrayObject } from './array-object';
function split(path) {
    var keys = path.split('.');
    return keys;
}
function findSiblings(target, keys) {
    var _a = __read(keys.slice(-1), 1), leafKey = _a[0];
    var remaining = Object.keys(target)
        .filter(function (k) { return k !== leafKey; })
        .reduce(function (acc, key) {
        acc[key] = target[key];
        return acc;
    }, Object.create(null));
    return __assign({}, remaining);
}
function isValidKey(key) {
    return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}
/**
 * TODO: consider
 * https://github.com/emberjs/ember.js/blob/822452c4432620fc67a777aba3b150098fd6812d/packages/%40ember/-internals/metal/lib/property_set.ts
 *
 * Handles both single path or nested string paths ('person.name')
 *
 * @method setDeep
 */
export default function setDeep(target, path, value, options) {
    if (options === void 0) { options = { safeSet: undefined, safeGet: undefined }; }
    var keys = split(path).filter(isValidKey);
    // We will mutate target and through complex reference, we will mutate the orig
    var orig = target;
    options.safeSet =
        options.safeSet ||
            function (obj, key, value) {
                return (obj[key] = value);
            };
    options.safeGet =
        options.safeGet ||
            function (obj, key) {
                return obj ? obj[key] : obj;
            };
    if (keys.length === 1) {
        options.safeSet(target, path, value);
        return target;
    }
    for (var i = 0; i < keys.length; i++) {
        var prop = keys[i];
        if (Array.isArray(target) && parseInt(prop, 10) < 0) {
            throw new Error('Negative indices are not allowed as arrays do not serialize values at negative indices');
        }
        var isObj = isObject(options.safeGet(target, prop));
        var isArray = Array.isArray(options.safeGet(target, prop));
        var isComplex = isObj || isArray;
        if (!isComplex) {
            options.safeSet(target, prop, {});
        }
        else if (isComplex && isChange(options.safeGet(target, prop))) {
            var changeValue = getChangeValue(options.safeGet(target, prop));
            if (isObject(changeValue)) {
                // if an object, we don't want to lose sibling keys
                var siblings = findSiblings(changeValue, keys);
                var resolvedValue = isChange(value) ? getChangeValue(value) : value;
                var isArrayLike = Array.isArray(target) || isArrayObject(target);
                var nestedKeys = isArrayLike
                    ? keys.slice(i + 1, keys.length).join('.') // remove first key segment as well as the index
                    : keys.slice(1, keys.length).join('.'); // remove first key segment
                var newValue = void 0;
                // if the resolved value was deleted (via setting to null or undefined),
                // there is no need to setDeep. We can short-circuit that and set
                // newValue directly because of the shallow value
                if (isArrayLike && !resolvedValue) {
                    newValue = resolvedValue;
                }
                else {
                    newValue = setDeep(siblings, nestedKeys, resolvedValue, options);
                }
                options.safeSet(target, prop, new Change(newValue));
                // since we are done with the `path`, we can terminate the for loop and return control
                break;
            }
            else {
                // we don't want to merge new changes with a Change instance higher up in the obj tree
                // thus we nullify the current Change instance to
                options.safeSet(target, prop, {});
            }
        }
        // last iteration, set and return control
        if (i === keys.length - 1) {
            options.safeSet(target, prop, value);
            break;
        }
        // assign next level of object for next loop
        target = options.safeGet(target, prop);
    }
    return orig;
}
//# sourceMappingURL=set-deep.js.map