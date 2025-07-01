import { connect } from "react-redux";
import { getUser, getUserLoading, getUserGroups } from "../../../config/selectors";
import { updateUserRequest, fetchUserRequest, fetchUserGroupsRequest, setUserPasswordRequest } from "../../../config/thunks";
import EditUser from "./EditUser";

const mapStateToProps = state => ({
    rootPath: state.state.rootPath,
    user: getUser(state.state),
    loading: getUserLoading(state.state),
    userGroups: getUserGroups(state.state),
    loggedInUser: state.user,
});

const mapDispatchToProps = dispatch => ({
    setUserPassword: id => dispatch(setUserPasswordRequest(id)),
    updateUser: (id, body) => dispatch(updateUserRequest(id, body)),
    loadUser: id => dispatch(fetchUserRequest(id)),
    loadUserGroups: id => dispatch(fetchUserGroupsRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
