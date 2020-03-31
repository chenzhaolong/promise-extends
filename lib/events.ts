/**
 * @file 监听发布
 */
import {CatchEvents} from './interface';

export class Events {
    static event: CatchEvents.event = {};

    static listen(type: string, fn: CatchEvents.fn) {
        if (Events.event[type]) {
            Events.event[type].shift();
            Events.event[type].push(fn);
        } else {
            Events.event[type] = [];
            Events.event[type].push(fn);
        }
    }

    static publish(type: string, error: any, stopBubbling: boolean = true) {
        try {
            if (Events.event[type] && Events.event[type].length > 0) {
                const errorFn = Events.event[type][0];
                if (stopBubbling) {
                    errorFn(error);
                } else {
                    const result = errorFn(error);
                    return Promise.reject(result || error);
                }
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    static clean(type: string) {
        if (Events.event[type]) {
            delete Events.event[type];
        }
    }
}
