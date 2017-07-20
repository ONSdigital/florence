import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';
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

export default class LoginForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const inputs = this.props.formData.inputs;
        const isSubmitting = this.props.formData.isSubmitting;

        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-3">
                    <h1>Login</h1>

                    <form className="form" onSubmit={this.props.formData.onSubmit}>

                        {
                            inputs.map((input, index) => {
                                return <Input key={index} {...input} disabled={isSubmitting}/>
                            })
                        }

                        <button type="submit" className="btn btn--primary btn--margin-bottom" disabled={isSubmitting}>
                            Log in
                        </button>

                        {isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}

                        <br/>

                        <Link className="link inline-block" to={`${this.props.rootPath}/forgotten-password`}>I've forgotten my password</Link>

                    </form>
                </div>
            </div>
        )
    }
}

LoginForm.propTypes = propTypes;
