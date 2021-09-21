import { connect } from "react-redux";
import Navbar from "./Navbar";

const mapStateToProps = state => {
    return {
        user: state.state.user,
        rootPath: state.state.rootPath,
        workingOn: state.state.global ? state.state.global.workingOn : null,
        config: state.state.config
    };
};

export default connect(mapStateToProps)(Navbar);
