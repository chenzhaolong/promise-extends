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

    it('when limitNumber is 3 when invoke Promise.limit for success', () => {
        PromiseExtends.extend({isExtend: true});
        const invoke = () => {
            // @ts-ignore
            return Promise.limit(fetchArray, {limitNumber: 3})
                .then((d:any) => {
                    return d;
                })
                .catch((e: any) => {});
        };
        return expect(invoke()).to.eventually.eql(['1', '2', '3', '4', '5']);
    })
});