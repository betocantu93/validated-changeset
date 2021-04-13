/**
 * Given an array of objects, merge their keys into a new object and
 * return the new object.
 *
 * This function merges using `setNestedProperty`.
 */
export default function mergeNested<T>(...objects: Array<{
    [key: string]: T;
}>): {
    [key: string]: T;
};
//# sourceMappingURL=merge-nested.d.ts.map