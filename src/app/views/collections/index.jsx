import { connect } from "react-redux";
import { updateWorkingOn } from "../../config/actions";
import { emptyActiveCollection, deleteCollectionFromAllCollections } from "../../config/collections/actions";
import { loadCollectionsRequest } from "../../config/collections/thunks";
import { getCollectionsLoading, getCollections, getMappedCollections } from "../../config/collections/selectors";
import Collections from "./Collections";

export const mapStateToProps = state => {
    return {
        user: state.user,
        activeCollection: state.collections.active,
        collectionsToDelete: state.collections.toDelete,
        rootPath: state.state.rootPath,
        isLoading: getCollectionsLoading(state),
        collections: getMappedCollections(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadCollections: () => dispatch(loadCollectionsRequest()),
        updateWorkingOn: (id, name) => dispatch(updateWorkingOn(id, name)),
        emptyActiveCollection: () => dispatch(emptyActiveCollection()),
        deleteCollectionFromAllCollections: () => dispatch(deleteCollectionFromAllCollections()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
