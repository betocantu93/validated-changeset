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
export function buildOldValues(content, changes, getDeep) {
    var e_1, _a;
    var obj = Object.create(null);
    try {
        for (var changes_1 = __values(changes), changes_1_1 = changes_1.next(); !changes_1_1.done; changes_1_1 = changes_1.next()) {
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
//# sourceMappingURL=build-old-values.js.map