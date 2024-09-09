export type AnyFunction = (...args: any[]) => any;
export type PromiseOrNot<T extends unknown> = Promise<T> | T;
