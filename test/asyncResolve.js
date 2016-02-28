import {expect} from 'chai';
import {resolve,asyncResolve} from '../src/asyncResolve';

describe('asyncResolve', () => {

  const componentA = (props) => (<div></div>);

  describe('resolve', () => {

    it('should create new component with asyncResolve property', () => {
      const newComponent = resolve('someName')(componentA);
      expect(newComponent).to.have.property('asyncResolve');
    });

    it('wrapped component should be not modified', () => {
      const newComponent = resolve('someName')(componentA);
      expect(componentA).to.not.have.property('asyncResolve');
      expect(componentA).to.not.equal(newComponent);
    });

    it('after multiple usage one AsyncResolve component should be created', () => {
      const first = resolve('someName')(componentA);
      const second = resolve('someName')(first);
      expect(first).to.equal(second);
    });

    it('static asyncResolve property should have map with key string and value array', () => {
      const newComponent = resolve('someName',1)(componentA);
      expect(newComponent.asyncResolve).to.have.property('someName');
      expect(newComponent.asyncResolve.someName).to.be.instanceof(Array);
      expect(newComponent.asyncResolve.someName).to.include(1);
    });

    it('on multiple usage all resolves should be added to array', () => {
      const one = resolve('someName',1)(componentA);
      resolve('someName',2)(one);
      expect(one.asyncResolve.someName).to.include(1);
      expect(one.asyncResolve.someName).to.include(2);
    });

  });

  describe('asyncResolve', () => {

    it('should create component with preResolve and deferResolve keys in static asyncResolve property', () => {

      const newComponent = asyncResolve(1,2)(componentA);
      expect(newComponent.asyncResolve.preResolve).to.include(1);
      expect(newComponent.asyncResolve.deferResolve).to.include(2);

    })

  });

});
