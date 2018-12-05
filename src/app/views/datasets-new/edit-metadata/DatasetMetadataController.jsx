import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import datasets from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';
import url from '../../../utilities/url'
import date from '../../../utilities/date'

import Input from '../../../components/Input';
import RadioGroup from '../../../components/radio-buttons/RadioGroup';
import DatasetVersionsController from '../versions/DatasetVersionsController';


const propTypes = {

}

export class DatasetMetadataController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            datasetMetadata: {
                title: "",
                summary: "",
                keywords: [],
                nationalStatistic: false,
                licence: "",
                contactName: "",
                contentEmail: "",
                contactTelephone: "",
                relatedLinks: []
            },
            isGettingDatasetMetadata: false,
            edition: {},
            version: {},
            versionMetadata: {
                edition: "",
                version: "",
                releaseDate: "",
                nextReleaseDate: "",
                releaseFrequency: "",
                notices: [],
                dimensions: [],
            },
            isGettingVersionMetadata: false,
        }

    }

    componentWillMount() {
        const datasetID = this.props.routeParams.datasetID;
        const editionID = this.props.routeParams.editionID;
        const versionID = this.props.routeParams.versionID; 
        this.getDataset(datasetID)
        this.getVersion(datasetID, editionID, versionID)
    }

    getDataset = (datasetID) => {
        this.setState({isGettingDatasetMetadata: true})
        datasets.get(datasetID).then(dataset => {
            this.setState({datasetMetadata: this.mapDatasetToState(dataset), isGettingDatasetMetadata: false})
        })
    }

    mapDatasetToState = datasetResponse => {
        try {
            const dataset = datasetResponse.current || datasetResponse.next || datasetResponse;
            return {
                title: dataset.title,
                summary: dataset.description,
                keywords: dataset.keywords,
                nationalStatistic: dataset.national_statistic,
                licence: dataset.licence || "", 
                contactName: dataset.contacts[0].name ? dataset.contacts[0].name : "",
                contactEmail: dataset.contacts[0].email ? dataset.contact[0].email : "",
                contactTelephone: dataset.contacts[0].telephone ? dataset.contacts[0].telephone : "",
                relatedLinks: dataset.relatedDatasets || []
            }
        } catch (error) {
            console.error(error)
        }
    }

    getVersion = (datasetID, editionID, versionID) => {
        this.setState({isGettingVersionMetadata: true})
        datasets.getVersion(datasetID, editionID, versionID).then(version => {
            this.setState({versionMetadata: this.mapVersionToState(version), isGettingVersionMetadata: false});
        })
    }

    mapVersionToState = versionResponse => {
        try {
            const version = versionResponse.current || versionResponse.next || versionResponse;
            return {
                edition: version.edition,
                version: version.version,
                releaseDate: version.release_date || "",
                nextReleaseDate: version.next_release || "",
                releaseFrequency: version.release_frequency || "",
                notices: version.alerts || [],
                dimensions: version.dimensions || [],
            }
        } catch (error) {
            console.error(error)
        }
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-6 margin-bottom--4">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Edit metadata</h1>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Dataset</span>: {this.state.datasetMetadata.title ? this.state.datasetMetadata.title : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Edition</span>: {this.state.versionMetadata.edition ? this.state.versionMetadata.edition : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Version</span>: {this.state.versionMetadata.version ? this.state.versionMetadata.version : "loading..."}</p>

                    <h2>Title</h2>
                    <Input id="title" value={this.state.datasetMetadata.title}/>

                    <h2>Release dates</h2>
                    <Input id="release-date" label="Release date" type="date" value={this.state.versionMetadata.releaseDate && date.format(this.state.versionMetadata.releaseDate, "yyyy-mm-dd")}/>
                    <Input id="next-release" label="Next release date" type="date"/>
                    <Input id="release-frequency" label="Release frequency" />

                    <h2>Notices</h2>
                    <p>Add an alert, correction, change summary or usage note.</p>
                    <a>Add a notice</a>
                    
                    <h2 className="margin-top--1">About</h2>
                    <Input id="dataset-summary" label="Summary" type="textarea" />

                    <h2>Dimensions</h2>
                    <Input id="dimension-title" label="Title"/>
                    <Input id="dimension-description" label="Description" type="textarea" />

                    <br/>
                    <Input id="dimension-title" label="Title"/>
                    <Input id="dimension-description" label="Description" type="textarea" />

                    <h2>Meta</h2>
                    <Input id="keywords" label="Keywords"/>
                    <Input id="licence" label="Licence" />
                    {/* <RadioGroup id="national-statistic" /> */}

                    <h2>Contact details</h2>
                    <Input id="contact-name" label="Contact name" />
                    <Input id="contact-email" label="Contact email" />
                    <Input id="contact-telephone" label="Contact telephone" />

                    <h2>Related link</h2>
                    <a>Add a related link</a>

                    <div className="margin-top--2">
                    <button className="btn btn--primary margin-right--1">Save</button>
                    <button className="btn btn--positive margin-right--1">Save and submit for review</button>
                    <Link to="/preview">Preview</Link>
                    </div>
               </div>
            </div>
        )
    }
}

DatasetMetadataController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        
    }
}
export default connect(mapStateToProps)(DatasetMetadataController);

