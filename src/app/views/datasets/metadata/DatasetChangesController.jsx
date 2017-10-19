import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import PropTypes from 'prop-types';
import isEmptyObject from 'is-empty-object';

import datasets from '../../../utilities/api-clients/datasets'
import {updateActiveInstance} from '../../../config/actions'
import url from '../../../utilities/url'
import DatasetChangesModal from './DatasetChangesModal'


const propTypes = {
    params: PropTypes.shape({
        instance: PropTypes.string.isRequired
    }).isRequired,
    instance: PropTypes.shape({
        alerts: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string
        })),
        summaries: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string
        }))
    }),
    dispatch: PropTypes.func.isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string
    })).isRequired
}

class DatasetChangesController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingInstance: false,
            isEditingAlert: false,
            isEditingSummary: false,
            activeAlert: null,
            activeSummary: null
        };

        this.handleAlertAdd = this.handleAlertAdd.bind(this);
        this.handleAlertEdit = this.handleAlertEdit.bind(this);
        this.handleAlertDelete = this.handleAlertDelete.bind(this);
        this.handleAlertEditCancel = this.handleAlertEditCancel.bind(this);
        this.handleAlertSave = this.handleAlertSave.bind(this);
        
        this.handleSummaryAdd = this.handleSummaryAdd.bind(this);
        this.handleSummaryEdit = this.handleSummaryEdit.bind(this);
        this.handleSummaryDelete = this.handleSummaryDelete.bind(this);
        this.handleSummaryEditCancel = this.handleSummaryEditCancel.bind(this);
        this.handleSummarySave = this.handleSummarySave.bind(this);
        
        this.handleMainSave = this.handleMainSave.bind(this);
    }

    componentWillMount() {
        if (isEmptyObject(this.props.instance)) {
            this.setState({isFetchingInstance: true});
            datasets.getInstance(this.props.params.instance).then(instance => {
                this.props.dispatch(updateActiveInstance(instance));
                this.setState({isFetchingInstance: false});
            });
        }
    }

    handleAlertAdd(event) {
        event.preventDefault();
        this.setState({isEditingAlert: true});
    }
    
    handleSummaryAdd(event) {
        event.preventDefault();
        this.setState({isEditingSummary: true});
    }

    handleAlertEdit(alert, index) {
        event.preventDefault();
        alert.index = index;
        this.setState({
            isEditingAlert: true,
            activeAlert:  alert
        });
    }
    
    handleSummaryEdit(summary, index) {
        event.preventDefault();
        summary.index = index;
        this.setState({
            isEditingSummary: true,
            activeSummary:  summary
        });
    }

    handleAlertDelete(alertIndex) {
        const updatedAlerts = [...this.props.instance.alerts];
        updatedAlerts.splice(alertIndex, 1);
        const updatedInstance = {
            ...this.props.instance,
            alerts: updatedAlerts
        }
        this.props.dispatch(updateActiveInstance(updatedInstance));
    }
    
    handleSummaryDelete(summaryIndex) {
        const updatedSummary = [...this.props.instance.summaries];
        updatedSummary.splice(summaryIndex, 1);
        const updatedInstance = {
            ...this.props.instance,
            summaries: updatedSummary
        }
        this.props.dispatch(updateActiveInstance(updatedInstance));
    }

    handleAlertEditCancel(event) {
        event.preventDefault();
        this.setState({
            isEditingAlert: false,
            activeAlert: null
        });
    }
    
    handleSummaryEditCancel(event) {
        event.preventDefault();
        this.setState({
            isEditingSummary: false,
            activeSummary: null
        });
    }

    handleAlertSave(updatedAlert, alertIndex) {
        let updatedAlerts;
        if (!alertIndex) {
            updatedAlerts = [
                ...this.props.instance.alerts,
                updatedAlert
            ]
        } else {
            updatedAlerts = this.props.instance.alerts.map((alert, index) => {
                if (alertIndex-1 === index) {
                    return {...updatedAlert}
                }
                return alert;
            });
        }
        
        const updatedInstance = {
            ...this.props.instance,
            alerts: updatedAlerts
        }

        // TODO we should have an action just for updating the instance's alerts
        this.props.dispatch(updateActiveInstance(updatedInstance));
        this.setState({
            isEditingAlert: false,
            activeAlert: null
        });
    }

    handleMainSave(event) {
        event.preventDefault();
        this.props.dispatch(push(url.resolve(`../../add-to-collection/${this.props.params.instance}`)));
    }
    
    handleSummarySave(updatedSummary, summaryIndex) {
        let updatedSummaries;
        if (!summaryIndex) {
            updatedSummaries = [
                ...this.props.instance.alerts,
                updatedSummary
            ]
        } else {
            updatedSummaries = this.props.instance.alerts.map((alert, index) => {
                if (summaryIndex-1 === index) {
                    return {...updatedSummary}
                }
                return alert;
            });
        }
        
        const updatedInstance = {
            ...this.props.instance,
            summaries: updatedSummaries
        }

        // TODO we should have an action just for updating the instance's summaries
        this.props.dispatch(updateActiveInstance(updatedInstance));
        this.setState({
            isEditingSummary: false,
            activeSummary: null
        });
    }

    renderAlertItem(alert, index) {
        const triggerAlertEditHandler = event => {
            event.preventDefault();
            this.handleAlertEdit(alert, index+1);
        }
        const triggerAlertDeleteHandler = event => {
            event.preventDefault();
            this.handleAlertDelete(index);
        }
        return (
            <li key={index} className="card margin-bottom--1">
                <div className="card__body">
                    <div className="card__title">{alert.title}</div>
                    {alert.description}
                </div>
                <div className="card__actions">
                    <a href="" onClick={triggerAlertEditHandler}>Edit</a>
                    <a className="margin-left--1" href="" onClick={triggerAlertDeleteHandler}>Delete</a>
                </div>
            </li>
        )
    }

    renderAlerts() {
        return (
            <div className="margin-bottom--2">
                <h2 className="margin-bottom--1">Alerts and corrections</h2>
                {this.props.instance.alerts.length > 0 ?
                    <ul className="list--neutral margin-bottom--1">
                        {this.props.instance.alerts.map((alert, index) => {
                            return this.renderAlertItem(alert, index);
                        })}
                    </ul>
                :
                    <p className="margin-bottom--1">No alerts to display</p>
                }
                <a href="" onClick={this.handleAlertAdd}>Add an alert</a>
            </div>
        )
    }

    renderSummaryItem(summary, index) {
        const triggerSummaryEditHandler = event => {
            event.preventDefault();
            this.handleSummaryEdit(summary, index+1);
        }
        const triggerSummaryDeleteHandler = event => {
            event.preventDefault();
            this.handleSummaryDelete(index);
        }
        return (
            <li key={index} className="card margin-bottom--1">
                <div className="card__body">
                    <div className="card__title">{summary.title}</div>
                    {summary.description}
                </div>
                <div className="card__actions">
                    <a href="" onClick={triggerSummaryEditHandler}>Edit</a>
                    <a className="margin-left--1" href="" onClick={triggerSummaryDeleteHandler}>Delete</a>
                </div>
            </li>
        )
    }

    renderSummaries() {
        return (
            <div className="margin-bottom--2">
                <h2>Summary of changes</h2>
                {this.props.instance.summaries.length > 0 ?
                    <ul className="list--neutral margin-bottom--1">
                        {this.props.instance.summaries.map((summary, index) => {
                            return this.renderSummaryItem(summary, index);
                        })}
                    </ul>
                :
                    <p className="margin-bottom--1">No summaries to display</p>
                }
                <a href="" onClick={this.handleSummaryAdd}>Add a summary</a>
            </div>
        )
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
                        {this.state.isFetchingInstance ?
                            <div className="loader loader--dark"></div>
                        :
                            <div className="margin-bottom--1">
                                {this.renderAlerts()}
                                {this.renderSummaries()}
                            </div>
                        }
                        <form onSubmit={this.handleMainSave}>
                            <button className="btn btn--positive">Save and continue</button>
                        </form>
                    </div>
                </div>
                {this.state.isEditingAlert &&
                    <DatasetChangesModal
                        onSave={this.handleAlertSave}
                        title={this.state.activeAlert ? this.state.activeAlert.title : ""}
                        description={this.state.activeAlert ? this.state.activeAlert.description : ""}
                        id={this.state.activeAlert ? this.state.activeAlert.index : null}
                        onCancel={this.handleAlertEditCancel}
                        instanceID={this.props.params.instance}
                    />
                }
                {this.state.isEditingSummary &&
                    <DatasetChangesModal 
                        onSave={this.handleSummarySave}
                        title={this.state.activeSummary ? this.state.activeSummary.title : ""}
                        description={this.state.activeSummary ? this.state.activeSummary.description : ""}
                        id={this.state.activeSummary ? this.state.activeSummary.index : null}
                        onCancel={this.handleSummaryEditCancel}
                        instanceID={this.props.params.instance}
                    />
                }
            </div>
        )
    }
}

DatasetChangesController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        instance: state.state.datasets.activeInstance
    }
}

export default connect(mapStateToProps)(DatasetChangesController);