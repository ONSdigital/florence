import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

import Layout from './global/Layout'
import Collections from './collections/Collections';
import Login from './login/Login';

import routes from './config/routes';
import store from './config/store'

export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route component={ Layout }>
                        <Route path="/florence" component={ Collections } />
                        <Route path="/florence/collections" component={ Collections } />
                        <Route path="/florence/login" component={ Login } />
                    </Route>
                </Router>
            </Provider>
        )
    }
}