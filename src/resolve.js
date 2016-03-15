import React, { Component } from 'react';

export const PRE_RESOLVE_HOOK = 'preResolveHook';
export const DEFER_RESOLVE_HOOK = 'deferResolveHook';

export const resolve = (name, toResolve) => WrappedComponent => {
  let component;
  if (typeof WrappedComponent.asyncResolve === 'undefined') {
    component = class AsyncResolve extends Component {
      static asyncResolve = Object.create(null);

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  } else {
    component = WrappedComponent;
  }

  if (typeof component.asyncResolve[name] === 'undefined') {
    component.asyncResolve[name] = [];
  }

  component.asyncResolve[name].push(toResolve);
  return component;
};

export const preResolve = resolve.bind(undefined, PRE_RESOLVE_HOOK);

export const deferResolve = resolve.bind(undefined, DEFER_RESOLVE_HOOK);
