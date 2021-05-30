/**
 * @file Promise 限流
 */
interface Options {
    limitNumber: number
}

export function extendPromiseLimit () {
    // @ts-ignore
    if (Promise.limit) {
        return
    }
    // @ts-ignore
    Promise.limit = function (
        array: Array<Promise<any>>,
        options: Options
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!array || array.length === 0) {
                return resolve([]);
            }
            let {limitNumber = 3} = options;
            const total = array.length;

            if (total <= limitNumber) {
                limitNumber = total;
            }

            const result: Array<any> = [];
            let count: number = 0;
            let index: number = 0;

            const run = (promise: Promise<any>, i: number) => {
                promise
                    .then(data => {
                        success(i, data);
                    })
                    .catch(e => {
                        reject(e);
                    });
            };

            const success = (i: number, data: any) => {
                result[i] = data;
                count += 1;
                if (count >= total) {
                    resolve(result);
                } else {
                    index += 1;
                    const promise = array[index];
                    if (promise) {
                        run(promise, index);
                    }
                }
            };

            while(index < limitNumber) {
                const promise: any = array[index];
                run(promise, index);
                index += 1;
            }
        });
    }
}