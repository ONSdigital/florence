import { connect } from "react-redux";
import { fetchGroupsRequest } from "../../config/thunks";
import Groups from "./Groups";
import { getEnableNewSignIn, getGroups, getGroupsLoading } from "../../config/selectors";

function mapStateToProps(state) {
    return {
        groups: getGroups(state.state),
        isNewSignIn: getEnableNewSignIn(state.state),
        isLoading: getGroupsLoading(state.state),
        rootPath: state.state.rootPath,
    };
}

const mapDispatchToProps = dispatch => ({
    loadTeams: isNewSignIn => dispatch(fetchGroupsRequest(isNewSignIn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
