/**
 * @file 接口定义
 */

export namespace PromiseExtend {
    export interface Result {
        extend: (options: Options) => boolean
    }

    export interface Options {
        isExtend: boolean
    }
}