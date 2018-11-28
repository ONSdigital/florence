import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../components/Modal'
import Input from '../../../../components/Input'
import Checkbox from '../../../../components/Checkbox'

const propTypes = {
    date: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
        errorMsg: PropTypes.string
    }).isRequired,
    description: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
        errorMsg: PropTypes.string
    }).isRequired,
    isCorrection: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        value: PropTypes.bool
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isEditing: PropTypes.bool
};

class AlertView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal sizeClass="grid__col-lg-5 grid__col-md-8 grid__col-xs-10">
                <form onSubmit={this.props.onSave}>
                    <div className="modal__header">
                        <h2>{this.props.isEditing ? "Edit" : "Add"} alert</h2>
                    </div>
                    <div className="modal__body">
                        <div className="grid__col-md-5 grid__col-sm-6 grid__col-sm-8">
                            <Input 
                                id="alert-date" 
                                type="datetime-local"
                                value={this.props.date.value}
                                error={this.props.date.errorMsg}
                                label="Date"
                                onChange={this.props.date.onChange}
                            />
                        </div>
                        <Input
                            type="textarea"
                            id="alert-description"
                            value={this.props.description.value}
                            error={this.props.description.errorMsg}
                            label="Description"
                            onChange={this.props.description.onChange}
                        />
                        <Checkbox 
                            id="alert-is-correction"
                            onChange={this.props.isCorrection.onChange}
                            isChecked={this.props.isCorrection.value}
                            label="Correction"
                        />
                    </div>
                    <div className="modal__footer">
                        <button className="btn btn--primary" type="submit">Save</button>
                        <button className="btn margin-left--1" type="button" onClick={this.props.onCancel}>Cancel</button>
                    </div>
                </form>
            </Modal>
        )
    }
}

AlertView.propTypes = propTypes;

export default AlertView;