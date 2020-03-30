/**
 * @file Promise的扩展
 */
import {isPromise} from "./lib/utils";
import {PromiseExtend} from './lib/interface';

const PromiseExtends: PromiseExtend.Result = (function() {
    /**
     * static function
     */

    // 限流
    const extendsPromiseLimit: PromiseExtend.voidFn = () => {
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

    };

    // 统一清除异常
    const extendsPromiseClean = () => {

    };

    // 防抖动
    const extendsPromiseShake = () => {

    };

    // 允许
    const extendsPromiseAllow = () => {

    };

    /**
     * 实例方法
     */
    //
    const extendsPromiseDone = () => {

    };

    const extendsPromiseFinally = () => {
        // @ts-ignore
        Promise.prototype.finally = function(cb: () => void) {
            this.then(d => {
                cb();
                return d;
            }).catch(e => {
                cb();
                throw e;
            });
        };
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
            extendsPromiseClean();
            extendsPromiseDone();
            extendsPromiseFinally();
            extendsPromiseAllow();
            return true;
        }
    }
})();

export default PromiseExtends