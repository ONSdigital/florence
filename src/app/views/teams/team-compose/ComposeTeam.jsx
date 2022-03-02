import React, {useEffect, useMemo, useState} from "react";
import {push} from "react-router-redux";
import {Link} from "react-router";
import url from "../../../utilities/url";
import UsersNotInTeam from "../../../components/users/UsersNotInTeam";
import ContentActionBar from "../../../components/content-action-bar/ContentActionBar";
import Input from "../../../components/Input";
import Chip from "../../../components/chip/Chip";
import PropTypes from "prop-types";
import notifications from "../../../utilities/notifications";
import _ from "lodash";
import Panel from "../../../components/panel/Panel";

const propTypes = {
    dispatch: PropTypes.func,
    allPreviewUsers: PropTypes.arrayOf(PropTypes.object),
    unsavedChanges: PropTypes.bool,
    router: PropTypes.shape({
        setRouteLeaveHook: PropTypes.func,
    }),
    params: PropTypes.shape({
        groupID: PropTypes.string,
    }),
    route: PropTypes.object,
    group: PropTypes.shape({
        details: {
            groupID: PropTypes.string,
            name: PropTypes.string,
        },
        members: PropTypes.arrayOf(PropTypes.object),
    }),
    loadUsers: PropTypes.func,
    loadGroupMembers: PropTypes.func,
    createTeam: PropTypes.func, // TODO change to grouds
    updateTeam: PropTypes.func,
    loadGroup: PropTypes.func,
    deleteGroup : PropTypes.func
};

