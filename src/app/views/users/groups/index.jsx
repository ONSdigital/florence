import { connect } from "react-redux";
import { fetchGroupsRequest } from "../../../config/groups/thunks";
import { fetchUserRequest, addGroupsToUserRequest } from "../../../config/thunks";
import { getUser, getUserLoading, getGroupsLoading, getGroups, getUserAddingToGroups } from "../../../config/selectors";
import AddGroupsToUser from "./AddGroupsToUser";

export const mapStateToProps = state => ({
    rootPath: state.state.rootPath,
    user: getUser(state.state),
    loading: getUserLoading(state.state),
    loadingGroups: getGroupsLoading(state.state),
    groups: getGroups(state.state),
    adding: getUserAddingToGroups(state.state),
});

export const mapDispatchToProps = dispatch => ({
    loadUser: id => dispatch(fetchUserRequest(id)),
    loadGroups: () => dispatch(fetchGroupsRequest()),
    addGroupsToUser: (id, userGroups) => dispatch(addGroupsToUserRequest(id, userGroups)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupsToUser);
