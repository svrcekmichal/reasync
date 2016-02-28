const getDependencies = (components, type) => (attrs) => {
  const toResolve = components
    .filter(component => component && component.asyncResolve && component.asyncResolve[type])
    .map(component => component.asyncResolve[type]);

  const flattened = [].concat.apply([], toResolve);
  return flattened.map(resolve => resolve(attrs));
};

export const getPreResolveDependencies = (components) => getDependencies(components, 'preResolve');
export const getDeferResolveDependencies = (components) => getDependencies(components, 'deferResolve');
