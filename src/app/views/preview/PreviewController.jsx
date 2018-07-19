import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Iframe from '../../components/iframe/Iframe';

const propTypes = {};

export class PreviewController extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render () {
        return (
            <div className="preview">
                <Iframe/>
            </div>
        )
    }
}

PreviewController.propTypes = propTypes;

export default PreviewController;