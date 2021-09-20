import { connect } from "react-redux";
import PreviewNav from "./PreviewNav";
import { updateSelectedPreviewPage } from "../../../config/actions";

function mapStateToProps(state) {
    const user = state.state.user;
    const rootPath = state.state.rootPath;
    const workingOn = state.state.global ? state.state.global.workingOn : null;

    return {
        user,
        rootPath,
        workingOn,
        config: state.state.config
    };
}

const mapDispatchToProps = dispatch => {
    return {
        updateSelectedPreviewPage: uri => dispatch(updateSelectedPreviewPage(uri))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewNav);
