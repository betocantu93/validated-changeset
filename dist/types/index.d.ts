export interface ProxyHandler {
    changes: Record<string, any>;
    content: unknown;
    proxy: any;
    children: Record<string, any>;
    safeGet: Function;
    unwrap: Function;
    [key: string]: any;
}
export declare type Config = {
    skipValidate?: boolean;
    changesetKeys?: string[];
};
export declare type ValidationOk = boolean | [boolean];
export declare type ValidationErr = string | string[];
export declare type ValidationResult = ValidationOk | ValidationErr;
export interface INotifier {
    listeners: Function[];
    addListener(callback: Function): Function;
    removeListener(callback: Function): void;
    trigger(...args: any[]): void;
}
export interface IEvented {
    on(eventName: string, callback: Function): INotifier;
    off(eventName: string, callback: Function): INotifier;
    trigger(eventName: string, ...args: any[]): void;
    _eventedNotifiers: {
        [key: string]: any;
    };
}
export declare type ValidatorAction = {
    (params: {
        key: string;
        newValue: unknown;
        oldValue: unknown;
        changes: unknown;
        content: object;
    }): ValidationResult | Promise<ValidationResult>;
} | null | undefined;
export declare type ValidatorMapFunc = {
    (key: string, newValue: unknown, oldValue: unknown, changes: unknown, content: object): ValidationResult | Promise<ValidationResult>;
};
export interface ValidatorClass {
    validate: ValidatorMapFunc;
    [s: string]: any;
}
export declare type ValidatorMap = {
    [s: string]: ValidatorMapFunc | ValidatorMapFunc[] | any;
} | null | undefined;
export interface Changes {
    [s: string]: any;
}
export interface Content {
    save?: Function | undefined;
    [key: string]: any;
}
export interface IErr<T> {
    value: T;
    validation: ValidationErr | ValidationErr[];
}
export declare type Errors<T> = {
    [s: string]: IErr<T>;
};
export declare type PublicErrors = {
    key: string;
    value: any;
    validation: ValidationErr | ValidationErr[];
}[];
export declare type RunningValidations = {
    [s: string]: number;
};
export declare type InternalMap = Changes | Errors<any> | RunningValidations;
export interface NewProperty<T> {
    key: string;
    value: T;
    oldValue?: any;
}
export declare type InternalMapKey = '_changes' | '_errors' | '_runningValidations';
export declare type Snapshot = {
    changes: {
        [s: string]: any;
    };
    errors: {
        [s: string]: IErr<any>;
    };
};
export declare type PrepareChangesFn = (obj: {
    [s: string]: any;
}) => {
    [s: string]: any;
} | null;
export interface ChangesetDef {
    __changeset__: string;
    _content: object;
    _changes: Changes;
    _errors: Errors<any>;
    _validator: ValidatorAction;
    _options: Config;
    _runningValidations: RunningValidations;
    _bareChanges: {
        [s: string]: any;
    };
    changes: Record<string, any>[];
    errors: PublicErrors;
    error: object;
    change: object;
    data: object;
    isValid: boolean;
    isPristine: boolean;
    isInvalid: boolean;
    isDirty: boolean;
    get: (key: string) => any;
    set: <T>(key: string, value: T) => void | T | IErr<T> | Promise<T> | Promise<ValidationResult | T | IErr<T>> | ValidationResult;
    maybeUnwrapProxy: Function;
    getDeep: any;
    setDeep: any;
    safeGet: (obj: any, key: string) => any;
    prepare(preparedChangedFn: PrepareChangesFn): this;
    execute: () => this;
    save: (options: object) => Promise<ChangesetDef | any>;
    merge: (changeset: this) => this;
    rollback: () => this;
    rollbackInvalid: (key: string | void) => this;
    rollbackProperty: (key: string) => this;
    validate: (key: string) => Promise<null> | Promise<any | IErr<any>> | Promise<Array<any | IErr<any>>>;
    addError: <T>(key: string, error: IErr<T> | ValidationErr) => IErr<T> | ValidationErr;
    pushErrors: (key: string, newErrors: string[]) => IErr<any>;
    snapshot: () => Snapshot;
    restore: (obj: Snapshot) => this;
    cast: (allowed: Array<string>) => this;
    isValidating: (key: string | void) => boolean;
    _validate: (key: string, newValue: any, oldValue: any) => ValidationResult | Promise<ValidationResult>;
    _setProperty: <T>(obj: NewProperty<T>) => void;
    _setIsValidating: (key: string, value: Promise<ValidationResult>) => void;
    _notifyVirtualProperties: (keys?: string[]) => string[] | undefined;
    _rollbackKeys: () => Array<string>;
    _deleteKey: (objName: InternalMapKey, key: string) => InternalMap;
}
export interface IChangeset extends ChangesetDef, IEvented {
}
//# sourceMappingURL=index.d.ts.map