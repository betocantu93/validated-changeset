/* import { IChange } from '../types'; */
import isObject from '../utils/is-object';
export var VALUE = Symbol('__value__');
var Change = /** @class */ (function () {
    function Change(value) {
        this[VALUE] = value;
    }
    return Change;
}());
export default Change;
// TODO: not sure why this function type guard isn't working
export var isChange = function (maybeChange) {
    return isObject(maybeChange) && VALUE in maybeChange;
};
export function getChangeValue(maybeChange) {
    if (isChange(maybeChange)) {
        return maybeChange[VALUE];
    }
}
//# sourceMappingURL=change.js.map