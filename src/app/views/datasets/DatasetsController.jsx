import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateAllDatasets } from '../../config/actions';
import recipes from '../../utilities/api-clients/recipes';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        alias: PropTypes.string
    })),
    rootPath: PropTypes.string.isRequired
}

class DatasetsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingDatasets: false,
            isFetchingJobs: false
        }
    }
    
    componentWillMount() {
        this.setState({isFetchingDatasets: true});

        recipes.getAll().then(response => {
            const allDatasets = response.items.map(dataset => {
                return {
                    id: dataset.id,
                    alias: dataset.alias,
                    files: dataset.files
                }
            });
            this.props.dispatch(updateAllDatasets(allDatasets));
            this.setState({isFetchingDatasets: false});
        }).catch(error => {
            console.error("Error getting recipes: ", error);
            this.setState({isFetchingDatasets: false});
        });
    }

    renderDatasets() {
        return this.props.datasets.map(dataset => {
                return (
                    <Link to={`${this.props.rootPath}/datasets/${dataset.id}`} key={dataset.id}>
                        {dataset.alias}
                    </Link>
                )
            })
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <h1>All datasets</h1>
                    <h2>In progress</h2>
                    {!this.state.isFetchingJobs &&
                        "To be built"
                    }
                    <h2>Upload a new version</h2>
                    {this.state.isFetchingDatasets &&
                        <div className="grid--align-center grid--align-self-center"> 
                            <div className="loader loader--large loader--dark"></div>
                        </div> 
                    }
                    {this.props.datasets.length > 0 &&
                        this.renderDatasets()
                    }
                </div>
            </div>
        )
    }
}

DatasetsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        datasets: state.state.datasets.all,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetsController);