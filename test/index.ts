/**
 * @file 单元测试
 */
import { PromiseExtends } from '../index'

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

PromiseExtends.extend({isExtend: true});

describe('promise-extends', () => {
    describe('test Promise.limit', () => {
        it('test', () => {
            const fn = function() {
                return new Promise((res, rej) => {
                    res(1)
                })
            };

            return expect(fn()).to.become(1);
        });
    });

    describe('test Promise.catch', () => {

    });

    describe('test Promise.allow', () => {

    });

    describe('test Promise.shake', () => {

    });

    describe('test Promise.prototype.finally', () => {

    });

    describe('test Promise.prototype.done', () => {

    });
});