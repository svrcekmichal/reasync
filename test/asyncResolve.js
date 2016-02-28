import {expect} from 'chai';
import {asyncResolve} from '../src/asyncResolve';

describe('asyncResolve', () => {

  const componentA = (props) => (<div></div>);

  it('should create new component with preResolve and deferResolve property', () => {
    const newComponent = asyncResolve()(componentA);
    expect(newComponent).to.have.property('preResolve');
    expect(newComponent).to.have.property('deferResolve');
  });

  it('should set preResolve property to value', () => {
    const newComponent = asyncResolve(true)(componentA);
    expect(newComponent.preResolve).to.equal(true);
    expect(newComponent.deferResolve).to.equal(undefined);
  });

  it('should set deferResolve property to value', () => {
    const newComponent = asyncResolve(undefined,true)(componentA);
    expect(newComponent.preResolve).to.equal(undefined);
    expect(newComponent.deferResolve).to.equal(true);
  });

  it('should set both resolve properties to value', () => {
    const newComponent = asyncResolve(1,2)(componentA);
    expect(newComponent.preResolve).to.equal(1);
    expect(newComponent.deferResolve).to.equal(2);
  });

});
