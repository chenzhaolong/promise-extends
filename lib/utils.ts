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