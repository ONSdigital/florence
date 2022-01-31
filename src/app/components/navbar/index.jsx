import { connect } from "react-redux";
import { getActive } from "../../config/selectors";
import NavBar from "./NavBar";

const mapStateToProps = state => ({
    user: state.user,
    rootPath: state.state.rootPath,
    workingOn: getActive(state.state),
    config: state.state.config,
});

export default connect(mapStateToProps)(NavBar);
