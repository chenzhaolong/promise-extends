/**
 * @file Promise的扩展
 */
import {isPromise} from "./lib/utils";

const PromiseExtends = (function() {
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

    /**
     * 实例方法
     */
    //
    const extendsPromiseDone = () => {

    };

    const extendsPromiseFinally = () => {

    };

    return {
        extend() {
            if (!isPromise()) {
                return false;
            }
            extendsPromiseLimit();
            extendsPromiseShake();
            extendsPromiseCatch();
            extendsPromiseClean();
            extendsPromiseDone();
            extendsPromiseFinally();
        }
    }
})();

export default PromiseExtends