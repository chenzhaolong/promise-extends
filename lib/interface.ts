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

    export namespace PromiseShark {
        export type fn = () => Promise<any>
    }

    export namespace PromiseAllow {
        interface thenable {
            then: (data: any) => any
        }
        export type array = Array<thenable>
        export type allowsIndex = Array<number>
        export interface response {
            isDone: boolean,
            data: any
        }
        export type result = Array<response>
    }
}

export namespace CatchEvents {
    export type event = {[key: string]: Array<any>}

    export type fn = (error: any) => any

    export type cache = {[key: string]: any}
}