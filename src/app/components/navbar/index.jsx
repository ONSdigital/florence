import { connect } from "react-redux";
import { getActive, getGroupsLoading, getEnableNewSignIn } from "../../config/selectors";
import NavBar from "./NavBar";

const mapStateToProps = state => ({
    user: state.user,
    rootPath: state.state.rootPath,
    workingOn: getActive(state.state),
    config: state.state.config,
    isNewSignIn: getEnableNewSignIn(state.state),
});

export default connect(mapStateToProps)(NavBar);
