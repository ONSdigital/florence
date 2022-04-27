import { connect } from "react-redux";
import { getActive, getPreviewLanguage } from "../../config/selectors";
import { setPreviewLanguage } from "../../config/actions";
import NavBar from "./NavBar";

const mapStateToProps = state => ({
    user: state.user,
    rootPath: state.state.rootPath,
    workingOn: getActive(state.state),
    config: state.state.config,
    previewLanguage: getPreviewLanguage(state.state),
});

const mapDispatchToProps = dispatch => {
    return {
        setPreviewLanguage: language => dispatch(setPreviewLanguage(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
