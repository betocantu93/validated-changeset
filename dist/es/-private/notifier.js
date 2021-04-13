// this statefull class holds and notifies
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
        this.listeners.forEach(function (callback) { return callback.apply(void 0, __spread(args)); });
    };
    return Notifier;
}());
export default Notifier;
//# sourceMappingURL=notifier.js.map