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
import isObject from './is-object';
import setDeep from './set-deep';
import Change, { getChangeValue, isChange } from '../-private/change';
import normalizeObject from './normalize-object';
import { objectToArray, arrayToObject } from './array-object';
import mergeDeep from './merge-deep';
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
                return __assign(__assign({}, content), changes);
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
export { ObjectTreeNode };
//# sourceMappingURL=object-tree-node.js.map