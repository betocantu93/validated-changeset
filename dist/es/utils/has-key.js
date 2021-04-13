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
import { getChangeValue, isChange } from '../-private/change';
export function hasKey(record, path, safeGet) {
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
export function pathInChanges(record, path, safeGet) {
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
//# sourceMappingURL=has-key.js.map