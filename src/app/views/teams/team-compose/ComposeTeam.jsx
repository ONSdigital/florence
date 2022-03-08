import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import url from "../../../utilities/url";
import UsersNotInTeam from "../../../components/users/UsersNotInTeam";
import ContentActionBar from "../../../components/content-action-bar/ContentActionBar";
import Input from "../../../components/Input";
import Chip from "../../../components/chip/Chip";
import PropTypes from "prop-types";
import notifications from "../../../utilities/notifications";
import Loader from "../../../components/loader";
import DeleteTeam from "./DeleteTeam";

const propTypes = {
    allPreviewUsers: PropTypes.arrayOf(PropTypes.object),
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
    loadGroup: PropTypes.func,
    loadGroupMembers: PropTypes.func,
    createGroup: PropTypes.func,
    updateGroup: PropTypes.func,
    deleteGroup: PropTypes.func,
    cancelChanges: PropTypes.func,
    isLoadingPreviewUsers: PropTypes.bool,
    isLoadingGroups: PropTypes.bool,
};

const ComposeGroup = props => {
    const {
        router,
        route,
        allPreviewUsers,
        params,
        group,
        loadUsers,
        loadGroupMembers,
        createGroup,
        updateGroup,
        loadGroup,
        cancelChanges,
        isLoadingPreviewUsers,
        isLoadingGroups,
    } = props;
    const [groupName, setGroupName] = useState("");
    const [usersNotInGroup, setUsersNotInGroup] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = params.groupID != null;
    const isLoading = isLoadingPreviewUsers || isLoadingGroups;
    const groupOriginalDisplayName = isEditMode ? group.details.name || group.details.id : "";
    const usersInGroup = useMemo(() => {
        let listOfUsersInGroup = [];
        if (usersNotInGroup.length > 0) {
            listOfUsersInGroup = allPreviewUsers.filter(
                userToCheck => !usersNotInGroup.some(userEntryComparedAgainst => userToCheck.id === userEntryComparedAgainst.id)
            );
        }
        return listOfUsersInGroup;
    }, [usersNotInGroup]);

    const unsavedChanges = useMemo(() => {
        let areUnsavedChanges = false;
        if (isEditMode) {
            const isDiffInMembers =
                usersInGroup.filter(user => !group.members.some(member => user.id === member.id)).length > 0 ||
                group.members.filter(member => !usersInGroup.some(user => member.id === user.id)).length > 0;
            if (isDiffInMembers || groupName !== groupOriginalDisplayName) {
                areUnsavedChanges = true;
            }
        } else {
            areUnsavedChanges = groupName !== "" || usersInGroup?.length > 0;
        }
        return areUnsavedChanges;
    }, [groupName, usersInGroup]);

    useEffect(() => {
        router.setRouteLeaveHook(route, () => {
            // TODO when react router upgraded move to prompt instead
            if (unsavedChanges && !isSubmitting) return "Your work is not saved! Are you sure you want to leave?";
        });
    });

    useEffect(() => {
        // Load page details
        if (isEditMode) {
            loadGroup(params.groupID);
            loadGroupMembers(params.groupID);
        }
        loadUsers();
    }, []);

    useEffect(() => {
        // Initialise state based on API responses
        if (!isEditMode) {
            setGroupName("");
            setUsersNotInGroup(allPreviewUsers);
            return;
        }
        if (!isLoadingPreviewUsers && group.details != null) {
            const displayName = group.details.name || group.details.id;
            const newListOfUsersNotInGroup = allPreviewUsers.filter(previewUser => {
                return !group.members.find(userInGroup => {
                    return userInGroup.id === previewUser.id;
                });
            });
            setGroupName(displayName);
            setUsersNotInGroup(newListOfUsersNotInGroup);
        }
    }, [group.details, group.members, isLoadingPreviewUsers]);

    const addUserToGroup = user => {
        const newListOfUsersNotInGroup = usersNotInGroup.filter(filteredUser => filteredUser.id !== user.id);
        setUsersNotInGroup(newListOfUsersNotInGroup);
    };

    const handleGroupNameChange = event => {
        setGroupName(event.target.value);
    };

    const saveChanges = () => {
        if (unsavedChanges && groupName === "") {
            const notification = {
                type: "warning",
                message: "Unable to save group, you need to at least give the group a name",
                isDismissable: true,
            };
            notifications.add(notification);
            return;
        }
        setIsSubmitting(true);
        if (isEditMode) {
            const usersToAdd = usersInGroup.filter(user => !group.members.some(originalUser => user.id === originalUser.id));
            const usersToDelete = group.members.filter(originalUser => !usersInGroup.some(user => originalUser.id === user.id));
            updateGroup(params?.groupID, groupName !== groupOriginalDisplayName ? groupName : null, usersToAdd, usersToDelete);
        } else {
            // All user created groups will have an equal precedence of 10. 0-9 are for 'roles' 11-99 are unused.
            const body = {
                name: groupName,
                precedence: 10,
            };
            createGroup(body, usersInGroup);
        }
    };

    const contentActionBarProps = {
        buttons: [
            {
                id: "create-group-btn",
                text: isEditMode ? "Save Changes" : "Create Team",
                interactionCallback: saveChanges,
                style: "positive",
                disabled: false,
            },
        ],
        cancelCallback: () => {
            const previousUrl = url.resolve("/groups", true);
            cancelChanges(previousUrl);
        },
        stickToBottom: true,
        unsavedChanges: unsavedChanges,
    };

    const groupsMemberChips = (
        <div className="chip__container chip__container--gap-10">
            {usersInGroup?.map((groupMember, i) => {
                const displayText =
                    groupMember.forename !== "" || groupMember.lastname !== "" ? `${groupMember.forename} ${groupMember.lastname}` : groupMember.id;
                return (
                    <Chip
                        key={`groupMember-${i}`}
                        icon="person"
                        style="standard"
                        text={displayText}
                        removeFunc={() => {
                            const userToRemove = allPreviewUsers.find(viewer => viewer.id === groupMember.id);
                            setUsersNotInGroup([...usersNotInGroup, userToRemove]);
                        }}
                    />
                );
            })}
        </div>
    );

    const noGroupMembers = <p className="no-group-members">This team has no members</p>;
    const pageTitleText = isEditMode ? group?.details?.name || params.groupID : "Create a preview team";

    if (isLoading) return <Loader classNames="grid grid--align-center grid--align-self-center grid--full-height" />;

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-4 margin-top--1 margin-bottom--1">
                <span>
                    &#9664;{" "}
                    <Link to={url.resolve("/groups")} role="link">
                        Back
                    </Link>
                </span>
                <h1 className="margin-top--1 margin-bottom--1">{pageTitleText}</h1>
                <Input
                    id="group-name-id"
                    label="Name"
                    type="text"
                    onChange={handleGroupNameChange}
                    disabled={params?.groupID?.startsWith("role-")}
                    value={groupName}
                />
                <span>
                    <strong>Members</strong>
                </span>
                {usersInGroup?.length > 0 ? groupsMemberChips : noGroupMembers}
                {isEditMode && !params?.groupID?.startsWith("role-") && <DeleteTeam groupID={params.groupID} />}
            </div>
            <UsersNotInTeam usersNotInTeam={usersNotInGroup} loading={isLoading} addUserToTeam={addUserToGroup} />
            <ContentActionBar {...contentActionBarProps} />
        </div>
    );
};

ComposeGroup.propTypes = propTypes;

export default ComposeGroup;
