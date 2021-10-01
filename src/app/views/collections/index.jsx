import { connect } from "react-redux";
import CollectionsController from "./CollectionsController";
import { emptyActiveCollection, addAllCollections, deleteCollectionFromAllCollections, updateWorkingOn } from "../../config/actions";

const mapStateToProps = state => {
    return {
        user: state.state.user,
        collections: state.state.collections.all,
        activeCollection: state.state.collections.active,
        collectionsToDelete: state.state.collections.toDelete,
        rootPath: state.state.rootPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        emptyActiveCollection: () => dispatch(emptyActiveCollection()),
        deleteCollectionFromAllCollections: () => dispatch(deleteCollectionFromAllCollections()),
        addAllCollections: allCollections => dispatch(addAllCollections(allCollections))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionsController);
