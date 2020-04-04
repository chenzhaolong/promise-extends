/**
 * @file finally的单元测试用例
 */

import { PromiseExtends } from '../index'

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

PromiseExtends.extend({isExtend: false});

describe('test Promise.prototype.finally', () => {
    const api = function(isSuccess: boolean) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                isSuccess ? res(1) : rej('error');
            }, 100);
        });
    };

    it('loading can be false when success', () => {
        let loading = true;
        const handle = () => {
            return api(true)
                .then(d => d)
                .finally(() => {
                    loading = false;
                }).then(() => {
                    return loading;
                });
        };
        return expect(handle()).to.become(false);
    });

    it('loading can be false when fail', () => {
        let loading = true;
        const handle = () => {
            return api(false)
                .then(d => d)
                .finally(() => {
                    loading = false;
                })
                .catch(e => {
                    return loading;
                })
        };
        return expect(handle()).to.become(false);
    });
});