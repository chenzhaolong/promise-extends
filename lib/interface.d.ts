/**
 * @file 接口定义
 */
export declare namespace PromiseExtend {
    interface Result {
        extend: (options: Options) => boolean;
    }
    interface Options {
        isExtend: boolean;
    }
}
