import {expect} from 'chai';
import {createLocationStorage} from '../src/locationStorage';

describe('locationStorage', () => {

  it('init value keys are undefined', () => {
    const initLocation = createLocationStorage().getLastLocation();
    expect(typeof initLocation.pathname === 'undefined').to.be.ok;
    expect(typeof initLocation.search === 'undefined').to.be.ok;
  });

  it('replace init location with new location', () => {
    const locationStorage = createLocationStorage();
    const newLocation = {
      pathname:'abc',
      search:'def'
    };

    locationStorage.setNewLocation(newLocation);
    expect(locationStorage.getLastLocation()).to.equal(newLocation);
  });

  it('replace previous location with new location', () => {
    const locationStorage = createLocationStorage();
    const locationA = {
      pathname:'abc',
      search:'def'
    };
    const locationB = {
      pathname:'abc',
      search:'def'
    };

    locationStorage.setNewLocation(locationA);
    locationStorage.setNewLocation(locationB);
    expect(locationStorage.getLastLocation()).to.equal(locationB);

  });

  it('return same object on duplicate getLastLocation()', () => {
    const locationStorage = createLocationStorage();
    const newLocation = {
      pathname:'abc',
      search:'def'
    };

    locationStorage.setNewLocation(newLocation);
    expect(locationStorage.getLastLocation()).to.equal(newLocation);
    expect(locationStorage.getLastLocation()).to.equal(newLocation);
  });

});
