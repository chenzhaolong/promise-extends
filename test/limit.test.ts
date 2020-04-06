/**
 * @file limit的单元测试用例
 */

import { PromiseExtends } from '../index'

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('test Promise.limit', () => {
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

    const fetchArray = [api1('1'), api2('2'), api3('3'), api4('4'), api5('5')];

    it('Promise.limit has exist when invoke PromiseExtends.extend', () => {
        PromiseExtends.extend({isExtend: true});
        // @ts-ignore
        const type = typeof Promise.limit;
        expect(type).to.equal('function');
    });

    it('Promise.limit has no exist when do not invoke PromiseExtends.extend', () => {
        PromiseExtends.extend({isExtend: false});
        // @ts-ignore
        const type = typeof Promise.limit;
        expect(type).to.equal('undefined');
    });

    it('when limitNumber is 4 invoking Promise.limit for success', () => {
        PromiseExtends.extend({isExtend: true});
        const invoke = () => {
            // @ts-ignore
            return Promise.limit(fetchArray, {limitNumber: 4})
                .then((d:any) => {
                    return d;
                })
                .catch((e: any) => {});
        };
        return expect(invoke()).to.eventually.eql(['1', '2', '3', '4', '5']);
    });

    it('when limitNumber is 4 invoking Promise.limit for one of fail', () => {
        PromiseExtends.extend({isExtend: true});
        const errorFn1 = () => {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    rej('error');
                }, 32)
            });
        };
        const array = [api1('1'), api2('2'), api3('3'), api4('4'), api5('5'), errorFn1()];
        const invoke = () => {
            // @ts-ignore
            return Promise.limit(array, {limitNumber: 4})
                .then(() => {})
                .catch((e: any) => {
                    throw e
                })
        };
        return expect(invoke()).to.eventually.rejectedWith('error');
    })

    it('array is empty for Promise.limit', () => {
        const invoke = () => {
            // @ts-ignore
            return Promise.limit([])
                .then((d: any) => {
                    return d.length
                })
        };
        return expect(invoke()).to.eventually.equal(0);
    });

    it('invoke Promise.limit outside, invoke Promise.limit inside', () => {
        const invoke1 = () => {
            // @ts-ignore
            return Promise.limit([api1('1'), api2('2'), api3('3')], {limitNumber: 2})
                .then((d: any) => {
                    return d
                })
        };
        const invoke2 = () => {
            // @ts-ignore
            return Promise.limit([api4({a: 1}), api5('5'), invoke1()], {limitNumber: 2})
                .then((d: any) => {
                    return d
                })
        };
        return expect(invoke2()).to.eventually.eql([{a: 1}, '5', ['1', '2', '3']]);
    })

    it('the length of array is 9, the limitNumber is 2', () => {
        fetchArray.push(api1('6'));
        fetchArray.push(api1([1,2]));
        fetchArray.push(api1({a: 1}));
        fetchArray.push(api1('ad'));
        const invoke = () => {
            // @ts-ignore
            return Promise.limit(fetchArray, {limitNumber: 2})
                .then((d: any) => {
                    return d
                })
        };
        return expect(invoke()).to.eventually.eql(['1', '2', '3', '4', '5', '6', [1,2], {a: 1}, 'ad']);
    });
});