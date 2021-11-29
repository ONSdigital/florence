import { connect } from "react-redux";
import { createCollectionRequest, loadCollectionsRequest } from "../../config/thunks";
import { push } from "react-router-redux";
import { emptyActiveCollection, updateWorkingOn, deleteCollectionFromAllCollections } from "../../config/actions";
import { getCollectionsLoading, getMappedCollections, getFilteredCollections, getSearch, getActive, getWorkingOn } from "../../config/selectors";
import Collections from "./Collections";

export const mapStateToProps = state => {
    return {
        activeCollection: getActive(state.state),
        workingOn: getWorkingOn(state.state),
        collections: getFilteredCollections(state.state),
        collectionsToDelete: state.state.collections.toDelete,
        isLoading: getCollectionsLoading(state.state),
        rootPath: state.state.rootPath,
        user: state.user,
        search: getSearch(state.state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        deleteCollectionFromAllCollections: () => dispatch(deleteCollectionFromAllCollections()),
        emptyActiveCollection: () => dispatch(emptyActiveCollection()),
        loadCollections: () => dispatch(loadCollectionsRequest()),
        updateWorkingOn: (id, name) => dispatch(updateWorkingOn(id, name)),
        push: () => dispatch(push()),
        createCollection: collection => dispatch(createCollectionRequest(collection)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
