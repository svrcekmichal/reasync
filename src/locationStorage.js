export const createLocationStorage = () => {
  let lastLocation = {
    pathname: undefined,
    search: undefined,
    query: undefined,
    state: undefined,
    action: undefined,
  };

  function setNewLocation(location) {
    lastLocation = location;
  }

  function getLastLocation() {
    return lastLocation;
  }

  return {
    setNewLocation,
    getLastLocation
  }

}