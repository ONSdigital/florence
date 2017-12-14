import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export class Page extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"page page--" + this.props.type}>
                {this.props.title}
            </div>
        )
    }
}

Page.propTypes = propTypes;

export default Page;