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
export default function keyInObject(obj, key) {
    var _a = __read(key.split('.')), baseKey = _a[0], keys = _a.slice(1);
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
//# sourceMappingURL=key-in-object.js.map