/**
 * @file finally的单元测试用例
 */

import { PromiseExtends } from '../index'

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

PromiseExtends.extend({isExtend: true});

describe('test Promise.prototype.finally', () => {
    it('loading can be false when success', () => {
        let loading = true;
        const api = function() {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    res();
                }, 500);
            });
        };
        const handle = () => {
            return api().finally(() => {
                loading = false;
            }).then(() => {
                return loading;
            });
        };
        return expect(handle()).to.become(false);
    });
});