import React, { Component } from 'react';

import ChangePasswordForm from './ChangePasswordForm'
import http from '../../utilities/http';

export default class ChangePasswordController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            newPassword: {
                value: "",
                errorMsg: ""
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const id = event.target.id;
        const value = event.target.value;

        switch(id) {
            case ("new-password") : {
                this.setState({
                    newPassword: {
                        value: value,
                        errorMsg: ""
                    }
                });
                break;
            }
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const newPassword = this.state.newPassword.value;

        console.log(newPassword.length);

        if (!newPassword.match(/.+\s.+\s.+\s.+/)) {
            const newPassword = Object.assign({}, this.state.newPassword, {errorMsg: "Passphrases must contain 4 words, separated by spaces"});
            this.setState({
                newPassword: newPassword
            });

            return;
        }

        if (!newPassword.length > 15 ) {
            const newPassword = Object.assign({}, this.state.newPassword, {errorMsg: "Passphrases must contain at least 15 characters"});

            this.setState({
                newPassword: newPassword
            });

            return;
        }

        const postBody = {
            password: this.state.newPassword.value,
            email: this.props.email,
            oldPassword: this.props.currentPassword
        };

        this.postNewPassword(postBody).then(result => {
            this.props.handleSuccess(this.state.newPassword.value);
        }).catch(error => {
            console.error(error);
        });

    }

    postNewPassword(body) {
        return http.post('/zebedee/password', body);

    }

    render() {
        const formData = {
            inputs: [
                {
                    id: "new-password",
                    label: "New Password",
                    type: "password",
                    onChange: this.handleInputChange,
                    error: this.state.newPassword.errorMsg
                }
            ],
            onSubmit: this.handleSubmit,
            onCancel: this.props.handleCancel
        };
        return (
            <ChangePasswordForm formData={formData} />
        )
    }

}