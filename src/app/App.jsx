import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { hasValidAuthToken } from './utilities/hasValidAuthToken';
import { userLoggedIn } from './config/actions';
import user from './utilities/user';

const propTypes = {
    children: PropTypes.node,
    dispatch: PropTypes.func.isRequired
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCheckingAuthentication: false
        }
    }

    componentWillMount() {
        this.setState({isCheckingAuthentication: true});
        hasValidAuthToken().then(isValid => {
            if (isValid) {
                const email = localStorage.getItem("loggedInAs");
                if (!email) {
                    console.warn(`Unable to find item 'loggedInAs' from local storage`);
                    return;
                }

                user.getPermissions(email).then(userType => {
                    user.setUserState(userType);
                    this.setState({isCheckingAuthentication: false});
                });
                return;
            }
            this.setState({isCheckingAuthentication: false});
        })
    }

    render() {
        return (
            <div>
                {   
                    this.state.isCheckingAuthentication ?
                        <div className="grid grid--align-center grid--align-self-center grid--full-height">
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                        :
                        this.props.children
                }
            </div>
        )
    }
}

App.propTypes = propTypes;

export default connect()(App);