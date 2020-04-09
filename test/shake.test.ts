/**
 * @file shake的单元测试用例
 */

import { PromiseExtends } from '../index'

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

PromiseExtends.extend({isExtend: true});

describe('test Promise.shake', () => {
    it('Promise.shake has exist when invoke PromiseExtends.extend', () => {
        PromiseExtends.extend({isExtend: true});
        // @ts-ignore
        const type = typeof Promise.shake;
        expect(type).to.equal('function');
    });

    it('Promise.shake has no exist when do not invoke PromiseExtends.extend', () => {
        PromiseExtends.extend({isExtend: false});
        // @ts-ignore
        const type = typeof Promise.shake;
        expect(type).to.equal('undefined');
    });

    it('the param is empty, reject', () => {
        PromiseExtends.extend({isExtend: true});
        // @ts-ignore
        const invoke = Promise.shake();
        return expect(invoke()).to.eventually.rejectedWith('params can not be empty');
    });

    it('the param is not a function, reject', () => {
        PromiseExtends.extend({isExtend: true});
        // @ts-ignore
        const invoke = Promise.shake(new Promise(res => res()));
        return expect(invoke()).to.eventually.rejectedWith('params must be function');
    });

    it('the param is not prmose or thenable, reject', () => {
        PromiseExtends.extend({isExtend: true});
        const fn1 = () => {return {}};
        // @ts-ignore
        const invoke = Promise.shake(fn1);
        return expect(invoke()).to.eventually.rejectedWith('params is not promise or thenable');
    });

    it('invoke Promise.shake, can work', () => {
        PromiseExtends.extend({isExtend: true});
        const fn = () => {
            return new Promise((res, rej) => {
                res('yes');
            });
        };
        // @ts-ignore
        const invoke = Promise.shake(fn);
        return expect(invoke()
            .then((d: any) => {
                return d + '111';
            })).to.eventually.equal('yes111');
    });

    it('invoke Promise.shake, can work in thenable', () => {
        PromiseExtends.extend({isExtend: true});
        const fn = () => {
            return {
                then: (fn1: any) => {
                    return fn1()
                }
            }
        };
        // @ts-ignore
        const invoke = Promise.shake(fn);
        return expect(invoke()
            .then((d: any) => {
                return '111';
            })).to.eventually.equal('111');
    });

    it('invoke Promise.shake, can not work', () => {
        PromiseExtends.extend({isExtend: true});
        const fn = () => {
            return new Promise((res, rej) => {
                rej('yes');
            });
        };
        // @ts-ignore
        const invoke = Promise.shake(fn);
        return expect(invoke()
            .catch((d: any) => {
                return d + '111';
            })).to.eventually.equal('yes111');
    });

    it('invoke fn multiply times when invoke Promise.shake, only execute one time', () => {
        PromiseExtends.extend({isExtend: true});
        const fn = (a: any) => {
            console.log('here');
            return new Promise((res, rej) => {
                res(a);
            });
        };

        // @ts-ignore
        const shakeFn = Promise.shake(fn);

        expect(shakeFn(1)
            .then((d: any) => {
                console.log('one', d);
                return 23
            })).to.eventually.equal(23);

        expect(shakeFn(2)
            .then((d: any) => {
                console.log('two', d);
                return d
            })).to.eventually.equal(1);
    });
});