import {expect} from 'chai';
import {resolve} from '../src/resolve';
import {getDependencies, isFunction, isString } from '../src/helpers';

describe('helpers', () => {

  describe('getDependencies', () => {

    it('should receive passed attributes', () => {
      const availableAttributes = 'attributes';
      let receivedAttributes = undefined;

      const pre = (attributes) => {
        receivedAttributes = attributes;
      };

      const components = [resolve('hookName', pre)({})];
      getDependencies(components, 'hookName', availableAttributes);
      expect(availableAttributes).to.equal(receivedAttributes);
    });

    it('should return only wanted resolve', () => {

      let hook1Called = false;
      let hook2Called = false;

      const hook1 = (attributes) => hook1Called = true;
      const hook2 = (attributes) => hook2Called = true;
      const hooked1 = resolve('hook1', hook1)({});
      const hookedAll = resolve('hook2', hook2)(hooked1);

      getDependencies([hookedAll], 'hook1', {});

      expect(hook1Called).to.be.ok;
      expect(hook2Called).to.not.be.ok;
    });

    it('should resolve getComponents/components object map', () => {

      let hook1Count = 0;
      let hook2Count = 0;

      const hook1 = (attributes) => hook1Count++;
      const hook2 = (attributes) => hook2Count++;

      const hooked = [
        resolve('hook1', hook1)({}),
        {
          contentA: resolve('hook1', hook1)({}),
          contentB: resolve('hook2', hook2)({})
        }
      ];

      getDependencies(hooked, 'hook1', {});

      expect(hook1Count).to.equal(2);
      expect(hook2Count).to.equal(0);

    })


  });

  describe('typeHelpers', () => {

    const bool = true;
    const num = 23;
    const str = 'abc';
    const undef = undefined;
    const typeNull = null;
    const arr = [];
    const obj = {};
    const func = () => {};

    it('expect isString to detect only string', () => {
      expect(isString(bool)).to.not.be.ok;
      expect(isString(num)).to.not.be.ok;
      expect(isString(str)).to.be.ok;
      expect(isString(undef)).to.not.be.ok;
      expect(isString(typeNull)).to.not.be.ok;
      expect(isString(arr)).to.not.be.ok;
      expect(isString(obj)).to.not.be.ok;
      expect(isString(func)).to.not.be.ok;

    });

    it('expect isFunction to detect only string', () => {
      expect(isFunction(bool)).to.not.be.ok;
      expect(isFunction(num)).to.not.be.ok;
      expect(isFunction(str)).to.not.be.ok;
      expect(isFunction(undef)).to.not.be.ok;
      expect(isFunction(typeNull)).to.not.be.ok;
      expect(isFunction(arr)).to.not.be.ok;
      expect(isFunction(obj)).to.not.be.ok;
      expect(isFunction(func)).to.be.ok;
    });
  });

});
