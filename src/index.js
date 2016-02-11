import React,{Component, PropTypes} from 'react';
import {RouterContext, match} from 'react-router';

const {array,object,func} = PropTypes;

export default (pre, defer) => {
    return WrappedComponent => {
        class AsyncResolve extends Component {

            static pre = pre;
            static defer = defer;

            render() {
                return (<WrappedComponent {...this.props} />)
            }
        }

        return AsyncResolve;
    }
}

export const getAsyncDependencies = (components, pre = true) => (location,params,custom = {}) => {
    const resolveType = pre ? 'pre' : 'defer';
    return components
        .filter(component => component && component[resolveType])
        .map(component => component[resolveType])
        .map(fetchData => fetchData({location,params,...custom}))
};

export function connectHistoryForResolving(history,routes, custom) {

    history.listenBefore((location, callback) => {
        match({history,location,routes},(error, redirectLocation, renderProps) => { //TODO handle redirect
            const preAsyncDependencies = getAsyncDependencies(renderProps.components);
            const resolveParams = [renderProps.location, renderProps.params, custom];
            return Promise.all(preAsyncDependencies(...resolveParams)).then(callback,(e) => {
                console.warn('Error in client fetching', e);
                callback();
            });
        });
    });

}

export class AsyncResolver extends Component {
    static propTypes = {
        components: array.isRequired,
        params: object.isRequired,
        render: func.isRequired,
        custom: object
    };

    static defaultProps = {
        render: (props) => {
            return <RouterContext {...props} />;
        },
        custom:{}
    };

    componentWillMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        const {pathname:oldPathname, search: oldSearch} = this.props.location;
        const {pathname:newPathname, search: newSearch} = nextProps.location;
        if(oldPathname != newPathname || oldSearch != newSearch) {
            this.fetchData();
        }
    }

    fetchData() {
        const {components,location, params, custom} = this.props;
        const deferAsyncDependencies = getAsyncDependencies(components, false);
        return Promise.all(deferAsyncDependencies(location,params,custom)).catch((e) => {
            console.warn('Error in client fetching', e);
        });
    }

    render() {
        return this.props.render(this.props);
    }
}
