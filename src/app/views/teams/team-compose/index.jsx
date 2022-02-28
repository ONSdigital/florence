import { connect } from "react-redux";
import { getUsersRequest, getGroupMembers, createTeam, getGroupRequest } from "../../../config/thunks";
import ComposeTeam from "./ComposeTeam";
import { getActiveGroup, getPreviewUsers } from "../../../config/selectors";

export const mapStateToProps = state => ({
    allPreviewUsers: getPreviewUsers(state.state),
    group: getActiveGroup(state.state),
});

export const mapDispatchToProps = dispatch => ({
    loadUsers: () => dispatch(getUsersRequest()),
    loadGroup: id => dispatch(getGroupRequest(id)),
    loadGroupMembers: id => dispatch(getGroupMembers(id)),
    createTeam: (body, usersInTeam) => dispatch(createTeam(body, usersInTeam)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComposeTeam);
