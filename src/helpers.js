const getDependencies = (components, type) => (attrs) => {
  const toResolve = components
    .filter(component => component && component.asyncResolve && component.asyncResolve[type])
    .map(component => component.asyncResolve[type]);
  return [].concat.apply([], toResolve)
    .filter(resolve => resolve) // only to support asyncResolve, will be removed in future
    .map(resolve => resolve(attrs));
};

export const getPreResolveDependencies = (components) => getDependencies(components, 'preResolve');
export const getDeferResolveDependencies = (components) => getDependencies(components, 'deferResolve');