const ComposeTeam = props => {
    const {dispatch, router, route, allPreviewUsers, params, group, loadUsers, loadGroupMembers, createTeam, updateTeam, loadGroup, deleteGroup} = props;
    // TODO use group.active.isLoading in a useEffect to set initial values for group members and team name instead
    const [teamName, setTeamName] = useState("");
    const [isLoading, setLoading] = useState(true);
    const [usersNotInTeam, setUsersNotInTeam] = useState([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [originalListOfUsersInTeam, setOriginalListOFUsersInTeam] = useState([]);
    const [originalTeamName, setOriginalTeamName] = useState("");
    const isEditMode = params.groupID != null;
    const handleRequestToLeavePage = () => {
        if (unsavedChanges) return "Your work is not saved! Are you sure you want to leave?";
    };
    const usersInTeam = useMemo(() => {
        if (allPreviewUsers == null) {
            return [];
        }
        const listOfUsersInTeam = allPreviewUsers.filter(
            userToCheck => !usersNotInTeam.some(userEntryComparedAgainst => userToCheck.id === userEntryComparedAgainst.id)
        );
        if (isLoading) {
            setOriginalListOFUsersInTeam(listOfUsersInTeam)
            setLoading(false);
        }
        return listOfUsersInTeam;
    }, [usersNotInTeam, allPreviewUsers]);

    useEffect(() => {
        // As we are on an old version of react-router, will have to use setRouteLeaveHook instead of 'Prompt' for now
        router.setRouteLeaveHook(route, handleRequestToLeavePage);
        // Load page data
        if (isEditMode) {
            loadGroup(params.groupID);
            loadGroupMembers(params.groupID);
        }
        loadUsers();
    }, []);

    useEffect(() => {
        if (group.details.name != null || group.details.id != null) {
            setTeamName(group.details.name || group.details.id)
        }
    }, [group.details.name]);

    useEffect(() => {
        if (allPreviewUsers != null && allPreviewUsers.length) {
            setUsersNotInTeam(allPreviewUsers);
        }
    }, [allPreviewUsers]);

    useEffect(() => {
        let hasChanges = false;
        // TODO could compress this logic by just setting 'original' vars then don't care about which mode
        if (isEditMode) {
            if (!_.isEqual(originalListOfUsersInTeam, usersInTeam) || teamName !== originalTeamName) {
                hasChanges = true;
            }
        } else {
            hasChanges = teamName !== "" || usersInTeam?.length > 0;
        }
        setUnsavedChanges(hasChanges);
    }, [teamName, usersInTeam]);

    useEffect(() => {
        // TODO make sure only called once (maybe simplify)
        if (group.details == null || allPreviewUsers == null) {
            return;
        }
        const displayName = group.details.name || group.details.id;
        setTeamName(displayName); // TODO set team name initial value
        setOriginalTeamName(displayName);
        let newListOfUsersNotInTeam = allPreviewUsers.filter(previewUser => {
            return !group.members.find(userInTeam => {
                return userInTeam.id === previewUser.id;
            });
        });
        let listOfUsersInTeam = allPreviewUsers.filter(previewUser => {
            return group.members.find(userInTeam => {
                return userInTeam.id === previewUser.id;
            });
        });
        setOriginalListOFUsersInTeam(listOfUsersInTeam);
        setUsersNotInTeam(newListOfUsersNotInTeam);
    }, [group, allPreviewUsers]);

    const addUserToTeam = user => {
        const newListOfUsersNotInTeam = usersNotInTeam.filter(filteredUser => filteredUser.id !== user.id);
        setUsersNotInTeam(newListOfUsersNotInTeam);
    };

    const handleTeamNameChange = event => {
        setTeamName(event.target.value);
    };

    const saveChanges = (createNewTeam = false) => {
        // TODO
        if (unsavedChanges && teamName === "") {
            const notification = {
                type: "warning",
                message: "Unable to save team, you need to at least give the team a name",
                isDismissable: true,
            };
            notifications.add(notification);
            return;
        }
        // All user created teams will have an equal precedence of 10. 0-9 are for 'roles' 11-99 are unused.
        setUnsavedChanges(false);
        if (createNewTeam) {
            const body = {
                name: teamName,
                precedence: 10,
            };
            createTeam(body, usersInTeam);
        } else {
            let usersToAdd = usersInTeam.filter(user => !originalListOfUsersInTeam.some(originalUser => user.id === originalUser.id));
            let usersToDelete = originalListOfUsersInTeam.filter(originalUser => !usersInTeam.some(user => originalUser.id === user.id));
            updateTeam(params?.groupID, teamName !== originalTeamName ? teamName : null, usersToAdd, usersToDelete)
        }
    };
    const createTeamButton = {
        id: "create-team-btn",
        text: "Create Team",
        interactionCallback: () => {
            saveChanges(true)
        },
        style: "positive",
        disabled: false,
    };
    const saveChangesButton = {
        id: "save-team-btn",
        text: "Save Changes",
        interactionCallback: () => {
            saveChanges(false)
        },
        style: "positive",
        disabled: false,
    };
    const contentActionBarProps = {
        buttons: [],
        cancelCallback: () => {
            const previousUrl = url.resolve("/groups", true);
            dispatch(push(previousUrl));
        },
        stickToBottom: true,
        unsavedChanges: unsavedChanges,
    };

    if (params?.groupID != null) {
        contentActionBarProps.buttons.push(saveChangesButton);
    } else {
        contentActionBarProps.buttons.push(createTeamButton);
    }
    let teamsMemberChips = <></>;
    if (!isLoading) {
        teamsMemberChips = (
            <div className="chip__container chip__container--gap-10">
                {usersInTeam?.map((teamMember, i) => {
                    return (
                        <Chip
                            key={`teamMember-${i}`}
                            icon="person"
                            style="standard"
                            text={`${teamMember.forename} ${teamMember.lastname}`}
                            removeFunc={() => {
                                const userToRemove = allPreviewUsers.find(viewer => viewer.id === teamMember.id);
                                setUsersNotInTeam([...usersNotInTeam, userToRemove]);
                            }}
                        />
                    );
                })}
            </div>
        );
    }

    const noTeamMembers = <p className="no-team-members">This team has no members</p>;
    let teamNameInputArea = (
        <Input id="team-name-id" label="Name" type="text" onChange={handleTeamNameChange}
               disabled={params?.groupID?.startsWith("role-")}/>
    );
    if (isEditMode) {
        let inputAreaDisabled = params?.groupID?.startsWith("role-") || (group?.details?.name == null)
        teamNameInputArea = <Input id="team-name-id" label="Name" type="text" onChange={handleTeamNameChange}
                                   disabled={inputAreaDisabled} value={teamName}/>
    }
    let pageTitle = <h1 className="margin-top--1 margin-bottom--1">Create a preview team</h1>;
    if (isEditMode) {
        if (group?.details?.name != null) {
            pageTitle = <h1 className="margin-top--1 margin-bottom--1">{group?.details?.name}</h1>;
        } else {
            // If group has no user-friendly name display ID instead. On page load we already know the groupID
            pageTitle = <h1 className="margin-top--1 margin-bottom--1">{params.groupID}</h1>;
        }
    }
    let deleteTeamPanelProps = {
        type: "error",
        heading: "Delete preview team",
        body: <><p>Team members cannot view content linked to this preview team after it
            has been deleted.</p>
            <button id="delete-team" type="button" key="delete-team" onClick={()=>{deleteGroup(params.groupID)}}
                    className={"btn btn--warning margin-top--1"} disabled={isLoading}>
                Delete Team
            </button>
        </>
    }
    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-4 margin-top--1 margin-bottom--1">
                <span>
                    &#9664; <Link to={url.resolve("/groups")} role="link">Back</Link>
                </span>
                {pageTitle}
                {teamNameInputArea}
                <span>
                    <strong>Members</strong>
                </span>
                {usersInTeam?.length > 0 ? teamsMemberChips : noTeamMembers}
                {isEditMode && !params?.groupID?.startsWith("role-") &&
                    <div className="margin-top--1"><Panel {...deleteTeamPanelProps}/></div>}
            </div>
            <UsersNotInTeam usersNotInTeam={usersNotInTeam} loading={isLoading} addUserToTeam={addUserToTeam}/>
            <ContentActionBar {...contentActionBarProps} />
        </div>
    );
};

ComposeTeam.propTypes = propTypes;

export default ComposeTeam;
