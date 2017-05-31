import React, { Component } from 'react';
import PropTypes from 'prop-types';

import teams from '../../utilities/teams';

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
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
    }

    handleSubmit(event) {
        const newTeamName = this.state.input.value;
        event.preventDefault();

        teams.add(newTeamName).then(() => {
            const input = Object.assign({}, this.state.input, {
                value: ""
            });
            this.setState({input});
            this.props.onCreateSuccess();
        }).catch(error => {
            console.error(`Error whilst adding team '${newTeamName}'`, error);
        });
    }

    handleFormInput(event) {
        const input = Object.assign({}, this.state.input, {
            value: event.target.value
        });
        this.setState({input});
    }

    render() {
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                {/* Can't use <Input/> component because we need hidden labels
                 if this becomes a common use case can add to the input component */}
                <div className="form__input">
                    <input type="text" className="input input__text" placeholder="Name" value={this.state.input.value} onChange={this.handleFormInput}/>
                </div>
                <button className="btn btn--positive">Create</button>
            </form>
        )
    }
}

TeamCreate.propTypes = propTypes;

export default TeamCreate;