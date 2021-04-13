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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
import Change, { getChangeValue, isChange } from './-private/change';
import { getKeyValues, getKeyErrorValues } from './utils/get-key-values';
import lookupValidator from './utils/validator-lookup';
import { notifierForEvent } from './-private/evented';
import Err from './-private/err';
import { hasKey, pathInChanges } from './utils/has-key';
import normalizeObject from './utils/normalize-object';
import { hasChanges } from './utils/has-changes';
import pureAssign from './utils/assign';
import { flattenValidations } from './utils/flatten-validations';
import isChangeset, { CHANGESET } from './utils/is-changeset';
import isObject from './utils/is-object';
import isPromise from './utils/is-promise';
import keyInObject from './utils/key-in-object';
import mergeNested from './utils/merge-nested';
import { buildOldValues } from './utils/build-old-values';
import { ObjectTreeNode } from './utils/object-tree-node';
import objectWithout from './utils/object-without';
import take from './utils/take';
import mergeDeep, { propertyIsUnsafe } from './utils/merge-deep';
import setDeep from './utils/set-deep';
import getDeep, { getSubObject } from './utils/get-deep';
import { objectToArray, arrayToObject } from './utils/array-object';
export { CHANGESET, Change, Err, buildOldValues, isChangeset, isObject, isChange, getChangeValue, isPromise, getKeyValues, keyInObject, lookupValidator, mergeNested, normalizeObject, objectWithout, pureAssign, take, mergeDeep, setDeep, getDeep, propertyIsUnsafe };
var keys = Object.keys;
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
            notifier.trigger.apply(notifier, __spread(args));
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
            var newChanges = keys(preparedChanges).reduce(function (newObj, key) {
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
        return __awaiter(this, void 0, void 0, function () {
            var content, savePromise, maybePromise, result, e_1;
            return __generator(this, function (_a) {
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
        var newErrors = objectWithout(keys(c2), e1);
        var newChanges = objectWithout(keys(e2), c1);
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
        var errorKeys = keys(this[ERRORS]);
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
        return __awaiter(this, void 0, void 0, function () {
            var maybePromise;
            var _this = this;
            return __generator(this, function (_a) {
                if (keys(this.validationMap).length === 0 && !validationKeys.length) {
                    return [2 /*return*/, Promise.resolve(null)];
                }
                validationKeys =
                    validationKeys.length > 0
                        ? validationKeys
                        : keys(flattenValidations(this.validationMap));
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
        validation = __spread(v, newErrors);
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
            changes: keys(changes).reduce(function (newObj, key) {
                newObj[key] = getChangeValue(changes[key]);
                return newObj;
            }, {}),
            errors: keys(errors).reduce(function (newObj, key) {
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
        var newChanges = keys(changes).reduce(function (newObj, key) {
            newObj[key] = new Change(changes[key]);
            return newObj;
        }, {});
        var newErrors = keys(errors).reduce(function (newObj, key) {
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
        var changeKeys = keys(changes);
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
        var ks = keys(runningValidations);
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
        return __spread(new Set(__spread(keys(changes), keys(errors))));
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
            var _a = __read(keys), base = _a[0], remaining = _a.slice(1);
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
        var _a = __read(key.split('.')), baseKey = _a[0], remaining = _a.slice(1);
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
                    return __assign(__assign({}, subContent), subChanges);
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
export { BufferedChangeset };
/**
 * Creates new changesets.
 */
export function changeset(obj, validateFn, validationMap, options) {
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
export { ValidatedChangeset };
export function Changeset(obj, validateFn, validationMap, options) {
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
//# sourceMappingURL=index.js.map