/**
 * Merges all sources together, excluding keys in excludedKeys.
 *
 * @param  {string[]} excludedKeys
 * @param  {...object} sources
 * @return {object}
 */
export default function objectWithout(excludedKeys) {
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
//# sourceMappingURL=object-without.js.map