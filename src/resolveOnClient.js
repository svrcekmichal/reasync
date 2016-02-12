import {ReactRouter, match} from 'react-router';
import {getPreResolveDependencies,getDeferResolveDependencies} from './helpers'

export const resolveOnClient = (history, routes, custom) => {
  history.listenBefore((location, continueTransiton) => {
    match({history, location, routes}, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        history.transitionTo(redirectLocation);
      } else if(renderProps) {
        const {components,params} = renderProps;
        const attrs = [location,params,custom];
        Promise.all(getPreResolveDependencies(components)(...attrs))
          .then(continueTransiton,continueTransiton)
          .then(getDeferResolveDependencies(components)(...attrs))
      }
    });
  });
}