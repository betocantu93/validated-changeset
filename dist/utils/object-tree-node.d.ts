import { ProxyHandler, Content } from '../types';
declare class ObjectTreeNode implements ProxyHandler {
    safeGet: Function;
    isObject: Function;
    changes: Record<string, any>;
    content: Content;
    proxy: any;
    children: Record<string, any>;
    constructor(changes?: Record<string, any>, content?: Content, safeGet?: Function, isObject?: Function);
    get(key: string): any;
    set(key: string, value: unknown): any;
    unwrap(): Record<string, any>;
}
export { ObjectTreeNode };
//# sourceMappingURL=object-tree-node.d.ts.map