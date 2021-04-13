import handleMultipleValidations from './handle-multiple-validations';
import isPromise from './is-promise';
import isObject from './is-object';
import get from './get-deep';
/**
 * returns a closure to lookup and validate k/v pairs set on a changeset
 *
 * @method lookupValidator
 * @param validationMap
 */
export default function lookupValidator(validationMap) {
    return function (_a) {
        var key = _a.key, newValue = _a.newValue, oldValue = _a.oldValue, changes = _a.changes, content = _a.content;
        var validations = validationMap || {};
        var validator = get(validations, key);
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
//# sourceMappingURL=validator-lookup.js.map