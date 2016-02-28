import {expect} from 'chai';
import {asyncResolve} from '../src/asyncResolve';
import {getPreResolveDependencies,getDeferResolveDependencies} from '../src/helpers';

describe('helpers', () => {

  const componentA = (props) => (<div></div>);

  describe('getPreResolveDependencies', () => {

    it('should receive passed attributes', () => {
      const availableAttributes = 'attributes';
      let receivedAttributes;

      const pre = (attributes) => receivedAttributes = attributes;

      const components = [asyncResolve(pre)(componentA)];
      getPreResolveDependencies(components)(availableAttributes);
      expect(availableAttributes).to.equal(receivedAttributes);
    });

    it('should handle only preResolve', () => {

      let handledPre = false;
      let handledDefer = false;

      const pre = (attributes) => handledPre = true;
      const defer = (attributes) => handledDefer = true;
      const components = [asyncResolve(pre,defer)(componentA)];

      getPreResolveDependencies(components)(null);

      expect(handledPre).to.be.ok;
      expect(handledDefer).to.not.be.ok;
    });

  });

  describe('getDeferResolveDependencies', () => {

    it('should receive passed attributes', () => {
      const availableAttributes = 'attributes';
      let receivedAttributes;

      const defer = (attributes) => receivedAttributes = attributes;

      const components = [asyncResolve(undefined, defer)(componentA)];
      getDeferResolveDependencies(components)(availableAttributes);
      expect(availableAttributes).to.equal(receivedAttributes);
    });

    it('should handle only deferResolve', () => {

      let handledPre = false;
      let handledDefer = false;

      const pre = (attributes) => handledPre = true;
      const defer = (attributes) => handledDefer = true;
      const components = [asyncResolve(pre,defer)(componentA)];

      getDeferResolveDependencies(components)(null);

      expect(handledPre).to.not.be.ok;
      expect(handledDefer).to.be.ok;
    });

  });

  describe('resolveDependencies', () => {

    it('should handle both resolve', () => {

      let handledPre = false;
      let handledDefer = false;

      const pre = (attributes) => handledPre = true;
      const defer = (attributes) => handledDefer = true;
      const components = [asyncResolve(pre,defer)(componentA)];

      getPreResolveDependencies(components)(null);
      getDeferResolveDependencies(components)(null);

      expect(handledPre).to.be.ok;
      expect(handledDefer).to.be.ok;
    });
  })

});
