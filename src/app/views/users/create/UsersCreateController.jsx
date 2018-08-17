import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from '../../../components/Input'
import RadioGroup from '../../../components/radio-buttons/RadioGroup'

const propTypes = {

};

class UsersCreateController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newUser: {
                username: {
                    value: "",
                    error: "",
                },
                email: {
                    value: "",
                    error: ""
                },
                password: {
                    value: "",
                    error: ""
                },
                type: "viewer"
            },
            isSubmitting: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleInputChange(event) {
        const propertyName = event.target.id;
        const value = event.target.value

        const newPropertyState = {
            value: value,
            error: ""
        }

        const newUserState = {
            ...this.state.newUser,
            [propertyName]: newPropertyState
        }

        this.setState({newUser: newUserState});
    }

    handleUserTypeChange(event) {
        const value = event.value;

        const newUserState = {
            ...this.state.newUser,
            type: value
        }

        this.setState({newUser: newUserState});
    }

    handleSubmit(event) {
        event.preventDefault();
        const newUser = this.state.newUser

        if (!newUser.username.value.length) {
            const usernameState = {
                ...newUser.username,
                error: "You must enter a username"
            }
            const newUserState = {
                ...newUser,
                username: usernameState
            }
            this.setState({newUser: newUserState})
            return;
        }

        if (!newUser.email.value.length) {
            const emailState = {
                ...newUser.email,
                error: "You must enter a email"
            }
            const newUserState = {
                ...newUser,
                email: emailState
            }
            this.setState({newUser: newUserState})
            return;
        }

        if (!newUser.password.value.length) {
            const passwordState = {
                ...newUser.password,
                error: "You must enter a password"
            }
            const newUserState = {
                ...newUser,
                password: passwordState
            }
            this.setState({newUser: newUserState})
            return;
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <Input id="username" 
                        label="Username" 
                        type="text"
                        onChange={this.handleInputChange}
                        value={this.state.newUser.username.value}
                        error={this.state.newUser.username.error}
                    />
                    <Input id="email" 
                        label="Email" 
                        type="email"
                        onChange={this.handleInputChange}
                        value={this.state.newUser.email.value}
                        error={this.state.newUser.email.error}
                    />
                    <Input id="password" 
                        label="Password" 
                        type="password"
                        onChange={this.handleInputChange}
                        value={this.state.newUser.password.value}
                        error={this.state.newUser.password.error}
                    />
                    <RadioGroup 
                        radioData={[
                            {id: "admin", value: "admin", label: "Admin"},
                            {id: "publisher", value: "publisher", label: "Publisher"},
                            {id: "viewer", value: "viewer", label: "Viewer"}, 
                        ]}
                        groupName="user-type"
                        legend="User type"
                        onChange={this.handleUserTypeChange}
                        selectedValue={this.state.newUser.type}
                        inline={true}
                    />

                    <button type="submit" className="btn btn--positive margin-top--1" disabled={this.state.isSubmitting}>
                        Create User
                    </button>

                    {this.state.isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}

                </form>
            </div>
        );
    }
}

UsersCreateController.propTypes = propTypes;

export default UsersCreateController;