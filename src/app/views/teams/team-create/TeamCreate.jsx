import React, { Component } from 'react';
import PropTypes from 'prop-types';

import teams from '../../../utilities/api-clients/teams';
import notifications from '../../../utilities/notifications';

const propTypes = {
    onCreateSuccess: PropTypes.func.isRequired
}

class TeamCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: {
                value: "",
                error: ""
            },
            isAwaitingResponse: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const isValid = this.validateTeamName();
        if (!isValid) {
            return;
        }

        const newTeamName = (this.state.input.value).trim();
        this.setState({isAwaitingResponse: true});
        teams.add(newTeamName).then(() => {
            const input = Object.assign({}, this.state.input, {
                value: "",
                error: ""
            });
            this.setState({
                input,
                isAwaitingResponse: false
            });
            this.props.onCreateSuccess();
        }).catch(error => {
            this.setState({isAwaitingResponse: false});
            switch(error.status) {
                case(401): {
                    // do nothing - handled by request utility function
                    break;
                }
                case(403): {
                    const input = Object.assign({}, this.state.input, {
                       error: `You don't have permission to create a team`
                    });
                    this.setState({
                        input
                    });
                    break;
                }
                case(409): {
                    const input = Object.assign({}, this.state.input, {
                       error: `Team '${newTeamName}' already exists`
                    });
                    this.setState({
                        input
                    });
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error has occured whilst creating team '${newTeamName}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
        });
    }

    handleFormInput(event) {
        const input = Object.assign({}, this.state.input, {
            value: event.target.value,
            error: ""
        });
        this.setState({input});
    }

    validateTeamName() {
        const teamName = this.state.input.value;
        const updateErrorMsg = (msg) => {
            const input = Object.assign({}, this.state.input, {
                error: msg
            });
            this.setState({input});
        }

        if (!teamName.length) {
            updateErrorMsg("Team name can't be left empty");
            return false;
        }

        if (!(/\S/.test(teamName))) {
            updateErrorMsg("Team name must have a least 1 character that isn't whitespace");
            return false;
        }

        if (teamName.length >= 255) {
            updateErrorMsg("Team name must be less than 255 characters");
            return false;
        }

        return true;
    }

    render() {
        return (
            <form className={`form ${(this.state.input.error ? " form__input--error" : "")}`} onSubmit={this.handleSubmit} name="create-new-team">
                {/* Can't use <Input/> component because we need hidden labels
                 if this becomes a common use case can add to the input component */}
                <div className="form__input">
                    <input type="text" className="input input__text" disabled={this.state.isAwaitingResponse} placeholder="Name" value={this.state.input.value} name="name" onChange={this.handleFormInput}/>
                    {this.state.input.error && 
                        <div className="error-msg">{this.state.input.error}</div>
                    }
                </div>
                <button className="btn btn--positive" disabled={this.state.isAwaitingResponse}>Create</button>
                {this.state.isAwaitingResponse &&
                    <div className="form__loader loader loader--dark"></div>
                }
            </form>
        )
    }
}

TeamCreate.propTypes = propTypes;

export default TeamCreate;