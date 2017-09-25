import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Modal from '../../../components/Modal';
import RelatedDataController from './related-content/RelatedDataController';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

class DatasetRelated extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            relatedTitles: [],
            relatedURLs: [],
            titleInput: {
                value: "",
                error: ""
            },
            urlInput: {
                value: "",
                error: ""
            },
        };

        this.handleAddRelatedClick = this.handleAddRelatedClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleAddRelatedClick() {
        this.setState({showModal: true});
    }

    handleCancel() {
        this.setState({showModal: false});
    }

    handleFormInput(event) {
        const input = Object.assign({}, this.state.input, {
               value: event.target.value,
               error: ""
            });
        if (event.target.name === "add-related-content-title") {
            this.setState({titleInput: input});
        } else if (event.target.name === "add-related-content-url") {
            this.setState({urlInput: input});
        }
    }

    handleFormSubmit(event) {
        event.preventDefault()

        var titles = this.state.relatedTitles.concat(this.state.titleInput.value);
        this.setState({relatedTitles: titles});

        var urls = this.state.relatedURLs.concat(this.state.urlInput.value);
        this.setState({relatedURLs: urls});

        this.setState({showModal: false});       
    }

    render() {

        console.log("related titles on render: " + this.state.relatedTitles)
        
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <h1></h1>
                    <div className="margin-bottom--1">
                            &#9664; <Link to={``}>Back</Link>
                    </div>
                    <h2 className="margin-bottom--1">Related content</h2>
                    <div className="margin-bottom--1">
                        <p> These are common across all editions of the dataset. Changing them will affect all previous editions.</p>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Bulletins, articles and compendia </h3>
                        {
                            this.state.relatedTitles.map((title) => {
                                return (<p>Title: {title}</p>)
                            })                            
                        }
                        <a href="#" onClick={this.handleAddRelatedClick}> Add document </a>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> QMIs </h3>
                        <a href="#"> Add QMI </a>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Methodology </h3>
                        <a href="#"> Add methodology </a>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Other related topics </h3>
                        <a href="#"> Add related topic </a>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Related links </h3>
                        <a href="#"> Add related link </a>
                    </div>
                    <div className="grid__col-4">
                        <button className="btn btn--positive" type="submit">Save and Continue</button>
                    </div>
                </div>
                {   
                    this.state.showModal ?             
                    <Modal sizeClass="grid__col-3">
                        <RelatedDataController 
                            name="related-content-modal"
                            onCancel={this.handleCancel}
                            onFormInput={this.handleFormInput}
                            onFormSubmit={this.handleFormSubmit}
                        />
                    </Modal>
                    :
                    ""
                }
            </div>
        )
    }
}

DatasetRelated.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetRelated);