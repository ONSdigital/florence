import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import datasets from '../../../utilities/api-clients/datasets'
import {updateActiveInstance} from '../../../config/actions'
import url from '../../../utilities/url'
import Modal from '../../../components/Modal'


const propTypes = {
    params: PropTypes.shape({
        instance: PropTypes.string.isRequired
    }).isRequired,
    instance: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string
    })).isRequired
}

class DatasetChanges extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingInstance: false
        }
    }

    componentWillMount() {
        if (!this.props.instance) {
            datasets.getInstance(this.props.params.instance).then(instance => {
                this.props.dispatch(updateActiveInstance(instance));
            });
        }
    }

    render() {
        return (
            <div>
                <div className="grid grid--justify-center">
                    <div className="grid__col-4">
                        <div className="margin-top--2">
                            &#9664; <Link to={`${url.resolve("edition")}`}>Back</Link>
                        </div>
                        <h1 className="margin-top--1">This version's metadata</h1>
                        <p className="margin-bottom--2">
                            This information can change each time a new edition is published. <Link to={`${url.resolve("history")}`}>View history</Link>
                        </p>
                        {this.props.instance ?
                            <div>
                                <div className="margin-bottom--2">
                                    <h2>Alerts and corrections</h2>
                                    <Link to={`${location.pathname}/add-alert`}>Add an alert</Link>
                                </div>
                                <div className="margin-bottom--2">
                                    <h2>Summary of changes</h2>
                                    <Link className="margin-bottom--2" to={`${location.pathname}/add-change`}>Add change</Link>
                                </div>
                            </div>
                        :
                            <div className="loader loader--dark"></div>
                        }
                    </div>
                </div>
                {this.props.routes[this.props.routes.length-1].path === "add-alert" &&
                    <Modal sizeClass="grid__col-5">
                        <h2 className="modal__header">Add alert</h2>
                        <div className="modal__body">
                            <p>Thing</p>
                        </div>
                        <div className="modal__footer">
                            <button className="btn btn--positive">Add</button>
                            <Link to={`${url.parent()}`}>Cancel</Link>
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}

DatasetChanges.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        instance: state.state.datasets.activeInstance
    }
}

export default connect(mapStateToProps)(DatasetChanges);