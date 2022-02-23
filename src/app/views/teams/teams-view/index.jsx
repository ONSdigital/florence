import { connect } from "react-redux";
import { fetchGroupsRequest } from "../../../config/thunks";
import TeamsList from "./TeamsList";
import { getEnableNewSignIn, getGroups } from "../../../config/selectors";

function mapStateToProps(state) {
    return {
        groups: getGroups(state.state),
        isNewSignIn: getEnableNewSignIn(state.state),
    };
}

const mapDispatchToProps = dispatch => ({
    loadTeams: isNewSignIn => dispatch(fetchGroupsRequest(isNewSignIn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamsList);
