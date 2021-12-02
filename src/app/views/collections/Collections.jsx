import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { push } from "react-router-redux";
import cookies from "../../utilities/cookies";
import CollectionCreateController from "./create/CollectionCreateController";
import DoubleSelectableBoxController from "../../components/selectable-box/double-column/DoubleSelectableBoxController";
import CollectionDetailsController from "./details/CollectionDetailsController";
import Search from "../../components/search";

const Collections = props => {
    const { user, collections, isLoading, workingOn, updateWorkingOn, search } = props;
    const isViewer = user && user.userType === "VIEWER";

    useEffect(() => {
        props.loadCollections();
    }, []);

    useEffect(() => {
        if (workingOn && workingOn.id) document.getElementById(workingOn.id).scrollIntoView();
    }, [workingOn]);

    const handleCollectionClick = id => {
        if (isViewer) {
            cookies.add("collection", id, null);
            updateWorkingOn(id);
            props.dispatch(push(`${props.rootPath}/collections/${id}/preview`));
            return;
        }
        props.dispatch(push(`${props.rootPath}/collections/${id}`));
    };

    const getNotCompletedCollections = () =>
        isViewer && collections ? collections : collections.filter(collection => collection.approvalStatus !== "COMPLETE");

    return (
        <>
            <div className="grid grid--justify-space-around">
                <div className={isViewer ? "grid__col-8" : "grid__col-4"}>
                    <h1 className="text-center">Select a collection</h1>
                    <Search />
                    <DoubleSelectableBoxController
                        items={getNotCompletedCollections()}
                        activeItemID={props.params.collectionID}
                        isUpdating={isLoading}
                        search={props.search}
                        headings={["Name", "Publish date"]}
                        handleItemClick={handleCollectionClick}
                    />
                </div>
                {!isViewer && (
                    <div className="grid__col-4">
                        <h1 className="text-center">Create a collection</h1>
                        <CollectionCreateController collections={collections} user={user} />
                    </div>
                )}
            </div>
            {props.params.collectionID && <CollectionDetailsController collectionID={props.params.collectionID} routes={props.routes} />}
        </>
    );
};

Collections.PropTypes = {
    activeCollection: PropTypes.object,
    collections: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loadCollections: PropTypes.func.isRequired,
    params: PropTypes.shape({ collectionID: PropTypes.string }).isRequired,
    rootPath: PropTypes.string.isRequired,
    rootPath: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
    search: PropTypes.string,
    updateWorkingOn: PropTypes.func.isRequired,
    user: PropTypes.shape({ userType: PropTypes.string.isRequired }).isRequired,
};

export default Collections;
