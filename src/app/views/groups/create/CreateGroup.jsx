import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Link } from "react-router";
import url from "../../../utilities/url";
import { getUsersRequest, createGroup } from "../../../config/thunks";
import UsersNotInTeam from "../../../components/users/UsersNotInTeam";
import ContentActionBar from "../../../components/content-action-bar/ContentActionBar";
import Input from "../../../components/Input";
import Chip from "../../../components/chip/Chip";
import { addPopout, removePopouts } from "../../../config/actions";
import PropTypes from "prop-types";
import notifications from "../../../utilities/notifications";
import { getPreviewUsers } from "../../../config/selectors";

const propTypes = {
    dispatch: PropTypes.func,
    allPreviewUsers: PropTypes.arrayOf(PropTypes.object),
    unsavedChanges: PropTypes.bool,
    router: PropTypes.shape({
        setRouteLeaveHook: PropTypes.func,
    }),
    route: PropTypes.string,
};

const CreateGroup = props => {
    const { dispatch, router, route, allPreviewUsers } = props;
    const [userConfirmedToLeave, setUserConfirmedToLeave] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [isLoading, setLoading] = useState(true);
    const [usersNotInTeam, setUsersNotInTeam] = useState([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const usersInTeam = useMemo(() => {
        if (allPreviewUsers == null) {
            return [];
        }
        return allPreviewUsers.filter(
            userToCheck => !usersNotInTeam.some(userEntryComparedAgainst => userToCheck.id === userEntryComparedAgainst.id)
        );
    }, [usersNotInTeam, allPreviewUsers]);
    useEffect(() => {
        dispatch(getUsersRequest());
    }, []);

    // As we are on an old version of react-router, will have to use setRouteLeaveHook instead of 'Prompt' for now
    useEffect(() => {
        router.setRouteLeaveHook(route, handleRequestToLeavePage);
    });

    useEffect(() => {
        if (userConfirmedToLeave) {
            const previousUrl = url.resolve("../", true);
            dispatch(push(previousUrl));
        }
    }, [userConfirmedToLeave]);

    useEffect(() => {
        if (allPreviewUsers != null && allPreviewUsers.length) {
            setUsersNotInTeam(allPreviewUsers);
            setLoading(false);
        }
    }, [allPreviewUsers]);

    useEffect(() => {
        if (teamName !== "" || usersInTeam?.length > 0) {
            setUnsavedChanges(true);
        } else {
            setUnsavedChanges(false);
        }
    }, [teamName, usersInTeam]);

    const addUserToTeam = user => {
        const newListOfUsersNotInTeam = usersNotInTeam.filter(filteredUser => filteredUser.email !== user.email);
        setUsersNotInTeam(newListOfUsersNotInTeam);
    };

    const handleRequestToLeavePage = () => {
        let canLeave = true;
        if (!userConfirmedToLeave && unsavedChanges) {
            canLeave = false;
            const popoutOptions = {
                id: "unsaved-changes",
                title: "You have unsaved changes",
                body: "If you leave these changes will be discarded.",
                buttons: [
                    {
                        onClick: () => {
                            dispatch(removePopouts(["unsaved-changes"]));
                            setUserConfirmedToLeave(true);
                        },
                        text: "Discard changes",
                        style: "warning",
                    },
                    {
                        onClick: () => {
                            dispatch(removePopouts(["unsaved-changes"]));
                            return false;
                        },
                        text: "Continue editing team",
                        style: "invert-primary",
                    },
                ],
            };
            dispatch(addPopout(popoutOptions));
        }
        return canLeave;
    };

    const handleTeamNameChange = event => {
        setTeamName(event.target.value);
    };

    const requestCreateGroup = () => {
        if (unsavedChanges && teamName !== "") {
            // All user created teams will have an equal precedence of 10. 0-9 are for 'roles' 11-99 are unused.
            const body = {
                name: teamName,
                precedence: 10,
            };
            setUnsavedChanges(false);
            dispatch(createGroup(body, usersInTeam));
        } else {
            const notification = {
                type: "warning",
                message: "Unable to save team, you need to at least give the team a name",
                isDismissable: true,
            };
            notifications.add(notification);
        }
    };
    let contentActionBarProps = {
        buttons: [
            {
                id: "create-team-btn",
                text: "Create Team",
                interactionCallback: requestCreateGroup,
                style: "positive",
                disabled: false,
            },
        ],
        cancelCallback: () => {
            const previousUrl = url.resolve("../", true);
            dispatch(push(previousUrl));
        },
        stickToBottom: true,
        unsavedChanges: unsavedChanges,
    };
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
                                const userToRemove = allPreviewUsers.find(viewer => viewer.email === teamMember.email);
                                setUsersNotInTeam([...usersNotInTeam, userToRemove]);
                            }}
                        />
                    );
                })}
            </div>
        );
    }

    const noTeamMembers = <p className="no-team-members">This team has no members</p>;
    const teamNameInputArea = <Input id="team-name-id" label="Name" type="text" onChange={handleTeamNameChange} />;

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-4 margin-top--1 margin-bottom--1">
                <span>
                    &#9664; <Link to={url.resolve("../")}>Back</Link>
                </span>
                <h1 className="margin-top--1 margin-bottom--1">Create a preview team</h1>
                {teamNameInputArea}
                <span>
                    <strong>Members</strong>
                </span>
                {usersInTeam?.length > 0 ? teamsMemberChips : noTeamMembers}
            </div>
            <UsersNotInTeam usersNotInTeam={usersNotInTeam} loading={isLoading} addUserToTeam={addUserToTeam} />
            <ContentActionBar {...contentActionBarProps} />
        </div>
    );
};

CreateGroup.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        allPreviewUsers: getPreviewUsers(state.state),
    };
}

export default connect(mapStateToProps)(CreateGroup);
