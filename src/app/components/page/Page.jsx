import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    type: PropTypes.string,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]).isRequired,
    isActive: PropTypes.bool
};

export class Page extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"page page--" + this.props.type + (this.props.isActive ? " active" : "")}>
                {this.props.title}
            </div>
        )
    }
}

Page.propTypes = propTypes;

export default Page;