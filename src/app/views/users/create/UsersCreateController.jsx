import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from '../../../components/Input'
import RadioGroup from '../../../components/radio-buttons/RadioGroup'

import user from '../../../utilities/api-clients/user';
import notifications from '../../../utilities/notifications';

const propTypes = {
    onCreateSuccess: PropTypes.func.isRequired
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

        this.blankNewUserDetails = this.state.newUser;
    }

    handleInputChange = (event) => {
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

    handleUserTypeChange = (event) => {
        const value = event.value;

        const newUserState = {
            ...this.state.newUser,
            type: value
        }

        this.setState({newUser: newUserState});
    }

    handleSubmit = async (event) => {
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

        this.setState({isSubmitting: true})

        const createdUser = await this.createNewUser(this.state.newUser)

        if (createdUser) {
            this.setState({newUser: this.blankNewUserDetails, isSubmitting: false});
            this.props.onCreateSuccess({name: newUser.username.value, email: newUser.email.value});
            return
        }

        this.setState({isSubmitting: false});

    }

    createNewUser = async (newUser) => {
        const newUserDetails = this.mapUserDetailsPostBody(newUser);
        const newUserPassword = this.mapUserPasswordPostBody(newUser);
        const newUserPerrmissions = this.mapUserPermissionPostBody(newUser);
        
        const newUserDetailsResponse = await this.postNewUserDetails(newUserDetails);
        if (newUserDetailsResponse.error) {
            return;
        }

        const newUserPasswordResponse = await this.postNewUserPassword(newUserPassword);
        if (newUserPasswordResponse.error) {
            this.deleteErroredNewUser(newUser.email.value);
            return;
        }

        const newUserPerrmissionsResponse = await this.postNewUserPermissions(newUserPerrmissions);
        if (newUserPerrmissionsResponse.error) {
            this.deleteErroredNewUser(newUser.email.value);
            return
        }

        return true;
    }

    mapUserDetailsPostBody = (user) => {
        return {
            name: user.username.value,
            email: user.email.value
        }
    }

    mapUserPasswordPostBody = (user) => {
        return {
            email: user.email.value,
            password: user.password.value
        }
    }

    mapUserPermissionPostBody = (user) => {
        return {
            email: user.email.value,
            admin: user.type === "admin",
            editor: user.type === "publisher"
        }
    }

    postNewUserDetails = (newUserDetails) => {
        return user.create(newUserDetails).then(response => {
            return {response: response, error: null};
        }).catch(error => {
            switch(error.status) {
                case(403): {
                    const notification = {
                        type: 'warning',
                        message: `You don't have permission to create users.`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: 'warning',
                        message: `No API route available to create users.`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    break;
                }
                case(409): {
                    const notification = {
                        type: 'warning',
                        message: `User "${newUserDetails.name}" already exists.`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    break;
                }
                case("RESPONSE_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An error's occurred whilst trying to create a user.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to create a user.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to create a user.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to create a user.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error posting new user details:\n", error)
            return {response: null, error: error};
        })
    }

    postNewUserPassword = (newUserPassword) => {
        return user.setPassword(newUserPassword).then(response => {
            return {response: response, error: null};
        }).catch(error => {
            switch(error.status) {
                case(403): {
                    const notification = {
                        type: 'warning',
                        message: `You don't have permission to set users' password.`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: 'warning',
                        message: `No API route available to set users' password.`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    break;
                }
                case("RESPONSE_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An error's occurred whilst trying to set users' password.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to set users' password.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to set users' password.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to set users' password.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error posting new user password:\n", error)
            return {response: null, error: error};
        })
    }

    postNewUserPermissions = (newUserPerrmissions) => {
        return user.setPermissions(newUserPerrmissions).then(response => {
            return {response: response, error: null};
        }).catch(error => {
            switch(error.status) {
                case(403): {
                    const notification = {
                        type: 'warning',
                        message: `You don't have permission to set users' permission.`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: 'warning',
                        message: `No API route available to set users' permission.`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    break;
                }
                case("RESPONSE_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An error's occurred whilst trying to set users' permission.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to set users' permission.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to set users' permission.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to set users' permission.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error posting new user permissions:\n", error)
            return {response: null, error: error};
        })
    }

    deleteErroredNewUser = (email) => {
        user.remove(email).then(response => {
            return {response: response, error: null};
        }).catch(error => {
            notifications.add({
                type: "warning",
                message: "An error has occurred, the user has been created but will not work",
                isDismissable: true
            })
            console.error("Error deleting errored user:\n", error)
            return {response: null, error: error};
        })
    }

    render = () => {
        return (
            <div>
                <h1>Create a user</h1>
                <form name="create-new-user" onSubmit={this.handleSubmit}>
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
                        Create user
                    </button>

                    {this.state.isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}

                </form>
            </div>
        );
    }
}

UsersCreateController.propTypes = propTypes;

export default UsersCreateController;