import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    dataset: PropTypes.shape({
        id: PropTypes.string.isRequired,
        alias: PropTypes.string.isRequired,
    }),
    onNewVersionClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

class DatasetItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.isLoading !== this.props.isLoading) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <li className="simple-select-list__item" key={this.props.dataset.id}>
                <h2>
                    <a
                        href="javascript:void(0)"
                        onClick={this.props.onNewVersionClick}
                        data-recipe-id={this.props.dataset.id}
                        disabled={this.props.isLoading}
                    >
                        {this.props.dataset.alias}
                    </a>
                </h2>
            </li>
        );
    }
}

DatasetItem.propTypes = propTypes;

export default DatasetItem;
