import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import datasets from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';
import url from '../../../utilities/url'

import Input from '../../../components/Input';
import RadioGroup from '../../../components/radio-buttons/RadioGroup';


const propTypes = {

}

export class DatasetMetadataController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataset: {},
            edition: {},
            version: {}
        }

    }

    componentWillMount() {
        
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
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Dataset</span>: {this.state.dataset.title ? this.state.dataset.title : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Edition</span>: {this.state.edition.title ? this.state.edition.title : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Version</span>: {this.state.version.title ? this.state.version.title : "loading..."}</p>

                    <h2>Title</h2>
                    <Input id="title" />

                    <h2>Release dates</h2>
                    <Input id="release-date" label="Release date" type="date"/>
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

