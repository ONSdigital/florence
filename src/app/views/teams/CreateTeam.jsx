import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Link } from "react-router";
import url from "../../utilities/url";
import UsersNotInTeam from "../../components/users/UsersNotInTeam";
import ContentActionBar from "../../components/content-action-bar/ContentActionBar";
import Input from "../../components/Input";
import users from "../../utilities/api-clients/user";
import Chip from "../../components/chip/Chip";
import { addAllUsers, addAllUsersNotInTeam, addUserToTeam, removeUserFromTeam } from "../../config/actions";
import PropTypes from "prop-types";

const propTypes = {
    rootPath: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.object),
    isAuthenticated: PropTypes.bool.isRequired,
};

const CreateTeam = props => {
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [teamName, setTeamName] = useState("");
    // TODO on 'edit a preview team' screen populate teamName via API call (check for URL parameter)
    let teamNameOnLoad = "";

    useEffect(() => {
        // TODO add access check
        // if (!(isAdmin || isPublisher) && !props.params.userID) {
        //     props.dispatch(replace(`${props.rootPath}/users/${props.loggedInUser.email}`));
        // }
        // TODO add loading spinner on list until populated
        getAllUsers();
    }, []);

    const getAllUsers = () => {
        users
            .getAllActive()
            .then(results => {
                setUsers(results);
            })
            .catch(error => {
                // TODO log properly
                console.log("ERROR");
                console.error(error);
            });
    };

    const setUsers = results => {
        if (results != null && results.users != null && results.users.length > 0) {
            results = results.users;
            props.dispatch(addAllUsers(results));
            props.dispatch(addAllUsersNotInTeam(results));
        }
    };

    const handleTeamNameChange = event => {
        if (teamNameOnLoad !== event.target.value) {
            setUnsavedChanges(true);
        }
        setTeamName(event.target.value);
    };

    const requestCreateTeam = () => {};

    const submitTeamCreation = () => {};

    const compare = (a, b) => {
        return `${a.forename} ${a.surname}` > `${b.forename} ${b.surname}` ? 1 : `${b.forename} ${b.surname}` > `${a.forename} ${a.surname}` ? -1 : 0;
    };

    let nameError;
    let contentActionBarProps = {
        buttons: [
            {
                id: "create-team-btn",
                text: "Create Team",
                interactionCallback: requestCreateTeam,
                style: "positive",
                disabled: false,
            },
        ],
        cancelCallback: () => {
            const previousUrl = url.resolve("../", true);
            props.dispatch(push(previousUrl));
        },
        stickToBottom: true,
        unsavedChanges: unsavedChanges,
    };
    let teamsMemberChips = (
        <div>
            {props.usersInTeam
                .map((teamMember, i) => {
                    return (
                        <Chip
                            key={`teamMember-${i}`}
                            icon="person"
                            style="standard"
                            text={`${teamMember.forename} ${teamMember.surname}`}
                            removeFunc={
                                // TODO
                                () => {
                                    let userToRemove = props.users.find(viewer => viewer.email === teamMember.email);
                                    props.dispatch(removeUserFromTeam(userToRemove));
                                }
                            }
                        />
                    );
                })
                .sort(compare)}
        </div>
    );
    let noTeamMembers = <p> This team has no members</p>;
    let teamNameInputArea = <Input id="team-name-id" label="Name" type="text" onChange={handleTeamNameChange} error={nameError} />;

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-4 margin-top--1 margin-bottom--1">
                <div>
                    &#9664; <Link to={url.resolve("../")}>Back</Link>
                </div>
                <h1 className="margin-top--1 margin-bottom--1">Create a preview team</h1>
                {teamNameInputArea}
                <span>Members</span>
                {props.usersInTeam.length > 0 ? teamsMemberChips : noTeamMembers}
            </div>
            <UsersNotInTeam />
            <ContentActionBar {...contentActionBarProps} />
        </div>
    );
};

CreateTeam.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        //TODO can I just import users
        isAuthenticated: state.user.isAuthenticated,
        rootPath: state.state.rootPath,
        users: state.state.users.all,
        usersInTeam: state.state.users.inTeam,
    };
}

export default connect(mapStateToProps)(CreateTeam);
