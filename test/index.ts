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
            return expect(Promise.reject({ foo1: "bar" })).to.eventually.have.property("foo");
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