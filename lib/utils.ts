/**
 * @file 工具函数
 */
import type = Mocha.utils.type;

export function isPromise(): boolean {
    return Promise && true
}

export function isThenable(promise: any): boolean {
    if (!promise) {
        return false;
    }
    if (promise instanceof Promise) {
        return true
    }
    return (typeof promise === 'object' || typeof promise === 'function') && promise.then && typeof promise.then === 'function';
}

export function isArray(array: any): boolean {
    return Object.prototype.toString.call(array) === "[object Array]"
}

export function isFunction(fn: any): boolean {
    return fn && typeof fn === 'function';
}

export function isError(error: any): boolean {
    return typeof error === 'object' && error.message;
}