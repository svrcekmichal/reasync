import {getPreResolveDependencies, getDeferResolveDependencies} from './helpers';

export const resolveOnServer = ({location,params, components}, {getState,dispatch}, custom = {}) => {
  const attrs = {...custom, location, params, getState, dispatch};
  const deferResolve = () => Promise.all(getDeferResolveDependencies(components)(attrs));
  return Promise.all(getPreResolveDependencies(components)(attrs))
    .then(deferResolve,deferResolve);
}