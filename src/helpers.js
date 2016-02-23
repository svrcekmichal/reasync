const getDependencies = (components, preResolve = true) => (attrs) => {
  const resolveType = preResolve ? 'preResolve' : 'deferResolve';
  return components
    .filter(component => component && component[resolveType])
    .map(component => component[resolveType])
    .map(fetchData => fetchData(attrs));
};

export const getPreResolveDependencies = (components) => getDependencies(components, true);
export const getDeferResolveDependencies = (components) => getDependencies(components, false);
