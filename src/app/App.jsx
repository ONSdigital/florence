import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { hasValidAuthToken } from './utilities/hasValidAuthToken';
import { userLoggedIn } from './config/actions';

const propTypes = {
    children: PropTypes.node,
    dispatch: PropTypes.func.isRequired
}

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isCheckingAuthentication: false
        }
    }

    componentWillMount() {
        this.setState({isCheckingAuthentication: true});
        hasValidAuthToken().then(isValid => {
            if (isValid) {
                this.props.dispatch(userLoggedIn("unknown", "unknown", "unknown"))
            }
            this.setState({isCheckingAuthentication: false});
        })
    }

    render() {
        return (
            <div>
                {   
                    this.state.isCheckingAuthentication ?
                        "Loading..."
                        :
                        this.props.children
                }
            </div>
        )
    }
}

App.propTypes = propTypes;

export default connect()(App);