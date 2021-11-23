import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {push} from "react-router-redux";
import {Link} from "react-router";
import url from "../../utilities/url";
import UsersNotInTeam from "../../components/users/UsersNotInTeam";
import ContentActionBar from "../../components/content-action-bar/ContentActionBar";
import Input from "../../components/Input";
import users from "../../utilities/api-clients/user";
import Chip from "../../components/chip/Chip";
import {addAllUsers, addAllUsersNotInTeam} from "../../config/actions";
import PropTypes from "prop-types";

const propTypes = {
    rootPath: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.object),
    isAuthenticated: PropTypes.bool.isRequired
}

const CreateTeam = props => {
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [filteredUsersNotInTeam, setFilteredUsersNotInTeam] = useState([]);
    const [viewers, setViewers] = useState([]);
    const [usersInTeam, setUsersInTeam] = useState([]);
    // TODO on 'edit a preview team' screen populate teamName via API call (check for URL parameter)
    let teamNameOnLoad = "";

    useEffect(() => {
        console.log("useEffect called")
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
    }

    const setUsers = (results) => {
        if (results != null && results.users != null && results.users.length > 0) {
            results = results.users;
            props.dispatch(addAllUsers(results));
            props.dispatch(addAllUsersNotInTeam(results));
        }
    }

    const handleTeamNameChange = event => {
        if (teamNameOnLoad !== event.target.value) {
            setUnsavedChanges(true);
        }
        setTeamName(event.target.value);
    };

    const requestCreateTeam = () => {
    };

    const handleSearch = event => {
        const searchTerm = event.target.value.toLowerCase();
        setFilteredUsersNotInTeam(viewers.filter(viewer => viewer.title.toLowerCase().search(searchTerm) !== -1 || viewer.desc.toLowerCase().search(searchTerm) !== -1));
    };

    const addUserToTeam = newUser => {
        setFilteredUsersNotInTeam(filteredUsersNotInTeam.filter(filteredUser => filteredUser.desc !== newUser.email));
        setUsersInTeam(usersInTeam => [...usersInTeam, newUser]);
    }

    const submitTeamCreation = () => {
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
            {usersInTeam.map((teamMember, i) => {
                return <Chip key={`teamMember-${i}`} icon="person" style="standard" text={teamMember.title}
                             removeFunc={
                                 // TODO
                                 () => {
                                 }}/>;
            })}
        </div>
    );
    let noTeamMembers = <p> This team has no members</p>;
    let teamNameInputArea = <Input id="team-name-id" label="Name" type="text" onChange={handleTeamNameChange}
                                   error={nameError}/>;

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-4 margin-top--1 margin-bottom--1">
                <div>
                    &#9664; <Link to={url.resolve("../")}>Back</Link>
                </div>
                <h1 className="margin-top--1 margin-bottom--1">Create a preview team</h1>
                {teamNameInputArea}
                <span>Members</span>
                {usersInTeam.length > 0 ? teamsMemberChips : noTeamMembers}
            </div>
            <UsersNotInTeam/>
            <ContentActionBar {...contentActionBarProps} />
        </div>
    );
};

CreateTeam.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        isAuthenticated: state.user.isAuthenticated,
        rootPath: state.state.rootPath,
        users: state.state.users
    };
}

export default connect(mapStateToProps)(CreateTeam);
