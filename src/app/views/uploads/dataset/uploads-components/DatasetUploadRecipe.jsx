import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    dataset: PropTypes.shape({
        id: PropTypes.string.isRequired,
        alias: PropTypes.string.isRequired
    }),
    onNewVersionClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}

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
            <li className="list__item list__item--separated grid grid--justify-space-between" key={this.props.dataset.id}>
                {this.props.dataset.alias}
                <div>
                    {this.props.isLoading &&
                        <span className="loader loader--dark"></span>
                    }
                    <button 
                        className="btn btn--primary" 
                        data-recipe-id={this.props.dataset.id}
                        onClick={this.props.onNewVersionClick}
                        disabled={this.props.isLoading}
                    >
                        Upload new version
                    </button>
                </div>
            </li>
        )
    }
}

DatasetItem.propTypes = propTypes;

export default DatasetItem;