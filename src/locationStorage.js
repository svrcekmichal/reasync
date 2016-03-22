export const createLocationStorage = (location = undefined) => {
  let lastLocation = location || {
    pathname: undefined,
    search: undefined,
    query: undefined,
    state: undefined,
    action: undefined,
  };

  const setNewLocation = newlocation => {
    lastLocation = newlocation;
  };

  const getLastLocation = () => lastLocation;

  return {
    setNewLocation,
    getLastLocation
  };
};
