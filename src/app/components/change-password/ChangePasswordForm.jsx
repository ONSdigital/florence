import React, { Component } from 'react';
import Input from '../Input'

export default class ChangePasswordForm extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        const inputs = this.props.formData.inputs;

        return (
            <div>
                <div className="modal__header">
                    <h2>Change password</h2>
                </div>
                <form onSubmit={this.props.formData.onSubmit}>
                    <div className="modal__body">
                        {
                            inputs.map((input, index) => {
                                return <Input key={index} {...input} />
                            })
                        }
                    </div>
                    <div className="modal__footer">
                        <button className="btn btn--positive" onClick={this.props.formData.onSubmit}>Update password</button>
                        <button className="btn" onClick={this.props.formData.onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
}
