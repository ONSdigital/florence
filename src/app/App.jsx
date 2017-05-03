import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { hasValidAuthToken } from './utilities/hasValidAuthToken';
import { userLoggedIn } from './config/actions';
import user from './utilities/user';

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
                const email = localStorage.getItem("loggedInAs");
                if (!email) {
                    console.warn(`Unable to find item 'loggedInAs' from local storage`);
                    return;
                }
                
                //TODO - a lot of this is shared with login controller so should be abstracted out
                user.get(email).then(userDetails => {
                    let userType = '';
                    if (userDetails.editor) {
                        userType = 'EDITOR'
                    } else {
                        userType = 'DATA-VIS'
                    }
                    const isAdmin = !!userDetails.admin;
                    this.props.dispatch(userLoggedIn(email, userType, isAdmin));
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