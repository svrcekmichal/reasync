export const createLocationStorage = () => {
  let lastLocation = {
    pathname: undefined,
    search: undefined,
    query: undefined,
    state: undefined,
    action: undefined,
  };

  const setNewLocation = location => {
    lastLocation = location;
  };

  const getLastLocation = () => lastLocation;

  return {
    setNewLocation,
    getLastLocation
  };
};
