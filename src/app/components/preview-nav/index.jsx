import { connect } from "react-redux";
import PreviewNav from "./PreviewNav";

function mapStateToProps(state) {
    const user = state.state.user;
    const rootPath = state.state.rootPath;
    const workingOn = state.state.global ? state.state.global.workingOn : null;

    return {
        user,
        rootPath,
        workingOn,
        config: state.state.config,
    };
}

export default connect(mapStateToProps)(PreviewNav);
