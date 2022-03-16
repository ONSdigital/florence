import { connect } from "react-redux";
import { fetchGroupRequest, updateGroupRequest } from "../../../config/groups/thunks";
import { getUsersRequest } from "../../../config/thunks";
import { getGroup, getGroupLoading, getUsers } from "../../../config/selectors";
import EditGroup from "./EditGroup";

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        group: getGroup(state.state),
        loading: getGroupLoading(state.state),
        users: getUsers(state.state),
    };
}

const mapDispatchToProps = dispatch => ({
    loadGroup: id => dispatch(fetchGroupRequest(id)),
    updateGroup: (id, body) => dispatch(updateGroupRequest(id, body)),
    loadUsers: () => dispatch(getUsersRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGroup);
