import {getPreResolveDependencies, getDeferResolveDependencies} from './helpers';

export const resolveOnServer = ({location,params, components}, {getState,dispatch}, custom = {}) => {
  const attrs = {...custom, location, params, getState, dispatch};
  return Promise.all(getPreResolveDependencies(components)(attrs))
    .then(getDeferResolveDependencies(components)(attrs))
}