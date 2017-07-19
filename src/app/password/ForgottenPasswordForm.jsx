import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from '../components/Input';

const propTypes = {
    formData: PropTypes.shape({
        inputs: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            type: PropTypes.string,
            onChange: PropTypes.func,
            error: PropTypes.string
        })),
        onSubmit: PropTypes.func,
        isSubmitting: PropTypes.bool
    })
}

export default class ForgottenPasswordForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const inputs = this.props.formData.inputs;
        const isSubmitting = this.props.formData.isSubmitting;

        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-3">
                    <h1>Forgotten password</h1>

                    <form className="form" onSubmit={this.props.formData.onSubmit}>

                        {
                            inputs.map((input, index) => {
                                return <Input key={index} {...input} disabled={isSubmitting}/>
                            })
                        }

                        <button type="submit" className="btn btn--primary margin-top--1" disabled={isSubmitting}>
                            Reset password
                        </button>

                        {isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}
                    </form>
                </div>
            </div>
        )
    }
}

ForgottenPasswordForm.propTypes = propTypes;
