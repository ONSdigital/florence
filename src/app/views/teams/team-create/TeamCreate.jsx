import React, { Component } from 'react';
import PropTypes from 'prop-types';

import teams from '../../../utilities/api-clients/teams';
import notifications from '../../../utilities/notifications';
import Input from '../../../components/Input';

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
        this.handleFormBlur = this.handleFormBlur.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const isValid = this.validateTeamName();
        if (!isValid) {
            return;
        }

        const newTeamName = (this.state.input.value).trim();
        this.setState({
            isAwaitingResponse: true,
            input: {
                ...this.state.input,
                value: newTeamName
            }
        });
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

    handleFormBlur(event) {
        const input = {
            ...this.state.input,
            value: event.target.value.trim()
        };
        this.setState({input});
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
                {/* 
                TODO: Swap this out for the Input component - we need the input to be controlled (but the Input component is currently uncontrolled) 
                so that we can control it from this component when we need to clear it after submit. This relies on the collections screen refactoring to be merged in 
                */}
                <div className="form__input">
                    <label htmlFor="team-name">Team name</label>
                    <input 
                        type="text" 
                        id="team-name" 
                        className="input input__text" 
                        disabled={this.state.isAwaitingResponse} 
                        value={this.state.input.value} 
                        onChange={this.handleFormInput}
                        onBlur={this.handleFormBlur} 
                    />
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