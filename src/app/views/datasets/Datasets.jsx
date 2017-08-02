import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    datasets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        alias: PropTypes.string.isRequired
    })),
    onNewVersionClick: PropTypes.func.isRequired
}

class Datasets extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.datasets.map(dataset => {
                    return (
                        // <Link to={`${this.props.rootPath}/datasets/${dataset.id}`} key={dataset.id}>
                        //     {dataset.alias}
                        // </Link>
                        <div className="grid grid--justify-space-between" key={dataset.id}>
                            {dataset.alias}
                            <button 
                                className="btn btn--primary" 
                                data-recipe-id={dataset.id}
                                onClick={this.onNewVersionClick}
                            >
                                Upload new version
                            </button>
                        </div>
                    );
                })}
            </div>
        )
    }
}

Datasets.propTypes = propTypes;

export default Datasets;