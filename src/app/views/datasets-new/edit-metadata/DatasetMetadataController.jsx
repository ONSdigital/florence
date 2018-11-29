import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import datasets from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';
import url from '../../../utilities/url'

import Input from '../../../components/Input';


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
                <div className="grid__col-6">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Edit metadata</h1>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Dataset</span>: {this.state.dataset.title ? this.state.dataset.title : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Edition</span>: {this.state.edition.title ? this.state.edition.title : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Version</span>: {this.state.version.title ? this.state.version.title : "loading..."}</p>

                    <h2>Title</h2>
                    <Input id="title" />
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

