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

    export type voidFn = () => void

    export type resolve = (data: Array<any>) => any

    export type reject = (error: object) => any

    export type promiseFn = (data: any) => Promise<any>

    export namespace PromiseLimit {
        export type promiseArray = Array<promiseFn>
        export type Options = {limitNumber: number}
    }

    export namespace PromiseCatch {
        export enum CatchType {
            LISTEN = 'listen',
            PUBLISH = 'publish',
            CLEAN = 'clean'
        }
        export interface data {
            key: string,
            error: any,
            errorFn: (error: any) => any,
            stopBubbling?: boolean
        }
    }

    export namespace PromiseAllow {

    }
}

export namespace CatchEvents {
    export type event = {[key: string]: Array<any>}

    export type fn = (error: any) => any

    export type cache = {[key: string]: any}
}