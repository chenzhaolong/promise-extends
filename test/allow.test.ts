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

    it('Promise.allow can allow some one success', () => {
        PromiseExtends.extend({isExtend: true});
        const array = [api1('1'), api2('2', false), api3('3')];
        const invoke = () => {
            // @ts-ignore
            return Promise.allow(array)
                .then((d: any) => {
                    return d;
                })
        };
        return expect(invoke()).to.eventually.be.fulfilled;
    });
});