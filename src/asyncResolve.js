import React, { Component } from 'react';

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

export const preResolve = resolve.bind(undefined, 'preResolve');

export const deferResolve = resolve.bind(undefined, 'deferResolve');

/**
 * @deprecated
 * @param pre
 * @param defer
 */
export const asyncResolve = (pre, defer) => component => deferResolve(defer)(preResolve(pre)(component));
