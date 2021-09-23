import { connect } from "react-redux";
import PreviewNav from "./PreviewNav";
import { updateSelectedPreviewPage } from "../../../config/actions";

const mapStateToProps = state => {
    return {
        preview: state.state.preview,
        rootPath: state.state.rootPath,
        workingOn: state.state.global ? state.state.global.workingOn : {}
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateSelectedPreviewPage: uri => dispatch(updateSelectedPreviewPage(uri))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewNav);
