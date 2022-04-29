import { connect } from "react-redux";
import { fetchGroupRequest, updateGroupRequest, updateGroupMembers } from "../../../config/groups/thunks";
import { getUsersRequest } from "../../../config/thunks";
import {
    getGroup,
    getGroupLoading,
    getMappedAvailableActiveUsers,
    getUsersLoading,
    getGroupMembers,
    getGroupMembersLoading,
} from "../../../config/selectors";
import { fetchGroupMembersRequest, updateGroupMembersRequest } from "../../../config/groups/thunks";
import EditGroup from "./EditGroup";

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        group: getGroup(state.state),
        loading: getGroupLoading(state.state),
        users: getMappedAvailableActiveUsers(state.state),
        loadingMembers: getGroupMembersLoading(state.state),
        members: getGroupMembers(state.state),
        loadingUsers: getUsersLoading(state.state),
    };
}

const mapDispatchToProps = dispatch => ({
    loadGroup: id => dispatch(fetchGroupRequest(id)),
    updateGroup: (id, body) => dispatch(updateGroupRequest(id, body)),
    updateGroupMembers: (id, body) => dispatch(updateGroupMembersRequest(id, body)),
    loadUsers: () => dispatch(getUsersRequest()),
    loadMembers: id => dispatch(fetchGroupMembersRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGroup);
