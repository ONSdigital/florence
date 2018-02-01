import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Input from '../../../../components/Input';

const propTypes = {
    dateInput: PropTypes.string,
    descriptionInput: PropTypes.string,
    isPosting: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onFormInput: PropTypes.func.isRequired,
    dateError: PropTypes.string,
    descriptionError: PropTypes.string
}

class AlertsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateInput: "",
            descriptionInput: ""
        }
    }

    componentWillMount() {
        if (this.props.dateInput || this.props.descriptionInput) {
            this.setState({
                dateInput: this.props.dateInput,
                descriptionInput: this.props.descriptionInput
            });
        }
    }

    render() {
        return (
            <form className="form" onSubmit={this.props.onFormSubmit}>
                <div className="modal__header">
                    <h2> Add an alert: </h2>
                </div>
                <div className="modal__body">
                      <Input
                            type="text"
                            label="Date (e.g 01 September 2017)"
                            id="add-alert-date"
                            name="add-alert-date"
                            error={this.props.dateError}
                            onChange={this.props.onFormInput}
                            onCancel={this.props.onCancel}
                            isFocused={true}
                            value={this.props.dateInput}
                        />
                        <Input
                            type="text"
                            label="Alert Description"
                            error={this.props.descriptionError}
                            id="add-alert-description"
                            name="add-alert-description"
                            value={this.props.descriptionInput}
                            onChange={this.props.onFormInput}
                            onCancel={this.props.onCancel}
                        />
                    </div>
                    <div className="modal__footer">
                    <button disabled={this.props.isPosting} className={"btn btn--primary btn--margin-right"}>Add</button>
                    <button type="button" disabled={this.props.isPosting} className="btn" onClick={this.props.onCancel}>Cancel</button>
                    {this.props.isPosting &&
                        <div className="loader"></div>
                    }
                </div>
            </form>
        )
    }

}

AlertsForm.propTypes = propTypes;

export default AlertsForm;