import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import objectIsEmpty from 'is-empty-object';

// import { updateDatasetJob } from '../../../config/actions';
// import recipes from '../../../utilities/api-clients/recipes';
// import Input from '../../../components/Input';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    job: PropTypes.shape({
        id: PropTypes.string,
        alias: PropTypes.string,
        files: PropTypes.arrayOf(PropTypes.shape({
            description: PropTypes.string.isRequired
        })),
        status: PropTypes.string
    }),
    params: PropTypes.shape({
        job: PropTypes.string.isRequired
    }).isRequired
}

class DatasetJobController extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <h1>Page in construction</h1>
                    <p>This will show the progress for a dataset upload job.</p>
                </div>
            </div>
        ) 
    }
}

DatasetJobController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        dataset: state.state.datasets.active
    }
}

export default connect(mapStateToProps)(DatasetJobController);