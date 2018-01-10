import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import SelectedItemList from '../../../components/selected-items/SelectedItemList';

const propTypes = {
    name: PropTypes.string,
    nameErrorMsg: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired,
    onRemoveTeam: PropTypes.func.isRequired,
    onTeamSelect: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    type: PropTypes.string,
    publishDate: PropTypes.string,
    teams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })),
    allTeams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })),
    isFetchingAllTeams: PropTypes.bool
};

class CollectionEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            teams: this.props.teams
        }

        this.handleTeamSelection = this.handleTeamSelection.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleTeamSelection(event) {
        this.props.onTeamSelect(event.target.value);
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        });
        this.props.onNameChange(event.target.value);
    }

    handleSave(event) {
        event.preventDefault();
        this.props.onSave(this.state);
    }

    renderPublishDate() {
        if (!this.props.type) {
            return;
        }

        if (this.props.type === "manual") {
            return <p>Manual publish</p>
        }

        if (this.props.type === "scheduled" && this.props.publishDate) {
            return (
                <p>Publish date: {this.props.publishDate}</p>
            )
        }

        if (this.props.type === "scheduled" && !this.props.publishDate) {
            return (
                <p>Publishing date: no publish date available</p>
            )
        }
    }

    render () {
        return (
            <div className="drawer__container">
                <div className="drawer__heading">
                    <div className="grid grid--justify-space-between grid--align-end">
                        <div>
                            <h2>{this.props.name}</h2>
                            {this.renderPublishDate()}
                        </div>
                        <p>Editing collection...</p>
                    </div>
                </div>
                <div className="drawer__body">
                    <form onSubmit={this.handleSave}>
                        <Input
                            id="collection-edit-name"
                            label="Name"
                            value={this.state.name}
                            error={this.props.nameErrorMsg}
                            onChange={this.handleNameChange}
                        />
                        <Select
                            id="collection-edit-teams"
                            label="Select a team(s) that can view this collection"
                            contents={this.props.allTeams}
                            defaultOption={this.props.isFetchingAllTeams ? "Loading teams..." : "Select an option"}
                            onChange={this.handleTeamSelection}
                        />
                        <SelectedItemList items={this.props.teams} onRemoveItem={this.props.onRemoveTeam}/>
                    </form>
                </div>
                <div className="drawer__footer">
                    <button className="btn" type="button" onClick={this.props.onCancel}>Cancel</button>
                    <button className="btn btn--positive btn--margin-left" type="button" onClick={this.handleSave}>Save and return</button>
                </div>
            </div>
        )
    }
}

CollectionEdit.propTypes = propTypes;

export default CollectionEdit;