function isObject(val) {
    return (val !== null &&
        typeof val === 'object' &&
        !(val instanceof Date || val instanceof RegExp) &&
        !Array.isArray(val));
}

/* import { IChange } from '../types'; */
var VALUE = Symbol('__value__');
var Change = /** @class */ (function () {
    function Change(value) {
        this[VALUE] = value;
    }
    return Change;
}());
// TODO: not sure why this function type guard isn't working
var isChange = function (maybeChange) {
    return isObject(maybeChange) && VALUE in maybeChange;
};
function getChangeValue(maybeChange) {
    if (isChange(maybeChange)) {
        return maybeChange[VALUE];
    }
}

var Err = /** @class */ (function () {
    function Err(value, validation) {
        this.value = value;
        this.validation = validation;
    }
    return Err;
}());

var __read = (undefined && undefined.__read) || function (o, n) {
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
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
/**
 * traverse through target and return leaf nodes with `value` property and key as 'person.name'
 *
 * @method getKeyValues
 * @return {Array} [{ 'person.name': value }]
 */
function getKeyValues(obj, keysUpToValue) {
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
function getKeyErrorValues(obj, keysUpToValue) {
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

function isPromiseLike(obj) {
    return (!!obj &&
        !!obj.then &&
        !!obj.catch &&
        !!obj.finally &&
        typeof obj.then === 'function' &&
        typeof obj.catch === 'function' &&
        typeof obj.finally === 'function');
}
function isPromise(obj) {
    return isObject(obj) && isPromiseLike(obj);
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Rejects `true` values from an array of validations. Returns `true` when there
 * are no errors, or the error object if there are errors.
 *
 * @private
 * @param  {Array} validations
 * @return {Promise<boolean|Any>}
 */
function handleValidationsAsync(validations) {
    return __awaiter(this, void 0, void 0, function () {
        var result, maybeFailed, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all(validations)];
                case 1:
                    result = _a.sent();
                    maybeFailed = result.filter(function (val) { return typeof val !== 'boolean' && val; });
                    return [2 /*return*/, maybeFailed.length === 0 || maybeFailed];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, e_1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Rejects `true` values from an array of validations. Returns `true` when there
 * are no errors, or the error object if there are errors.
 *
 * @private
 * @param  {Array} validations
 * @return {boolean|Any}
 */
function handleValidationsSync(validations) {
    var maybeFailed = validations.filter(function (val) { return typeof val !== 'boolean' && val; });
    return maybeFailed.length === 0 || maybeFailed;
}
/**
 * Handles an array of validators and returns Promise.all if any value is a
 * Promise.
 *
 * @public
 * @param  {Array} validators Array of validator functions
 * @param  {String} options.key
 * @param  {Any} options.newValue
 * @param  {Any} options.oldValue
 * @param  {Object} options.changes
 * @param  {Object} options.content
 * @return {Promise|boolean|Any}
 */
function handleMultipleValidations(validators, _a) {
    var key = _a.key, newValue = _a.newValue, oldValue = _a.oldValue, changes = _a.changes, content = _a.content;
    var validations = Array.from(validators.map(function (validator) {
        var isValidatorClass = function (maybeClass) {
            return !!maybeClass.validate;
        };
        if (validator && isValidatorClass(validator)) {
            validator = validator.validate.bind(validator);
        }
        return validator(key, newValue, oldValue, changes, content);
    }));
    if (validations.some(isPromise)) {
        return Promise.all(validations).then(handleValidationsAsync);
    }
    return handleValidationsSync(validations);
}

/**
 * Handles both single key or nested string keys ('person.name')
 *
 * @method getDeep
 */
function getDeep(root, path) {
    var obj = root;
    if (path.indexOf('.') === -1) {
        return obj[path];
    }
    var parts = typeof path === 'string' ? path.split('.') : path;
    for (var i = 0; i < parts.length; i++) {
        if (obj === undefined || obj === null) {
            return undefined;
        }
        // next iteration has next level
        obj = obj[parts[i]];
    }
    return obj;
}
/**
 * Returns subObject while skipping `Change` instances
 *
 * @method getSubObject
 */
function getSubObject(root, path) {
    var obj = root;
    if (path.indexOf('.') === -1) {
        return obj[path];
    }
    var parts = typeof path === 'string' ? path.split('.') : path;
    for (var i = 0; i < parts.length; i++) {
        if (obj === undefined || obj === null) {
            return undefined;
        }
        if (isChange(obj[parts[i]])) {
            obj = getChangeValue(obj[parts[i]]);
        }
        else {
            obj = obj[parts[i]];
        }
    }
    return obj;
}

/**
 * returns a closure to lookup and validate k/v pairs set on a changeset
 *
 * @method lookupValidator
 * @param validationMap
 */
function lookupValidator(validationMap) {
    return function (_a) {
        var key = _a.key, newValue = _a.newValue, oldValue = _a.oldValue, changes = _a.changes, content = _a.content;
        var validations = validationMap || {};
        var validator = getDeep(validations, key);
        var isValidatorClass = function (maybeClass) {
            return !!maybeClass.validate;
        };
        if (validator && isValidatorClass(validator)) {
            validator = validator.validate.bind(validator);
        }
        if (!validator || isObject(validator)) {
            return true;
        }
        var validation;
        if (Array.isArray(validator)) {
            validation = handleMultipleValidations(validator, {
                key: key,
                newValue: newValue,
                oldValue: oldValue,
                changes: changes,
                content: content
            });
        }
        else {
            validation = validator(key, newValue, oldValue, changes, content);
        }
        return isPromise(validation)
            ? validation.then(function (result) {
                return result;
            })
            : validation;
    };
}

// this statefull class holds and notifies
var __read$1 = (undefined && undefined.__read) || function (o, n) {
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
var __spread$1 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$1(arguments[i]));
    return ar;
};
var Notifier = /** @class */ (function () {
    function Notifier() {
        this.listeners = [];
    }
    Notifier.prototype.addListener = function (callback) {
        var _this = this;
        this.listeners.push(callback);
        return function () { return _this.removeListener(callback); };
    };
    Notifier.prototype.removeListener = function (callback) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === callback) {
                this.listeners.splice(i, 1);
                return;
            }
        }
    };
    Notifier.prototype.trigger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.listeners.forEach(function (callback) { return callback.apply(void 0, __spread$1(args)); });
    };
    return Notifier;
}());

function notifierForEvent(object, eventName) {
    if (object._eventedNotifiers === undefined) {
        object._eventedNotifiers = {};
    }
    var notifier = object._eventedNotifiers[eventName];
    if (!notifier) {
        notifier = object._eventedNotifiers[eventName] = new Notifier();
    }
    return notifier;
}

var __values = (undefined && undefined.__values) || function(o) {
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
function hasKey(record, path, safeGet) {
    var e_1, _a;
    var keys = path.split('.');
    var obj = record;
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            if (!obj || !Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
            obj = safeGet(obj, key);
            if (isChange(obj)) {
                obj = getChangeValue(obj);
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
    return true;
}
function pathInChanges(record, path, safeGet) {
    var e_2, _a;
    if (isChange(record)) {
        return false;
    }
    var keys = path.split('.');
    var obj = record;
    try {
        for (var keys_2 = __values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
            var key = keys_2_1.value;
            if (!obj) {
                return false;
            }
            if (keys[keys.length - 1] !== key && isChange(safeGet(obj, key))) {
                return true;
            }
            obj = safeGet(obj, key);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (keys_2_1 && !keys_2_1.done && (_a = keys_2.return)) _a.call(keys_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return false;
}

var __assign = (undefined && undefined.__assign) || function () {
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
function normalizeObject(target, isObj) {
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

function hasChanges(changes) {
    for (var key in changes) {
        if (isChange(changes[key])) {
            return true;
        }
        if (isObject(changes[key])) {
            var isTruthy = hasChanges(changes[key]);
            if (isTruthy) {
                return isTruthy;
            }
        }
    }
    return false;
}

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
function pureAssign() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    return objects.reduce(function (acc, obj) {
        return Object.defineProperties(acc, getOwnPropertyDescriptors(obj));
    }, {});
}

var __values$1 = (undefined && undefined.__values) || function(o) {
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
var __read$2 = (undefined && undefined.__read) || function (o, n) {
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
var __spread$2 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$2(arguments[i]));
    return ar;
};
function flatten(validatorMap, obj, keys, keysUpToFunction) {
    var e_1, _a;
    if (keysUpToFunction === void 0) { keysUpToFunction = []; }
    try {
        for (var keys_1 = __values$1(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            var value = validatorMap[key];
            if (typeof value.validate === 'function') {
                // class with .validate function
                obj[key] = value;
            }
            else if (isObject(value)) {
                flatten(value, obj, Object.keys(value), __spread$2(keysUpToFunction, [key]));
            }
            else if (typeof value === 'function') {
                var dotSeparatedKeys = __spread$2(keysUpToFunction, [key]).join('.');
                obj[dotSeparatedKeys] = value;
            }
            else if (Array.isArray(value)) {
                var isAllFuncs = value.every(function (item) { return typeof item === 'function' || typeof item.validate === 'function'; });
                if (isAllFuncs) {
                    var dotSeparatedKeys = __spread$2(keysUpToFunction, [key]).join('.');
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
function flattenValidations(validatorMap) {
    if (!validatorMap) {
        return {};
    }
    var obj = {};
    return flatten(validatorMap, obj, Object.keys(validatorMap));
}

var CHANGESET = '__CHANGESET__';
function isChangeset(changeset) {
    return changeset && changeset['__changeset__'] === CHANGESET;
}

var __read$3 = (undefined && undefined.__read) || function (o, n) {
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
function keyInObject(obj, key) {
    var _a = __read$3(key.split('.')), baseKey = _a[0], keys = _a.slice(1);
    if (!baseKey || !(baseKey in obj)) {
        return false;
    }
    if (!keys.length) {
        return !!obj[baseKey];
    }
    var value = obj[baseKey];
    if (value !== null && typeof value === 'object') {
        return keyInObject(obj[baseKey], keys.join('.'));
    }
    return false;
}

var __values$2 = (undefined && undefined.__values) || function(o) {
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
var __read$4 = (undefined && undefined.__read) || function (o, n) {
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
function isArrayObject(obj) {
    if (!obj)
        return false;
    var maybeIndicies = Object.keys(obj);
    return maybeIndicies.every(function (key) { return Number.isInteger(parseInt(key, 10)); });
}
function arrayToObject(array) {
    return array.reduce(function (obj, item, index) {
        obj[index] = item;
        return obj;
    }, {});
}
function objectToArray(obj) {
    var e_1, _a;
    var result = [];
    try {
        for (var _b = __values$2(Object.entries(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read$4(_c.value, 2), index = _d[0], value = _d[1];
            result[parseInt(index, 10)] = value;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}

var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
var __read$5 = (undefined && undefined.__read) || function (o, n) {
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
function split(path) {
    var keys = path.split('.');
    return keys;
}
function findSiblings(target, keys) {
    var _a = __read$5(keys.slice(-1), 1), leafKey = _a[0];
    var remaining = Object.keys(target)
        .filter(function (k) { return k !== leafKey; })
        .reduce(function (acc, key) {
        acc[key] = target[key];
        return acc;
    }, Object.create(null));
    return __assign$1({}, remaining);
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
function setDeep(target, path, value, options) {
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

var keys = Object.keys;
/**
 * Given an array of objects, merge their keys into a new object and
 * return the new object.
 *
 * This function merges using `setNestedProperty`.
 */
function mergeNested() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var finalObj = {};
    objects.forEach(function (obj) { return keys(obj).forEach(function (key) { return setDeep(finalObj, key, obj[key]); }); });
    return finalObj;
}

var __values$3 = (undefined && undefined.__values) || function(o) {
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
function buildOldValues(content, changes, getDeep) {
    var e_1, _a;
    var obj = Object.create(null);
    try {
        for (var changes_1 = __values$3(changes), changes_1_1 = changes_1.next(); !changes_1_1.done; changes_1_1 = changes_1.next()) {
            var change = changes_1_1.value;
            obj[change.key] = getDeep(content, change.key);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (changes_1_1 && !changes_1_1.done && (_a = changes_1.return)) _a.call(changes_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return obj;
}

var __read$6 = (undefined && undefined.__read) || function (o, n) {
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
var __spread$3 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$6(arguments[i]));
    return ar;
};
function isNonNullObject(value) {
    return !!value && typeof value === 'object';
}
function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]';
}
function isMergeableObject(value) {
    return isNonNullObject(value) && !isSpecial(value);
}
function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols
        ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
            return target.propertyIsEnumerable(symbol);
        })
        : [];
}
function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
}
function propertyIsOnObject(object, property) {
    try {
        return property in object;
    }
    catch (_) {
        return false;
    }
}
// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
    return (propertyIsOnObject(target, key) && // Properties are safe to merge if they don't exist in the target yet,
        // unsafe if they exist up the prototype chain and also unsafe if they're nonenumerable.
        !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key)));
}
/**
 * DFS - traverse depth first until find object with `value`.  Then go back up tree and try on next key
 * Need to exhaust all possible avenues.
 *
 * @method buildPathToValue
 */
function buildPathToValue(source, options, kv, possibleKeys) {
    Object.keys(source).forEach(function (key) {
        var possible = source[key];
        if (possible && isChange(possible)) {
            kv[__spread$3(possibleKeys, [key]).join('.')] = getChangeValue(possible);
            return;
        }
        if (possible && typeof possible === 'object') {
            buildPathToValue(possible, options, kv, __spread$3(possibleKeys, [key]));
        }
    });
    return kv;
}
/**
 * `source` will always have a leaf key `value` with the property we want to set
 *
 * @method mergeTargetAndSource
 */
function mergeTargetAndSource(target, source, options) {
    options.getKeys(source).forEach(function (key) {
        // proto poisoning.  So can set by nested key path 'person.name'
        if (options.propertyIsUnsafe(target, key)) {
            // if safeSet, we will find keys leading up to value and set
            if (options.safeSet) {
                var kv = buildPathToValue(source, options, {}, []);
                // each key will be a path nested to the value `person.name.other`
                if (Object.keys(kv).length > 0) {
                    // we found some keys!
                    for (key in kv) {
                        var val = kv[key];
                        options.safeSet(target, key, val);
                    }
                }
            }
            return;
        }
        // else safe key on object
        if (propertyIsOnObject(target, key) &&
            isMergeableObject(source[key]) &&
            !isChange(source[key])) {
            options.safeSet(target, key, mergeDeep(options.safeGet(target, key), options.safeGet(source, key), options));
        }
        else {
            var next = source[key];
            if (next && isChange(next)) {
                return options.safeSet(target, key, getChangeValue(next));
            }
            return options.safeSet(target, key, normalizeObject(next));
        }
    });
    return target;
}
/**
 * goal is to mutate target with source's properties, ensuring we dont encounter
 * pitfalls of { ..., ... } spread syntax overwriting keys on objects that we merged
 *
 * This is also adjusted for Ember peculiarities.  Specifically `options.setPath` will allows us
 * to handle properties on Proxy objects (that aren't the target's own property)
 *
 * @method mergeDeep
 */
function mergeDeep(target, source, options) {
    if (options === void 0) { options = {
        safeGet: undefined,
        safeSet: undefined,
        propertyIsUnsafe: undefined,
        getKeys: undefined
    }; }
    options.getKeys = options.getKeys || getKeys;
    options.propertyIsUnsafe = options.propertyIsUnsafe || propertyIsUnsafe;
    options.safeGet =
        options.safeGet ||
            function (obj, key) {
                return obj[key];
            };
    options.safeSet =
        options.safeSet ||
            function (obj, key, value) {
                return (obj[key] = value);
            };
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) {
        var sourceIsArrayLike = isArrayObject(source);
        if (targetIsArray && sourceIsArrayLike) {
            return objectToArray(mergeTargetAndSource(arrayToObject(target), source, options));
        }
        return source;
    }
    else if (sourceIsArray) {
        return source;
    }
    else if (target === null || target === undefined) {
        /**
         * If the target was set to null or undefined, we always want to return the source.
         * There is nothing to merge.
         *
         * Without this explicit check, typeof null === typeof {any object-like thing}
         * which means that mergeTargetAndSource will be called, and you can't merge with null
         */
        return source;
    }
    else {
        return mergeTargetAndSource(target, source, options);
    }
}

var __assign$2 = (undefined && undefined.__assign) || function () {
    __assign$2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};
var objectProxyHandler = {
    /**
     * Priority of access - changes, content, then check node
     * @property get
     */
    get: function (node, key) {
        if (typeof key === 'symbol') {
            return;
        }
        var childValue;
        if (node.changes.hasOwnProperty && node.changes.hasOwnProperty(key)) {
            childValue = node.safeGet(node.changes, key);
            if (typeof childValue === 'undefined') {
                return;
            }
        }
        if (isChange(childValue)) {
            return getChangeValue(childValue);
        }
        if (isObject(childValue)) {
            var childNode = node.children[key];
            if (childNode === undefined && node.content) {
                var childContent = node.safeGet(node.content, key);
                // cache it
                childNode = node.children[key] = new ObjectTreeNode(childValue, childContent, node.safeGet);
            }
            // return proxy if object so we can trap further access to changes or content
            if (childNode) {
                return childNode.proxy;
            }
        }
        if (typeof childValue !== 'undefined') {
            // primitive
            return childValue;
        }
        else if (node.content) {
            var nodeContent = node.content;
            if (node.safeGet(nodeContent, key)) {
                return node.safeGet(nodeContent, key);
            }
        }
        if (typeof node[key] === 'function' || node.hasOwnProperty(key)) {
            return node[key];
        }
    },
    ownKeys: function (node) {
        return Reflect.ownKeys(node.changes);
    },
    getOwnPropertyDescriptor: function (node, prop) {
        return Reflect.getOwnPropertyDescriptor(node.changes, prop);
    },
    has: function (node, prop) {
        return Reflect.has(node.changes, prop);
    },
    set: function (node, key, value) {
        // dont want to set private properties on changes (usually found on outside actors)
        if (key.startsWith('_')) {
            return Reflect.set(node, key, value);
        }
        return Reflect.set(node.changes, key, new Change(value));
    }
};
function defaultSafeGet(obj, key) {
    return obj[key];
}
var ObjectTreeNode = /** @class */ (function () {
    function ObjectTreeNode(changes, content, safeGet, isObject) {
        if (changes === void 0) { changes = {}; }
        if (content === void 0) { content = {}; }
        if (safeGet === void 0) { safeGet = defaultSafeGet; }
        if (isObject === void 0) { isObject = isObject; }
        this.safeGet = safeGet;
        this.isObject = isObject;
        this.changes = changes;
        this.content = content;
        this.proxy = new Proxy(this, objectProxyHandler);
        this.children = Object.create(null);
    }
    ObjectTreeNode.prototype.get = function (key) {
        return this.safeGet(this.changes, key);
    };
    ObjectTreeNode.prototype.set = function (key, value) {
        return setDeep(this.changes, key, value);
    };
    ObjectTreeNode.prototype.unwrap = function () {
        var changes = this.changes;
        if (isObject(changes)) {
            changes = normalizeObject(changes, this.isObject);
            var content = this.content;
            if (isObject(content)) {
                changes = normalizeObject(changes, this.isObject);
                return __assign$2(__assign$2({}, content), changes);
            }
            else if (Array.isArray(content)) {
                changes = normalizeObject(changes, this.isObject);
                return objectToArray(mergeDeep(arrayToObject(content), changes));
            }
        }
        return changes;
    };
    return ObjectTreeNode;
}());

/**
 * Merges all sources together, excluding keys in excludedKeys.
 *
 * @param  {string[]} excludedKeys
 * @param  {...object} sources
 * @return {object}
 */
function objectWithout(excludedKeys) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return sources.reduce(function (acc, source) {
        Object.keys(source)
            .filter(function (key) { return excludedKeys.indexOf(key) === -1 || !source.hasOwnProperty(key); })
            .forEach(function (key) { return (acc[key] = source[key]); });
        return acc;
    }, {});
}

function take(originalObj, keysToTake) {
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

var __assign$3 = (undefined && undefined.__assign) || function () {
    __assign$3 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$3.apply(this, arguments);
};
var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read$7 = (undefined && undefined.__read) || function (o, n) {
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
var __spread$4 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$7(arguments[i]));
    return ar;
};
var keys$1 = Object.keys;
var CONTENT = '_content';
var PREVIOUS_CONTENT = '_previousContent';
var CHANGES = '_changes';
var ERRORS = '_errors';
var VALIDATOR = '_validator';
var OPTIONS = '_options';
var RUNNING_VALIDATIONS = '_runningValidations';
var BEFORE_VALIDATION_EVENT = 'beforeValidation';
var AFTER_VALIDATION_EVENT = 'afterValidation';
var AFTER_ROLLBACK_EVENT = 'afterRollback';
var defaultValidatorFn = function () { return true; };
var defaultOptions = { skipValidate: false };
var DEBUG = process.env.NODE_ENV !== 'production';
function assert(msg, property) {
    if (DEBUG) {
        if (!property) {
            throw new Error(msg);
        }
    }
}
function maybeUnwrapProxy(content) {
    return content;
}
var BufferedChangeset = /** @class */ (function () {
    function BufferedChangeset(obj, validateFn, validationMap, options) {
        if (validateFn === void 0) { validateFn = defaultValidatorFn; }
        if (validationMap === void 0) { validationMap = {}; }
        if (options === void 0) { options = {}; }
        this.validateFn = validateFn;
        this.validationMap = validationMap;
        this.__changeset__ = CHANGESET;
        this._eventedNotifiers = {};
        /**
         * @property isObject
         * @override
         */
        this.isObject = isObject;
        /**
         * @property maybeUnwrapProxy
         * @override
         */
        this.maybeUnwrapProxy = maybeUnwrapProxy;
        /**
         * @property setDeep
         * @override
         */
        this.setDeep = setDeep;
        /**
         * @property getDeep
         * @override
         */
        this.getDeep = getDeep;
        /**
         * @property mergeDeep
         * @override
         */
        this.mergeDeep = mergeDeep;
        this[CONTENT] = obj;
        this[PREVIOUS_CONTENT] = undefined;
        this[CHANGES] = {};
        this[ERRORS] = {};
        this[VALIDATOR] = validateFn;
        this[OPTIONS] = pureAssign(defaultOptions, options);
        this[RUNNING_VALIDATIONS] = {};
    }
    BufferedChangeset.prototype.on = function (eventName, callback) {
        var notifier = notifierForEvent(this, eventName);
        return notifier.addListener(callback);
    };
    BufferedChangeset.prototype.off = function (eventName, callback) {
        var notifier = notifierForEvent(this, eventName);
        return notifier.removeListener(callback);
    };
    BufferedChangeset.prototype.trigger = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var notifier = notifierForEvent(this, eventName);
        if (notifier) {
            notifier.trigger.apply(notifier, __spread$4(args));
        }
    };
    /**
     * @property safeGet
     * @override
     */
    BufferedChangeset.prototype.safeGet = function (obj, key) {
        return obj[key];
    };
    /**
     * @property safeSet
     * @override
     */
    BufferedChangeset.prototype.safeSet = function (obj, key, value) {
        return (obj[key] = value);
    };
    Object.defineProperty(BufferedChangeset.prototype, "_bareChanges", {
        get: function () {
            var obj = this[CHANGES];
            return getKeyValues(obj).reduce(function (newObj, _a) {
                var key = _a.key, value = _a.value;
                newObj[key] = value;
                return newObj;
            }, Object.create(null));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferedChangeset.prototype, "changes", {
        /**
         * @property changes
         * @type {Array}
         */
        get: function () {
            var obj = this[CHANGES];
            // [{ key, value }, ...]
            return getKeyValues(obj);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferedChangeset.prototype, "errors", {
        /**
         * @property errors
         * @type {Array}
         */
        get: function () {
            var obj = this[ERRORS];
            // [{ key, validation, value }, ...]
            return getKeyErrorValues(obj);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferedChangeset.prototype, "change", {
        get: function () {
            var obj = this[CHANGES];
            if (hasChanges(this[CHANGES])) {
                return normalizeObject(obj);
            }
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferedChangeset.prototype, "error", {
        get: function () {
            return this[ERRORS];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferedChangeset.prototype, "data", {
        get: function () {
            return this[CONTENT];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferedChangeset.prototype, "isValid", {
        /**
         * @property isValid
         * @type {Array}
         */
        get: function () {
            return getKeyErrorValues(this[ERRORS]).length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferedChangeset.prototype, "isPristine", {
        /**
         * @property isPristine
         * @type {Boolean}
         */
        get: function () {
            var validationKeys = Object.keys(this[CHANGES]);
            var userChangesetKeys = this[OPTIONS].changesetKeys;
            if (Array.isArray(userChangesetKeys) && userChangesetKeys.length) {
                validationKeys = validationKeys.filter(function (k) { return userChangesetKeys.includes(k); });
            }
            if (validationKeys.length === 0) {
                return true;
            }
            return !hasChanges(this[CHANGES]);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferedChangeset.prototype, "isInvalid", {
        /**
         * @property isInvalid
         * @type {Boolean}
         */
        get: function () {
            return !this.isValid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferedChangeset.prototype, "isDirty", {
        /**
         * @property isDirty
         * @type {Boolean}
         */
        get: function () {
            return !this.isPristine;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Stores change on the changeset.
     * This approximately works just like the Ember API
     *
     * @method setUnknownProperty
     */
    BufferedChangeset.prototype.setUnknownProperty = function (key, value) {
        var config = this[OPTIONS];
        var changesetKeys = config.changesetKeys;
        if (Array.isArray(changesetKeys) && changesetKeys.length > 0) {
            var hasKey_1 = changesetKeys.find(function (chKey) { return key.match(chKey); });
            if (!hasKey_1) {
                return;
            }
        }
        var content = this[CONTENT];
        var oldValue = this.safeGet(content, key);
        var skipValidate = config.skipValidate;
        if (skipValidate) {
            this._setProperty({ key: key, value: value, oldValue: oldValue });
            this._handleValidation(true, { key: key, value: value });
            return;
        }
        this._setProperty({ key: key, value: value, oldValue: oldValue });
        this._validateKey(key, value);
    };
    /**
     * String representation for the changeset.
     */
    BufferedChangeset.prototype.toString = function () {
        var normalisedContent = pureAssign(this[CONTENT], {});
        return "changeset:" + normalisedContent.toString();
    };
    /**
     * Provides a function to run before emitting changes to the model. The
     * callback function must return a hash in the same shape:
     *
     * ```
     * changeset
     *   .prepare((changes) => {
     *     let modified = {};
     *
     *     for (let key in changes) {
     *       modified[underscore(key)] = changes[key];
     *     }
     *
     *    return modified; // { first_name: "Jim", last_name: "Bob" }
     *  })
     *  .execute(); // execute the changes
     * ```
     *
     * @method prepare
     */
    BufferedChangeset.prototype.prepare = function (prepareChangesFn) {
        var changes = this._bareChanges;
        var preparedChanges = prepareChangesFn(changes);
        assert('Callback to `changeset.prepare` must return an object', this.isObject(preparedChanges));
        var newObj = {};
        if (this.isObject(preparedChanges)) {
            var newChanges = keys$1(preparedChanges).reduce(function (newObj, key) {
                newObj[key] = new Change(preparedChanges[key]);
                return newObj;
            }, newObj);
            // @tracked
            this[CHANGES] = newChanges;
        }
        return this;
    };
    /**
     * Executes the changeset if in a valid state.
     *
     * @method execute
     */
    BufferedChangeset.prototype.execute = function () {
        var oldContent;
        if (this.isValid && this.isDirty) {
            var content = this[CONTENT];
            var changes = this[CHANGES];
            // keep old values in case of error and we want to rollback
            oldContent = buildOldValues(content, this.changes, this.getDeep);
            // we want mutation on original object
            // @tracked
            this[CONTENT] = this.mergeDeep(content, changes);
        }
        // trigger any registered callbacks by same keyword as method name
        this.trigger('execute');
        this[CHANGES] = {};
        this[PREVIOUS_CONTENT] = oldContent;
        return this;
    };
    BufferedChangeset.prototype.unexecute = function () {
        if (this[PREVIOUS_CONTENT]) {
            this[CONTENT] = this.mergeDeep(this[CONTENT], this[PREVIOUS_CONTENT], {
                safeGet: this.safeGet,
                safeSet: this.safeSet
            });
        }
        return this;
    };
    /**
     * Executes the changeset and saves the underlying content.
     *
     * @method save
     * @param {Object} options optional object to pass to content save method
     */
    BufferedChangeset.prototype.save = function (options) {
        return __awaiter$1(this, void 0, void 0, function () {
            var content, savePromise, maybePromise, result, e_1;
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        content = this[CONTENT];
                        savePromise = Promise.resolve(this);
                        this.execute();
                        if (typeof content.save === 'function') {
                            savePromise = content.save(options);
                        }
                        else if (typeof this.safeGet(content, 'save') === 'function') {
                            maybePromise = this.maybeUnwrapProxy(content).save();
                            if (maybePromise) {
                                savePromise = maybePromise;
                            }
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, savePromise];
                    case 2:
                        result = _a.sent();
                        // cleanup changeset
                        this.rollback();
                        return [2 /*return*/, result];
                    case 3:
                        e_1 = _a.sent();
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Merges 2 valid changesets and returns a new changeset. Both changesets
     * must point to the same underlying object. The changeset target is the
     * origin. For example:
     *
     * ```
     * let changesetA = new Changeset(user, validatorFn);
     * let changesetB = new Changeset(user, validatorFn);
     * changesetA.set('firstName', 'Jim');
     * changesetB.set('firstName', 'Jimmy');
     * changesetB.set('lastName', 'Fallon');
     * let changesetC = changesetA.merge(changesetB);
     * changesetC.execute();
     * user.get('firstName'); // "Jimmy"
     * user.get('lastName'); // "Fallon"
     * ```
     *
     * @method merge
     */
    BufferedChangeset.prototype.merge = function (changeset) {
        var content = this[CONTENT];
        assert('Cannot merge with a non-changeset', isChangeset(changeset));
        assert('Cannot merge with a changeset of different content', changeset[CONTENT] === content);
        if (this.isPristine && changeset.isPristine) {
            return this;
        }
        var c1 = this[CHANGES];
        var c2 = changeset[CHANGES];
        var e1 = this[ERRORS];
        var e2 = changeset[ERRORS];
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        var newChangeset = new ValidatedChangeset(content, this[VALIDATOR]); // ChangesetDef
        var newErrors = objectWithout(keys$1(c2), e1);
        var newChanges = objectWithout(keys$1(e2), c1);
        var mergedErrors = mergeNested(newErrors, e2);
        var mergedChanges = mergeNested(newChanges, c2);
        newChangeset[ERRORS] = mergedErrors;
        newChangeset[CHANGES] = mergedChanges;
        newChangeset._notifyVirtualProperties();
        return newChangeset;
    };
    /**
     * Returns the changeset to its pristine state, and discards changes and
     * errors.
     *
     * @method rollback
     */
    BufferedChangeset.prototype.rollback = function () {
        // Get keys before reset.
        var keys = this._rollbackKeys();
        // Reset.
        this[CHANGES] = {};
        this[ERRORS] = {};
        this._notifyVirtualProperties(keys);
        this.trigger(AFTER_ROLLBACK_EVENT);
        return this;
    };
    /**
     * Discards any errors, keeping only valid changes.
     *
     * @public
     * @chainable
     * @method rollbackInvalid
     * @param {String} key optional key to rollback invalid values
     * @return {Changeset}
     */
    BufferedChangeset.prototype.rollbackInvalid = function (key) {
        var _this = this;
        var errorKeys = keys$1(this[ERRORS]);
        if (key) {
            this._notifyVirtualProperties([key]);
            // @tracked
            this[ERRORS] = this._deleteKey(ERRORS, key);
            if (errorKeys.indexOf(key) > -1) {
                this[CHANGES] = this._deleteKey(CHANGES, key);
            }
        }
        else {
            this._notifyVirtualProperties();
            this[ERRORS] = {};
            // if on CHANGES hash, rollback those as well
            errorKeys.forEach(function (errKey) {
                _this[CHANGES] = _this._deleteKey(CHANGES, errKey);
            });
        }
        return this;
    };
    /**
     * Discards changes/errors for the specified properly only.
     *
     * @public
     * @chainable
     * @method rollbackProperty
     * @param {String} key key to delete off of changes and errors
     * @return {Changeset}
     */
    BufferedChangeset.prototype.rollbackProperty = function (key) {
        // @tracked
        this[CHANGES] = this._deleteKey(CHANGES, key);
        // @tracked
        this[ERRORS] = this._deleteKey(ERRORS, key);
        return this;
    };
    /**
     * Validates the changeset immediately against the validationMap passed in.
     * If no key is passed into this method, it will validate all fields on the
     * validationMap and set errors accordingly. Will throw an error if no
     * validationMap is present.
     *
     * @method validate
     */
    BufferedChangeset.prototype.validate = function () {
        var validationKeys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            validationKeys[_i] = arguments[_i];
        }
        return __awaiter$1(this, void 0, void 0, function () {
            var maybePromise;
            var _this = this;
            return __generator$1(this, function (_a) {
                if (keys$1(this.validationMap).length === 0 && !validationKeys.length) {
                    return [2 /*return*/, Promise.resolve(null)];
                }
                validationKeys =
                    validationKeys.length > 0
                        ? validationKeys
                        : keys$1(flattenValidations(this.validationMap));
                maybePromise = validationKeys.map(function (key) {
                    var value = _this[key];
                    var resolvedValue = value instanceof ObjectTreeNode ? value.unwrap() : value;
                    return _this._validateKey(key, resolvedValue);
                });
                return [2 /*return*/, Promise.all(maybePromise)];
            });
        });
    };
    /**
     * Manually add an error to the changeset. If there is an existing
     * error or change for `key`, it will be overwritten.
     *
     * @method addError
     */
    BufferedChangeset.prototype.addError = function (key, error) {
        var _this = this;
        // Construct new `Err` instance.
        var newError;
        var isIErr = function (error) {
            return _this.isObject(error) && !Array.isArray(error);
        };
        if (isIErr(error)) {
            assert('Error must have value.', error.hasOwnProperty('value') || error.value !== undefined);
            assert('Error must have validation.', error.hasOwnProperty('validation'));
            newError = new Err(error.value, error.validation);
        }
        else {
            var value = this[key];
            newError = new Err(value, error);
        }
        // Add `key` to errors map.
        var errors = this[ERRORS];
        // @tracked
        this[ERRORS] = this.setDeep(errors, key, newError, { safeSet: this.safeSet });
        // Return passed-in `error`.
        return error;
    };
    /**
     * Manually push multiple errors to the changeset as an array.
     * key maybe in form 'name.short' so need to go deep
     *
     * @method pushErrors
     */
    BufferedChangeset.prototype.pushErrors = function (key) {
        var newErrors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            newErrors[_i - 1] = arguments[_i];
        }
        var errors = this[ERRORS];
        var existingError = this.getDeep(errors, key) || new Err(null, []);
        var validation = existingError.validation;
        var value = this[key];
        if (!Array.isArray(validation) && Boolean(validation)) {
            existingError.validation = [validation];
        }
        var v = existingError.validation;
        validation = __spread$4(v, newErrors);
        var newError = new Err(value, validation);
        // @tracked
        this[ERRORS] = this.setDeep(errors, key, newError, { safeSet: this.safeSet });
        return { value: value, validation: validation };
    };
    /**
     * Creates a snapshot of the changeset's errors and changes.
     *
     * @method snapshot
     */
    BufferedChangeset.prototype.snapshot = function () {
        var changes = this[CHANGES];
        var errors = this[ERRORS];
        return {
            changes: keys$1(changes).reduce(function (newObj, key) {
                newObj[key] = getChangeValue(changes[key]);
                return newObj;
            }, {}),
            errors: keys$1(errors).reduce(function (newObj, key) {
                var e = errors[key];
                newObj[key] = { value: e.value, validation: e.validation };
                return newObj;
            }, {})
        };
    };
    /**
     * Restores a snapshot of changes and errors. This overrides existing
     * changes and errors.
     *
     * @method restore
     */
    BufferedChangeset.prototype.restore = function (_a) {
        var changes = _a.changes, errors = _a.errors;
        var newChanges = keys$1(changes).reduce(function (newObj, key) {
            newObj[key] = new Change(changes[key]);
            return newObj;
        }, {});
        var newErrors = keys$1(errors).reduce(function (newObj, key) {
            var e = errors[key];
            newObj[key] = new Err(e.value, e.validation);
            return newObj;
        }, {});
        // @tracked
        this[CHANGES] = newChanges;
        // @tracked
        this[ERRORS] = newErrors;
        this._notifyVirtualProperties();
        return this;
    };
    /**
     * Unlike `Ecto.Changeset.cast`, `cast` will take allowed keys and
     * remove unwanted keys off of the changeset. For example, this method
     * can be used to only allow specified changes through prior to saving.
     *
     * @method cast
     */
    BufferedChangeset.prototype.cast = function (allowed) {
        if (allowed === void 0) { allowed = []; }
        var changes = this[CHANGES];
        if (Array.isArray(allowed) && allowed.length === 0) {
            return this;
        }
        var changeKeys = keys$1(changes);
        var validKeys = changeKeys.filter(function (key) { return allowed.includes(key); });
        var casted = take(changes, validKeys);
        // @tracked
        this[CHANGES] = casted;
        return this;
    };
    /**
     * Checks to see if async validator for a given key has not resolved.
     * If no key is provided it will check to see if any async validator is running.
     *
     * @method isValidating
     */
    BufferedChangeset.prototype.isValidating = function (key) {
        var runningValidations = this[RUNNING_VALIDATIONS];
        var ks = keys$1(runningValidations);
        if (key) {
            return ks.includes(key);
        }
        return ks.length > 0;
    };
    /**
     * Validates a specific key
     *
     * @method _validateKey
     * @private
     */
    BufferedChangeset.prototype._validateKey = function (key, value) {
        var _this = this;
        var content = this[CONTENT];
        var oldValue = this.getDeep(content, key);
        var validation = this._validate(key, value, oldValue);
        this.trigger(BEFORE_VALIDATION_EVENT, key);
        // TODO: Address case when Promise is rejected.
        if (isPromise(validation)) {
            this._setIsValidating(key, validation);
            var running_1 = this[RUNNING_VALIDATIONS];
            var promises = Object.entries(running_1);
            return Promise.all(promises).then(function () {
                return validation
                    .then(function (resolvedValidation) {
                    delete running_1[key];
                    return _this._handleValidation(resolvedValidation, { key: key, value: value });
                })
                    .then(function (result) {
                    _this.trigger(AFTER_VALIDATION_EVENT, key);
                    return result;
                });
            });
        }
        var result = this._handleValidation(validation, { key: key, value: value });
        this.trigger(AFTER_VALIDATION_EVENT, key);
        return result;
    };
    /**
     * Takes resolved validation and adds an error or simply returns the value
     *
     * @method _handleValidation
     * @private
     */
    BufferedChangeset.prototype._handleValidation = function (validation, _a) {
        var key = _a.key, value = _a.value;
        var isValid = validation === true ||
            (Array.isArray(validation) && validation.length === 1 && validation[0] === true);
        // Happy path: remove `key` from error map.
        // @tracked
        this[ERRORS] = this._deleteKey(ERRORS, key);
        // Error case.
        if (!isValid) {
            return this.addError(key, { value: value, validation: validation });
        }
        return value;
    };
    /**
     * runs the validator with the key and value
     *
     * @method _validate
     * @private
     */
    BufferedChangeset.prototype._validate = function (key, newValue, oldValue) {
        var validator = this[VALIDATOR];
        var content = this[CONTENT];
        if (typeof validator === 'function') {
            var validationResult = validator({
                key: key,
                newValue: newValue,
                oldValue: oldValue,
                changes: this.change,
                content: content
            });
            if (validationResult === undefined) {
                // no validator function found for key
                return true;
            }
            return validationResult;
        }
        return true;
    };
    /**
     * Sets property on the changeset.
     */
    BufferedChangeset.prototype._setProperty = function (_a) {
        var key = _a.key, value = _a.value, oldValue = _a.oldValue;
        var changes = this[CHANGES];
        // Happy path: update change map.
        if (oldValue !== value) {
            // @tracked
            var result = this.setDeep(changes, key, new Change(value), {
                safeSet: this.safeSet
            });
            this[CHANGES] = result;
        }
        else if (keyInObject(changes, key)) {
            // @tracked
            // remove key if setting back to original
            this[CHANGES] = this._deleteKey(CHANGES, key);
        }
    };
    /**
     * Increment or decrement the number of running validations for a
     * given key.
     */
    BufferedChangeset.prototype._setIsValidating = function (key, promise) {
        var running = this[RUNNING_VALIDATIONS];
        this.setDeep(running, key, promise);
    };
    /**
     * Notifies virtual properties set on the changeset of a change.
     * You can specify which keys are notified by passing in an array.
     *
     * @private
     * @param {Array} keys
     * @return {Void}
     */
    BufferedChangeset.prototype._notifyVirtualProperties = function (keys) {
        if (!keys) {
            keys = this._rollbackKeys();
        }
        return keys;
    };
    /**
     * Gets the changes and error keys.
     */
    BufferedChangeset.prototype._rollbackKeys = function () {
        var changes = this[CHANGES];
        var errors = this[ERRORS];
        return __spread$4(new Set(__spread$4(keys$1(changes), keys$1(errors))));
    };
    /**
     * Deletes a key off an object and notifies observers.
     */
    BufferedChangeset.prototype._deleteKey = function (objName, key) {
        if (key === void 0) { key = ''; }
        var obj = this[objName];
        var keys = key.split('.');
        if (keys.length === 1 && obj.hasOwnProperty(key)) {
            delete obj[key];
        }
        else if (obj[keys[0]]) {
            var _a = __read$7(keys), base = _a[0], remaining = _a.slice(1);
            var previousNode = obj;
            var currentNode = obj[base];
            var currentKey = base;
            // find leaf and delete from map
            while (this.isObject(currentNode) && currentKey) {
                var curr = currentNode;
                if (isChange(curr) || typeof curr.value !== 'undefined' || curr.validation) {
                    delete previousNode[currentKey];
                }
                currentKey = remaining.shift();
                previousNode = currentNode;
                if (currentKey) {
                    currentNode = currentNode[currentKey];
                }
            }
        }
        return obj;
    };
    BufferedChangeset.prototype.get = function (key) {
        // 'person'
        // 'person.username'
        var _a = __read$7(key.split('.')), baseKey = _a[0], remaining = _a.slice(1);
        var changes = this[CHANGES];
        var content = this[CONTENT];
        if (Object.prototype.hasOwnProperty.call(changes, baseKey)) {
            var changesValue = this.getDeep(changes, key);
            var isObject_1 = this.isObject(changesValue);
            if (!isObject_1 && changesValue !== undefined) {
                // if safeGet returns a primitive, then go ahead return
                return changesValue;
            }
        }
        // At this point, we may have a changes object, a dot separated key, or a need to access the `key`
        // on `this` or `content`
        if (Object.prototype.hasOwnProperty.call(changes, baseKey) && hasChanges(changes)) {
            var baseChanges = changes[baseKey];
            // 'user.name'
            var normalizedBaseChanges = normalizeObject(baseChanges);
            if (this.isObject(normalizedBaseChanges)) {
                var result = this.maybeUnwrapProxy(this.getDeep(normalizedBaseChanges, remaining.join('.')));
                // need to do this inside of Change object
                // basically anything inside of a Change object that is undefined means it was removed
                if (typeof result === 'undefined' &&
                    pathInChanges(changes, key, this.safeGet) &&
                    !hasKey(changes, key, this.safeGet) &&
                    this.getDeep(content, key)) {
                    return;
                }
                if (this.isObject(result)) {
                    if (isChange(result)) {
                        return getChangeValue(result);
                    }
                    var baseContent = this.safeGet(content, baseKey);
                    var subContent_1 = this.getDeep(baseContent, remaining.join('.'));
                    var subChanges = getSubObject(changes, key);
                    // give back an object that can further retrieve changes and/or content
                    var tree = new ObjectTreeNode(subChanges, subContent_1, this.getDeep, this.isObject);
                    return tree.proxy;
                }
                else if (typeof result !== 'undefined') {
                    return result;
                }
            }
            // this comes after the isObject check to ensure we don't lose remaining keys
            if (isChange(baseChanges) && remaining.length === 0) {
                return getChangeValue(baseChanges);
            }
        }
        // return getters/setters/methods on BufferedProxy instance
        if (baseKey in this || key in this) {
            return this.getDeep(this, key);
        }
        var subContent = this.maybeUnwrapProxy(this.getDeep(content, key));
        if (this.isObject(subContent)) {
            var subChanges = this.getDeep(changes, key);
            if (!subChanges) {
                // if no changes, we need to add the path to the existing changes (mutate)
                // so further access to nested keys works
                subChanges = this.getDeep(this.setDeep(changes, key, {}), key);
            }
            // may still access a value on the changes or content objects
            var tree = new ObjectTreeNode(subChanges, subContent, this.getDeep, this.isObject);
            return tree.proxy;
        }
        else if (Array.isArray(subContent)) {
            var subChanges = this.getDeep(changes, key);
            if (!subChanges) {
                // return array of contents. Dont need to worry about further access sibling keys in array case
                return subContent;
            }
            if (isObject(subChanges)) {
                if (isObject(subContent)) {
                    subChanges = normalizeObject(subChanges, this.isObject);
                    return __assign$3(__assign$3({}, subContent), subChanges);
                }
                else if (Array.isArray(subContent)) {
                    subChanges = normalizeObject(subChanges, this.isObject);
                    return objectToArray(mergeDeep(arrayToObject(subContent), subChanges));
                }
            }
            return subChanges;
        }
        return subContent;
    };
    BufferedChangeset.prototype.set = function (key, value) {
        if (this.hasOwnProperty(key) || keyInObject(this, key)) {
            this[key] = value;
        }
        else {
            this.setUnknownProperty(key, value);
        }
    };
    return BufferedChangeset;
}());
/**
 * Creates new changesets.
 */
function changeset(obj, validateFn, validationMap, options) {
    return new BufferedChangeset(obj, validateFn, validationMap, options);
}
var ValidatedChangeset = /** @class */ (function () {
    /**
     * Changeset factory class if you need to extend
     *
     * @class ValidatedChangeset
     * @constructor
     */
    function ValidatedChangeset(obj, validateFn, validationMap, options) {
        var c = changeset(obj, validateFn, validationMap, options);
        return new Proxy(c, {
            get: function (targetBuffer, key /*, receiver*/) {
                var res = targetBuffer.get(key.toString());
                return res;
            },
            set: function (targetBuffer, key, value /*, receiver*/) {
                targetBuffer.set(key.toString(), value);
                return true;
            }
        });
    }
    return ValidatedChangeset;
}());
function Changeset(obj, validateFn, validationMap, options) {
    var c = changeset(obj, validateFn, validationMap, options);
    return new Proxy(c, {
        get: function (targetBuffer, key /*, receiver*/) {
            var res = targetBuffer.get(key.toString());
            return res;
        },
        set: function (targetBuffer, key, value /*, receiver*/) {
            targetBuffer.set(key.toString(), value);
            return true;
        }
    });
}

export { BufferedChangeset, CHANGESET, Change, Changeset, Err, ValidatedChangeset, buildOldValues, changeset, getChangeValue, getDeep, getKeyValues, isChange, isChangeset, isObject, isPromise, keyInObject, lookupValidator, mergeDeep, mergeNested, normalizeObject, objectWithout, propertyIsUnsafe, pureAssign, setDeep, take };
//# sourceMappingURL=validated-changeset.es5.js.map
