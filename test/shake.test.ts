/**
 * @file shake的单元测试用例
 */

import { PromiseExtends } from '../index'

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

PromiseExtends.extend({isExtend: true});

describe('test Promise.shake', () => {});