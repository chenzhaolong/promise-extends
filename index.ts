/**
 * @file Promise的扩展
 */
import {isPromise, isThenable, isArray, isFunction, isError} from "./lib/utils";
import {PromiseExtend} from './lib/interface';
import {Events} from './lib/events';

export const PromiseExtends: PromiseExtend.Result = (function() {
    /**
     * static function
     */

    /**
     * 限流
     */
    const extendsPromiseLimit = () => {
        // @ts-ignore
        Promise.limit = function(
            array: PromiseExtend.PromiseLimit.promiseArray,
            options: PromiseExtend.PromiseLimit.Options
         ): Promise<any> {
            if (!array || array.length === 0) {
                return Promise.resolve([]);
            }

            const {limitNumber = 3} = options;

            const result: Array<any> = [];

            const limitArray: Array<any> = (function() {
                let temp1 = [];
                let temp2 = [];
                for(let i = 0; i < array.length; i++) {
                    temp2.push(array[i]);
                    if (temp2.length === limitNumber || i === array.length - 1) {
                        temp1.push([...temp2]);
                        temp2 = [];
                    }
                }
                return temp1;
            })();

            const next = (resolve: PromiseExtend.resolve, reject: PromiseExtend.reject) => {
                const fn = limitArray.shift();
                Promise.all(fn).then((data: Array<any>) => {
                    data.forEach((value: any) => {
                        result.push(value);
                    });
                    if (limitArray.length === 0) {
                        resolve(result);
                    } else {
                        next(resolve, reject)
                    }
                }).catch((e: any) => {
                    reject(e);
                })
            };

            return new Promise((resolve, reject) => {
                next(resolve, reject)
            });
        }
    };

    /**
     *  统一捕捉异常
     *  @holding
     */
    const extendsPromiseCatch = () => {
        // @ts-ignore
        Promise.catch = function (
            type: PromiseExtend.PromiseCatch.CatchType,
            data: PromiseExtend.PromiseCatch.data
        ) {
            const {key, error, errorFn, stopBubbling} = data;
          switch (type) {
              case PromiseExtend.PromiseCatch.CatchType.LISTEN:
                  return Events.listen(key, errorFn);
              case PromiseExtend.PromiseCatch.CatchType.PUBLISH:
                  return Events.publish(key, error, stopBubbling);
              case PromiseExtend.PromiseCatch.CatchType.CLEAN:
                  return Events.clean(key);
              default:
                  return;
          }
        }
    };

    /**
     * 防抖动
     */
    const extendsPromiseShake = () => {
        // @ts-ignore
        Promise.shake = function(fn: PromiseExtend.PromiseShark.fn) {
            if (!fn) {
                return () => {
                    return Promise.reject('params can not be empty');
                }
            }

            if (typeof fn !== 'function') {
                return () => {
                    return Promise.reject('params must be function');
                }
            }

            let cache: any = null;
            return (...rest: any) => {
                if (cache) {
                    return cache
                } else {
                    return cache = new Promise((resolve, reject) => {
                        const promise = fn.apply(this, rest);
                        if (isThenable(promise)) {
                            promise.then((data: any) => {
                                cache = null;
                                resolve(data);
                            }).catch((error: any) => {
                                cache = null;
                                reject(error);
                            });
                        } else {
                            cache = null;
                            reject('params is not promise or thenable');
                        }
                    });
                }
            }
        }
    };

    /**
     * 允许某几个promise失败
     */
    const extendsPromiseAllow = () => {
        // @ts-ignore
        Promise.allow = function(
            array: PromiseExtend.PromiseAllow.array,
            whiteList: PromiseExtend.PromiseAllow.allowsIndex
        ) {
            if (!isArray(array)) {
                return Promise.reject('has no params');
            }
            let length = array.length;

            if (length < 2) {
                return Promise.reject('should not use Promise.allow, this function require the length of params large than 2');
            }

            let result: PromiseExtend.PromiseAllow.result = [];

            const isSuccess = (result: PromiseExtend.PromiseAllow.result) => {
                if (whiteList && isArray(whiteList) && whiteList.length < length) {
                    return result.every((item: PromiseExtend.PromiseAllow.response, index: number) => {
                        if (whiteList.indexOf(index) !== -1) {
                            return true;
                        }

                        return item.isDone;
                    })
                } else {
                    return result.some((item: PromiseExtend.PromiseAllow.response) => {
                        return item.isDone;
                    });
                }
            };

            const next = (resolve: PromiseExtend.resolve, reject: PromiseExtend.reject) => {
                const fn = array.shift();
                // @ts-ignore
                fn.then((data: any) => {
                    result.push({isDone: true, data: data});
                    if (array.length === 0) {
                        isSuccess(result) ? resolve(result): reject(result);
                    } else {
                        next(resolve, reject)
                    }
                }).catch((error: any) => {
                    result.push({isDone: false, data: error});
                    if (array.length === 0) {
                        isSuccess(result) ? resolve(result): reject(result);
                    } else {
                        next(resolve, reject)
                    }
                })
            };

            return new Promise((resolve, reject) => {
                next(resolve, reject);
            })
        }
    };

    /**
     * promise缓存
     */
    const extendPromiseCache = () => {};

    /**
     * promise管理器
     */
    const extendPromiseManager = () => {};

    /**
     * 实例方法
     */
    const extendsPromiseDone = () => {
        // @ts-ignore
        if (typeof Promise.prototype.done === 'function') {
            return null;
        }
        // @ts-ignore
        Promise.prototype.done = function(onFulfilled, onRejected) {
            this.then(onFulfilled, onRejected)
                .catch(error => {
                    setTimeout(() => {
                        throw error;
                    }, 0);
                });
        }
    };

    const reset = () => {
        // @ts-ignore
        Promise.limit = undefined;
        // @ts-ignore
        Promise.shake = undefined;
        // @ts-ignore
        Promise.allow = undefined;
        // @ts-ignore
        // Promise.catch = undefined;
        // @ts-ignore
        Promise.prototype.done = undefined;
        // @ts-ignore
        Promise.cache = undefined;
        // @ts-ignore
        Promise.manager = undefined;
    };

    return {
        extend(options: PromiseExtend.Options) {
            const {isExtend = true} = options;
            if (!isPromise() || !isExtend) {
                reset();
                return false;
            }
            extendsPromiseLimit();
            extendsPromiseShake();
            // extendsPromiseCatch();
            extendsPromiseDone();
            extendsPromiseAllow();
            extendPromiseCache();
            extendPromiseManager();
            return true;
        }
    }
})();