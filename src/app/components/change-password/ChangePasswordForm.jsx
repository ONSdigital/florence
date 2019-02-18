import React, { Component } from 'react';
import Input from '../Input'
import PropTypes from 'prop-types';

const propTypes = {
    formData: PropTypes.shape({
        inputs: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            value: PropTypes.string,
            label: PropTypes.string.isRequired,
            type: PropTypes.string,
            onChange: PropTypes.func,
            error: PropTypes.string
        })),
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        isSubmitting: PropTypes.bool
    }).isRequired
};

export default class ChangePasswordForm extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        const inputs = this.props.formData.inputs || [];
        const isSubmitting = this.props.formData.isSubmitting || false;

        return (
            <div>
                <div className="modal__header">
                    <h2>Change password</h2>
                </div>
                <form onSubmit={this.props.formData.onSubmit}>
                    <div className="modal__body">
                        {
                            inputs.map((input, index) => {
                                return <Input key={index} {...input} disabled={isSubmitting} />
                            })
                        }
                    </div>
                    <div className="modal__footer">
                        <button className="btn btn--positive" type="submit" onClick={this.props.formData.onSubmit} disabled={isSubmitting}>Update password</button>
                        <button className="btn margin-left--1" type="button" onClick={this.props.formData.onCancel} disabled={isSubmitting}>Cancel</button>
                        {isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}
                    </div>
                </form>
            </div>
        )
    }
}

ChangePasswordForm.propTypes = propTypes;
