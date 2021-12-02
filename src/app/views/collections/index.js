import { connect } from "react-redux";
import { createCollectionRequest, loadCollectionsRequest } from "../../config/thunks";
import { updateWorkingOn } from "../../config/actions";
import { getCollectionsLoading, getFilteredCollections, getSearch, getWorkingOn } from "../../config/selectors";
import Collections from "./Collections";

export const mapStateToProps = state => {
    return {
        collections: getFilteredCollections(state.state),
        collectionsToDelete: state.state.collections.toDelete,
        isLoading: getCollectionsLoading(state.state),
        rootPath: state.state.rootPath,
        search: getSearch(state.state),
        user: state.user,
        workingOn: getWorkingOn(state.state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createCollection: collection => dispatch(createCollectionRequest(collection)),
        loadCollections: () => dispatch(loadCollectionsRequest()),
        updateWorkingOn: (id, name) => dispatch(updateWorkingOn(id, name)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
