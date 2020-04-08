/**
 * @file allow的单元测试用例
 */

import { PromiseExtends } from '../index'

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

PromiseExtends.extend({isExtend: true});

describe('test Promise.allow', () => {
    const api1 = (data: any, isSuccess: boolean = true) => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                isSuccess ? res(data) : rej(data);
            }, 10)
        })
    };

    const api2 = (data: any, isSuccess: boolean = true) => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                isSuccess ? res(data) : rej(data);
            }, 15)
        })
    };

    const api3 = (data: any, isSuccess: boolean = true) => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                isSuccess ? res(data) : rej(data);
            }, 11)
        })
    };

    const api4 = (data: any, isSuccess: boolean = true) => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                isSuccess ? res(data) : rej(data);
            }, 20)
        })
    };


    const api5 = (data: any, isSuccess: boolean = true) => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                isSuccess ? res(data) : rej(data);
            }, 32)
        })
    };

    describe('exist or not', () => {
        it('Promise.allow has exist when invoke PromiseExtends.extend', () => {
            PromiseExtends.extend({isExtend: true});
            // @ts-ignore
            const type = typeof Promise.allow;
            expect(type).to.equal('function');
        });

        it('Promise.allow has no exist when do not invoke PromiseExtends.extend', () => {
            PromiseExtends.extend({isExtend: false});
            // @ts-ignore
            const type = typeof Promise.allow;
            expect(type).to.equal('undefined');
        });
    });

    describe('success or fail status', () => {
        it('Promise.allow can allow some one success some one fail', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('1'), api2(new Error('ji'), false), api3('3')];
            const invoke = () => {
                // @ts-ignore
                return Promise.allow(array)
                    .then((d: any) => {
                        return d;
                    })
            };
            return expect(invoke()).to.eventually.be.fulfilled;
        });

        it('all fail in Promise.allow', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [
                api1(new Error('1'), false),
                api2(new Error('ji'), false),
                api4(new Error('32'), false)
            ];
            const invoke = () => {
                // @ts-ignore
                return Promise.allow(array)
                    .then((d: any) => {
                        return d;
                    })
                    .catch((e: any) => {
                        throw e;
                    })
            };
            return expect(invoke()).to.eventually.rejected
        });
    });

    describe('check response', () => {
        it('the response of Promise.allow is array', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('1'), api2(new Error('ji'), false), api3('3')];
            const invoke = () => {
                // @ts-ignore
                return Promise.allow(array)
                    .then((d: any) => {
                        return d;
                    })
            };
            return expect(invoke()).to.eventually.an.instanceof(Array);
        });

        it('the response of Promise.allow has isDone and data property', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('1'), api2(new Error('ji'), false), api3('3')];
            const invoke = () => {
                // @ts-ignore
                return Promise.allow(array)
                    .then((d: any) => {
                        let keys = {};
                        d.forEach((item: object) => {
                            Object.keys(item).forEach((key: string) => {
                                // @ts-ignore
                                keys[key] = ''
                            })
                        });
                        return keys;
                    });
            };
            return expect(invoke()).to.eventually.have.all.keys(['isDone', 'data']);
        });

        it('the isDone of response is boolean', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('1'), api2(new Error('ji'), false), api3('3')];
            const invoke = () => {
                // @ts-ignore
                return Promise.allow(array)
                    .then((d: any) => {
                        let keys: Array<boolean> = [];
                        d.forEach((item: {[key: string]: any}) => {
                            keys.push(item.isDone);
                        });
                        return keys;
                    });
            };
            return expect(invoke()).to.eventually.eql([true, false, true]);
        });

        it('allow first fail,  resolve and the response should be the first done is false, others must be true', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('ji', false), api2('2'), api3('3')];
            const invoke = () => {
                // @ts-ignore
                const array1 = [].concat(array);
                // @ts-ignore
                return Promise.allow(array1, [0])
            };
            return Promise.all([
                expect(invoke().then((d: any) => d[0].isDone)).to.eventually.eql(false),
                expect(invoke().then((d: any) => d[1].isDone)).to.eventually.eql(true),
                expect(invoke().then((d: any) => d[2].isDone)).to.eventually.eql(true)
            ])
        });

        it('allow first fail, but first second fail, reject and the response' +
            ' should be the first and second done is false, other must be true', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('ji', false), api2('2', false), api3('3')];
            const invoke = () => {
                // @ts-ignore
                const array1 = [].concat(array);
                // @ts-ignore
                return Promise.allow(array1, [0])
                    .catch((e: any) => e)
            };
            return Promise.all([
                expect(invoke().then((d: any) => d[0].isDone)).to.eventually.eql(false),
                expect(invoke().then((d: any) => d[1].isDone)).to.eventually.eql(false),
                expect(invoke().then((d: any) => d[2].isDone)).to.eventually.eql(true)
            ])
        });

        it('all fail, reject and the response must be false', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('ji', false), api2('2', false), api3('3', false)];
            const invoke = () => {
                // @ts-ignore
                const array1 = [].concat(array);
                // @ts-ignore
                return Promise.allow(array1, [0, 1, 2])
                    .catch((e: any) => e)
            };
            return Promise.all([
                expect(invoke().then((d: any) => d[0].isDone)).to.eventually.eql(false),
                expect(invoke().then((d: any) => d[1].isDone)).to.eventually.eql(false),
                expect(invoke().then((d: any) => d[2].isDone)).to.eventually.eql(false)
            ])
        })
    });

    describe('check whitelist', () => {
        it('allow first fail, but second fail others success, reject', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('1'), api2(new Error('ji'), false), api3('3')];
            const invoke = () => {
                // @ts-ignore
                return Promise.allow(array, [0])
                    .then((d: any) => {
                        return d
                    })
                    .catch((e: any) => {
                        throw e
                    })
            };
            return expect(invoke()).to.eventually.rejected;
        });

        it('allow first and third fail, but second fail others success, reject', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('1'), api2(new Error('ji'), false), api3('3')];
            const invoke = () => {
                // @ts-ignore
                return Promise.allow(array, [0, 2])
                    .then((d: any) => {
                        return d
                    })
                    .catch((e: any) => {
                        throw e
                    })
            };
            return expect(invoke()).to.eventually.rejected;
        });

        it('allow the second can fail, and second fail others success, resolve', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('1'), api2(new Error('ji'), false), api3('3')];
            const invoke = () => {
                // @ts-ignore
                return Promise.allow(array, [1])
                    .then((d: any) => {
                        return d
                    })
                    .catch((e: any) => {
                        throw e
                    })
            };
            return expect(invoke()).to.eventually.fulfilled;
        });

        it('allow the second can fail, but second and third fail other success, reject', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('1'), api2('ji', false), api3('3', false)];
            const invoke = () => {
                // @ts-ignore
                return Promise.allow(array, [1])
                    .catch((e: any) => {
                        throw new Error();
                    })
            };
            return expect(invoke()).to.eventually.rejected;
        });

        it('all fail, reject', () => {
            PromiseExtends.extend({isExtend: true});
            const array = [api1('1', false), api2('ji', false), api3('3', false)];
            const invoke1 = () => {
                // @ts-ignore
                return Promise.allow(array, [1, 2])
                    .catch((e: any) => {
                        throw new Error();
                    })
            };
            const invoke2 = () => {
                // @ts-ignore
                return Promise.allow(array, [0, 1, 2])
                    .catch((e: any) => {
                        throw new Error();
                    })
            };
            return Promise.all([
                expect(invoke1()).to.eventually.rejected,
                expect(invoke2()).to.eventually.rejected,
            ]);
        })
    });

    describe('check the params', () => {
        it('there is no params', () => {
            const invoke = () => {
                // @ts-ignore
                return Promise.allow()
            };

            return expect(invoke()).to.eventually.rejectedWith('has no params');
        });

        it('the length of params can not less than two', () => {
            const invoke = () => {
                // @ts-ignore
                return Promise.allow([api1('ji')])
            };
            return expect(invoke()).to.eventually.rejected;
        });
    });
});