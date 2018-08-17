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

    }

    handleInputChange(event) {
        const propertyName = event.target.id;
        const value = event.target.value

        const newPropertyState = {
            ...this.state.newUser[propertyName],
            value: value
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

    render() {
        return (
            <div>
                <form onSubmit={function(e){e.preventDefault(); console.log("submitted")}}>
                    <Input id="username" 
                        label="Username" 
                        type="text"
                        onChange={this.handleInputChange}
                        value={this.state.newUser.username.value}
                        error={this.state.newUser.username.error}
                    />
                    <Input id="email" 
                        label="Email" 
                        type="text"
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

                    <button type="submit" className="btn btn--positive margin-top--1" disabled={this.props.isSubmitting}>
                        Create User
                    </button>

                    {this.props.isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}

                </form>
            </div>
        );
    }
}

UsersCreateController.propTypes = propTypes;

export default UsersCreateController;