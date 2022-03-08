import { connect } from "react-redux";
import { getUsersRequest, getGroupMembers, createTeam, getGroupRequest, updateTeam, deleteGroup } from "../../../config/thunks";
import ComposeTeam from "./ComposeTeam";
import { getActiveGroup, getActiveGroupLoading, getPreviewUsers, getUsersLoading } from "../../../config/selectors";
import { push } from "react-router-redux";

export const mapStateToProps = state => ({
    allPreviewUsers: getPreviewUsers(state.state),
    group: getActiveGroup(state.state),
    isLoadingPreviewUsers: getUsersLoading(state.state),
    isLoadingGroups: getActiveGroupLoading(state.state),
});

export const mapDispatchToProps = dispatch => ({
    loadUsers: () => dispatch(getUsersRequest()),
    loadGroup: id => dispatch(getGroupRequest(id)),
    loadGroupMembers: id => dispatch(getGroupMembers(id)),
    createGroup: (body, usersInTeam) => dispatch(createTeam(body, usersInTeam)),
    updateGroup: (groupID, teamName, usersToAdd, usersToDelete) => dispatch(updateTeam(groupID, teamName, usersToAdd, usersToDelete)),
    deleteGroup: groupID => dispatch(deleteGroup(groupID)),
    cancelChanges: url => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComposeTeam);
