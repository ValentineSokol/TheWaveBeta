import React from 'react';
import {connect} from 'react-redux';
import {queryParamsChanged} from '../../redux/actions/misc';

class QueryParser extends React.PureComponent {
    render() {
        return null;
    }
    parseQuery() {
        const result = {};
        if (!window.location.search) return {};
        const queryString = window.location.search.slice(1);
        const pairStrings = queryString.split('&');
        pairStrings.forEach(
            (pair) => {
                const [key, value] = pair.split('=');
                result[key] = value;
            }
        );
        return result;
    }
    componentDidMount() {
        this.props.queryParamsChanged(this.parseQuery());
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location === this.props.location) return;
        this.props.queryParamsChanged(this.parseQuery());
    }
}

export default connect(null, { queryParamsChanged })(QueryParser);