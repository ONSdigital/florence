import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from '../components/Input';

LoginForm.propTypes = {
    formData: PropTypes.shape({
        inputs: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            type: PropTypes.string,
            onChange: PropTypes.func,
            error: PropTypes.string
        })),
        onSubmit: PropTypes.func
    })
}

export default class LoginForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const inputs = this.props.formData.inputs;

        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-3">
                    <h1>Login</h1>

                    <form className="form" onSubmit={this.props.formData.onSubmit}>

                        {
                            inputs.map((input, index) => {
                                return <Input key={index} {...input} />
                            })
                        }

                        <button type="submit" className="btn btn--primary margin-top--1">Log in</button>
                    </form>
                </div>
            </div>
        )
    }
}
