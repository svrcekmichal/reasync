import {getPreResolveDependencies, getDeferResolveDependencies} from './helpers';

export const resolveOnServer = ({location,params, components},custom) => {
    const attrs = [location,params,custom];
    return Promise.all(getPreResolveDependencies(components)(...attrs))
        .then(getDeferResolveDependencies(components)(...attrs))
}