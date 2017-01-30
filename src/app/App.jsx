import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import routes from './config/routes';
import store from './config/store'

export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Provider store={store}>
                <Router history={browserHistory} routes={routes} />
            </Provider>
        )
    }
}