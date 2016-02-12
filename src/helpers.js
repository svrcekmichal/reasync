const getDependencies = (components, preResolve = true) => (location,params,custom = {}) => {
    const resolveType = preResolve ? 'preResolve' : 'deferResolve';
    return components
        .filter(component => component && component[resolveType])
        .map(component => component[resolveType])
        .map(fetchData => fetchData({location,params,...custom}))
};

export const getPreResolveDependencies = (components) => getDependencies(components, true);
export const getDeferResolveDependencies = (components) => getDependencies(components, false);