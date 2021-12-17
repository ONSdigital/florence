import React, {useEffect, useMemo, useState} from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Link } from "react-router";
import url from "../../../utilities/url";
import { getUsersRequest, createTeam } from "../../../config/thunks";
import UsersNotInTeam from "../../../components/users/UsersNotInTeam";
import ContentActionBar from "../../../components/content-action-bar/ContentActionBar";
import Input from "../../../components/Input";
import Chip from "../../../components/chip/Chip";
import { addPopout, removePopouts } from "../../../config/actions";
import { newTeamUnsavedChanges, removeUserFromNewTeam, resetNewTeam } from "../../../config/newTeam/newTeamActions";
import PropTypes from "prop-types";
import notifications from "../../../utilities/notifications";

const propTypes = {
    dispatch: PropTypes.func,
    newTeam: PropTypes.shape({
        usersNotInTeam: PropTypes.arrayOf(PropTypes.object),
        allUsers: PropTypes.arrayOf(PropTypes.object),
        unsavedChanges: PropTypes.bool,
    }).isRequired,
};

const CreateTeam = props => {
    const { dispatch, router, route, newTeam } = props;
    const [userConfirmedToLeave, setUserConfirmedToLeave] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [isLoading, setLoading] = useState(true);
    const usersInTeam = useMemo(() => {
        return newTeam.allUsers.filter(userToCheck => !newTeam.usersNotInTeam.some(userEntryComparedAgainst => userToCheck.id === userEntryComparedAgainst.id))
    },[newTeam.usersNotInTeam, newTeam.allUsers])
    useEffect(() => {
        dispatch(resetNewTeam());
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
        if (newTeam.allUsers.length) {
            setLoading(false)
        }
    }, [newTeam.allUsers]);

    useEffect(() => {
        if (teamName !== "" || usersInTeam?.length > 0) {
            dispatch(newTeamUnsavedChanges(true));
        } else {
            dispatch(newTeamUnsavedChanges(false));
        }
    }, [teamName, usersInTeam]);

    const handleRequestToLeavePage = () => {
        let canLeave = true;
        if (!userConfirmedToLeave && newTeam.unsavedChanges) {
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

    const requestCreateTeam = () => {
        if (newTeam.unsavedChanges && teamName !== "") {
            // All user created teams will have an equal precedence of 10. 0-9 are for 'roles' 11-99 are unused.
            const body = {
                name: teamName,
                precedence: 10,
            };
            dispatch(createTeam(body));
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
                interactionCallback: requestCreateTeam,
                style: "positive",
                disabled: false,
            },
        ],
        cancelCallback: () => {
            const previousUrl = url.resolve("../", true);
            dispatch(push(previousUrl));
        },
        stickToBottom: true,
        unsavedChanges: newTeam.unsavedChanges,
    };
    let teamsMemberChips = (
        <div className="chip__container chip__container--gap-10">
            {usersInTeam?.map((teamMember, i) => {
                return (
                    <Chip
                        key={`teamMember-${i}`}
                        icon="person"
                        style="standard"
                        text={`${teamMember.forename} ${teamMember.lastname}`}
                        removeFunc={() => {
                            let userToRemove = newTeam.allUsers?.find(viewer => viewer.email === teamMember.email);
                            dispatch(removeUserFromNewTeam(userToRemove));
                        }}
                    />
                );
            })}
        </div>
    );
    const noTeamMembers = <p>This team has no members</p>;
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
            <UsersNotInTeam loading={isLoading} />
            <ContentActionBar {...contentActionBarProps} />
        </div>
    );
};

CreateTeam.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        newTeam: state.newTeam,
    };
}

export default connect(mapStateToProps)(CreateTeam);
