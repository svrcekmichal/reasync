import React, { Component } from 'react';

export const asyncResolve = (preResolve, deferResolve) => WrappedComponent => class AsyncResolve extends Component {

  static preResolve = preResolve;
  static deferResolve = deferResolve;

  render() {
    return (<WrappedComponent {...this.props} />);
  }
};
