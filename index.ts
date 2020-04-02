/**
 * @file Promise的扩展
 */
import {isPromise, isThenable, isArray, isFunction, isError} from "./lib/utils";
import {PromiseExtend} from './lib/interface';
import {Events} from './lib/events';

const PromiseExtends: PromiseExtend.Result = (function() {
    /**
     * static function
     */

    // 限流
    const extendsPromiseLimit = () => {
        // @ts-ignore
        Promise.limit = function(
            array: PromiseExtend.PromiseLimit.promiseArray,
            options: PromiseExtend.PromiseLimit.Options
         ): Promise<any> {
            if (array.length === 0) {
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

    // 统一捕捉异常
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

    // 防抖动
    const extendsPromiseShake = () => {
        // @ts-ignore
        Promise.shake = function(fn: PromiseExtend.PromiseShark.fn) {
            if (!isThenable(fn)) {
                return () => {
                    return Promise.reject('params is not promise or thenable');
                }
            }
            let cache: any = null;
            return () => {
                if (cache) {
                    return cache
                } else {
                    return cache = new Promise((resolve, reject) => {
                        let args: any = arguments;
                        fn.apply(this, args)
                            .then((data: any) => {
                                cache = null;
                                resolve(data);
                            })
                            .catch((error: any) => {
                                cache = null;
                                reject(error);
                            });
                    });
                }
            }
        }
    };

    // 允许某几个promise失败
    const extendsPromiseAllow = () => {
        // @ts-ignore
        Promise.allow = function(
            array: PromiseExtend.PromiseAllow.array,
            whiltList: PromiseExtend.PromiseAllow.allowsIndex
        ) {
            if (!isArray(array)) {
                return Promise.reject('has no params');
            }

            if (array.length < 2) {
                return Promise.reject('should not use Promise.allow, this function require the params length large than 2');
            }

            let result: PromiseExtend.PromiseAllow.result = [];

            const isSuccess = (result: PromiseExtend.PromiseAllow.result) => {
                if (whiltList && isArray(whiltList) && whiltList.length < array.length) {
                    return result.every((item: PromiseExtend.PromiseAllow.response, index: number) => {
                        if (whiltList.indexOf(index) !== -1) {
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
     * 实例方法
     */
    //
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

    const extendsPromiseFinally = () => {
        // @ts-ignore
        if (typeof Promise.prototype.finally === 'function') {
            return null;
        }
        // @ts-ignore
        Promise.prototype.finally = function(cb: PromiseExtend.voidFn) {
            return this.then((data: any) => {
                if (isFunction(cb)) {
                    return Promise.resolve(cb()).then(() => data);
                } else {
                    return data
                }
            }).catch((error: any) => {
                const errorObj = isError(error) ? error : new Error(error);
                if (isFunction(cb)) {
                    return Promise.resolve(cb()).then(() => {
                        throw errorObj;
                    });
                } else {
                    throw errorObj;
                }
            });
        }
    };

    return {
        extend(options: PromiseExtend.Options) {
            const {isExtend = true} = options;
            if (!isPromise() || !isExtend) {
                return false;
            }
            extendsPromiseLimit();
            extendsPromiseShake();
            extendsPromiseCatch();
            extendsPromiseDone();
            extendsPromiseFinally();
            extendsPromiseAllow();
            return true;
        }
    }
})();

export default PromiseExtends