import { connect } from "react-redux";
import NavBar from "./NavBar";

const mapStateToProps = state => {
    return {
        user: state.state.user,
        rootPath: state.state.rootPath,
        workingOn: state.state.global ? state.state.global.workingOn : null,
        config: state.state.config,
    };
};

export default connect(mapStateToProps)(NavBar);
