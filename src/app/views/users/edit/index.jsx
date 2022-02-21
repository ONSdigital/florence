import { connect } from "react-redux";
import { getUser, getUserLoading, getGroupsLoading, getUserGroups } from "../../../config/selectors";
import { updateUserRequest, fetchUserRequest, fetchUserGroupsRequest } from "../../../config/thunks";
import EditUser from "./EditUser";

export const mapStateToProps = state => ({
    rootPath: state.state.rootPath,
    user: getUser(state.state),
    loading: getUserLoading(state.state),
    userGroups: getUserGroups(state.state),
});

const mapDispatchToProps = dispatch => ({
    updateUser: (id, body) => dispatch(updateUserRequest(id, body)),
    loadUser: id => dispatch(fetchUserRequest(id)),
    loadUserGroups: id => dispatch(fetchUserGroupsRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
