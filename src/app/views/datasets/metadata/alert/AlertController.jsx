import React, { Component } from 'react';
import PropTypes from 'prop-types';
import date from '../../../../utilities/date'
import AlertView from './AlertView'
import uuid from 'uuid/v4';

const propTypes = {
    date: PropTypes.string,
    description: PropTypes.string,
    isCorrection: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    id: PropTypes.string
};

class AlertController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: "",
            newDate: {
                value: "",
                errorMsg: ""
            },
            newDescription: {
                value: "",
                errorMsg: ""
            },
            newID: "",
            newIsCorrectionBoolean: null,
        };

        this.maximumAlertDate = date.format(date.addYear(10), "yyyy-mm-dd");

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleIsCorrectionChange = this.handleIsCorrectionChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentWillMount() {
        if (!this.props.id) {
            this.setState({newID: uuid()});
        }

        if (this.props.date) {
            this.setState({
                currentDate: this.formatDateToInput(new Date(this.props.date))
            });
            return;
        }

        this.setState({
            currentDate: this.formatDateToInput(new Date())
        });
    }

    formatDateToInput(dateObject) {
        return date.format(dateObject.toISOString(), "yyyy-mm-dd'T'HH:MM");
    }

    handleDateChange(event) {
        this.setState({
            newDate: {
                value: event.target.value || "",
                errorMsg: ""
            },
            currentDate: ""
        });
    }

    handleDescriptionChange(event) {
        this.setState({
            newDescription: {
                value: event.target.value || "",
                errorMsg: "",
            }
        });
    }
    
    handleIsCorrectionChange(isCorrection) {
        this.setState({newIsCorrectionBoolean: isCorrection});
    }
    
    handleSave(event) {
        event.preventDefault();
        let hasError = false;
        let newState = {};

        if (!this.state.newDate.value && !this.state.currentDate) {
            newState = {
                ...newState,
                newDate: {
                    ...this.state.newDate,
                    errorMsg: "A date and time must be chosen",
                }
            };
            hasError = true;
        }

        if (!this.state.newDescription.value && !this.props.description) {
            newState = {
                ...newState,
                newDescription: {
                    ...this.state.newDescription,
                    errorMsg: "An alert must have a description",
                }
            };
            hasError = true;
        }

        if (hasError) {
            this.setState(newState);
            return;
        }

        let isCorrection = this.props.isCorrection || false;

        if (this.state.newIsCorrectionBoolean !== null) {
            isCorrection = this.state.newIsCorrectionBoolean
        }

        const alert = {
            description: this.state.newDescription.value || this.props.description || "",
            date: new Date(this.state.newDate.value || this.state.currentDate).toISOString(),
            isCorrection,
            id: this.props.id || this.state.newID
        }
        this.props.onSave(alert);
    }

    render() {
        return (
            <AlertView
                date={{
                    value: this.state.newDate.value || this.state.currentDate,
                    errorMsg: this.state.newDate.errorMsg,
                    onChange: this.handleDateChange
                }}
                description={{
                    value: this.state.newDescription.value || this.props.description,
                    errorMsg: this.state.newDescription.errorMsg,
                    onChange: this.handleDescriptionChange
                }}
                isCorrection={{
                    value: this.state.newIsCorrectionBoolean || this.props.isCorrection,
                    onChange: this.handleIsCorrectionChange
                }}
                onSave={this.handleSave}
                onCancel={this.props.onCancel}
                isEditing={(Boolean(this.props.date) || Boolean(this.props.description))}
            />
        )
    }
}

AlertController.propTypes = propTypes;

export default AlertController;