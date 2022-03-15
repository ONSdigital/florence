import { connect } from "react-redux";
import { fetchGroupRequest, updateGroupRequest } from "../../../config/groups/thunks";
import { getGroup, getGroupLoading } from "../../../config/selectors";
import EditGroup from "./EditGroup";

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        group: getGroup(state.state),
        loading: getGroupLoading(state.state),
    };
}

const mapDispatchToProps = dispatch => ({
    loadGroup: id => dispatch(fetchGroupRequest(id)),
    updateGroup: (id, body) => dispatch(updateGroupRequest(id, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGroup);
