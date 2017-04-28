import React, { Component } from 'react';
import Input from '../components/Input'


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
                                let error = this.props.formData.error.inputID === input.id ? this.props.formData.error.message : false;
                                return <Input key={index} {...input} error={error} />
                            })
                        }

                        <button type="submit" className="btn btn--primary margin-top--1">Log in</button>
                    </form>
                </div>
            </div>
        )
    }
}
