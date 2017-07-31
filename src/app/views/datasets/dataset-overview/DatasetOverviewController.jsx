import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import objectIsEmpty from 'is-empty-object';
import { updateActiveDataset } from '../../../config/actions';
import recipes from '../../../utilities/api-clients/recipes';
import datasetImport from '../../../utilities/api-clients/datasetImport';
import notifications from '../../../utilities/notifications';
import Input from '../../../components/Input';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.object),
    activeDataset: PropTypes.shape({
        id: PropTypes.string,
        alias: PropTypes.string,
        files: PropTypes.arrayOf(PropTypes.shape({
            description: PropTypes.string.isRequired
        }))
    }),
    params: PropTypes.shape({
        dataset: PropTypes.string.isRequired
    }).isRequired
}

class DatasetOverviewController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isFetchingDatasets: false,
            jobID: "",
            textareaTimer: null
        }

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleMetadataChange = this.handleMetadataChange.bind(this);
    }
    
    componentWillMount() {
        if (!this.props.datasets || this.props.datasets.length === 0) {
            this.setState({isFetchingDatasets: true});
            recipes.get(this.props.params.dataset).then(response => {
                this.props.dispatch(updateActiveDataset(response));
                this.setState({isFetchingDatasets: false});
            }).catch(error => {
                console.error("Error getting datasets from recipe API: ", error);
                this.setState({isFetchingDatasets: false});
            })
        } else {
            const activeDataset = this.props.datasets.find(dataset => {
                return dataset.id === this.props.params.dataset
            });

            if (!activeDataset) {
                const notification = {
                    type: "neutral",
                    message: "This dataset was not recognised, so you've been redirected to the main screen",
                    isDismissable: true
                }
                notifications.add(notification);
                this.props.dispatch(push(`${this.props.rootPath}/datasets`));
                return;
            }

            this.props.dispatch(updateActiveDataset(activeDataset));
        }
    }

    handleFileChange(event) {

        if (this.state.jobID.length === 0) {
            datasetImport.create(this.props.activeDataset.id).then(response => {
                console.log(response);
                this.setState({jobID: response.job_id});
            }).catch(error => {
                console.error("Error creating new job: ", error);
            });
            return;
        }

        const formData = new FormData();
        formData.append('url', event.target.files[0]);
        formData.append('alias_name', '');
        datasetImport.addFile(this.state.jobID, formData).then(response => {
            console.log(response);
        }).catch(error => {
            console.error(`Error adding file to job "${this.state.jobID}": `, error);
        });
    }

    handleMetadataChange(event) {
        //FIXME once the API exists this needs to be making a POST/PUT to that API.
        console.log(event.target.value);
    }

    renderFileInputs() {
        if (!this.props.activeDataset || objectIsEmpty(this.props.activeDataset)) {
            return;
        }

        return this.props.activeDataset.files.map((file, index) => {
            return (
                <Input 
                    label={file.description}
                    type="file"
                    id={"dataset-upload-" + index.toString()}
                    key={index}
                    onChange={this.handleFileChange}
                    accept=".xls, .xlsx, .csv"
                />
            )
        })
        
    }

    render() {
        return(
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <h1>Upload new file(s)</h1>
                    <Link to={`${this.props.rootPath}/datasets`}>Save and return</Link>
                    {this.state.isFetchingDatasets &&
                        <div className="grid--align-center grid--align-self-center"> 
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                    }
                    <h2>
                        {!objectIsEmpty(this.props.datasets) && this.props.activeDataset ?
                            this.props.activeDataset.alias
                            :
                            ""
                        }
                    </h2>
                    { this.renderFileInputs() }
                    <Input 
                        type="textarea"
                        label="What has changed in this version?"
                        id="metadata-upload"
                        onChange={this.handleMetadataChange}
                    />
                </div>
            </div>
        )
    }
}

DatasetOverviewController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        datasets: state.state.datasets.all,
        activeDataset: state.state.datasets.active,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetOverviewController);