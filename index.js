/**
 * @file Promise的扩展
 */
import { isPromise } from "./lib/utils";
const PromiseExtends = (function () {
    /**
     * static function
     */
    // 限流
    const extendsPromiseLimit = () => {
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
        Promise.prototype.finally = function (cb) {
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
        extend(options) {
            const { isExtend = true } = options;
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
    };
})();
export default PromiseExtends;