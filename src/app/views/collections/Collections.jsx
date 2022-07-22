import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { push } from "react-router-redux";
import cookies from "../../utilities/cookies";
import CreateNewCollection from "./create/";
import DoubleSelectableBox from "../../components/selectable-box/double-column/DoubleSelectableBox";
import CollectionDetailsController from "./details/CollectionDetailsController";
import Search from "../../components/search";
import ConfirmUserDeleteController from "../users/confirm-delete/ConfirmUserDeleteController";
import { getAuthState, isViewerFromAuthState } from "../../utilities/auth";
import fp from "lodash/fp";

const Collections = props => {
    const { user, collections, isLoading, workingOn, updateWorkingOn, search } = props;
    // Get viewer from local storage as we don't want to make a call to /groups if userType is undefined
    const isViewer = isViewerFromAuthState();

    useEffect(() => {
        props.loadCollections(`${props.rootPath}/collections`);
    }, []);

    const handleCollectionClick = id => {
        cookies.add("collection", id, null);
        if (isViewer) {
            updateWorkingOn(id);
            props.dispatch(push(`${props.rootPath}/collections/${id}/preview`));
            return;
        }
        props.dispatch(push(`${props.rootPath}/collections/${id}`));
    };

    const getNotCompletedCollections = () => {
        if (!isViewer) {
            return collections.filter(collection => {
                return collection.approvalStatus !== "COMPLETE";
            });
        }
        return collections;
    };
    return (
        <>
            <div className="grid grid--justify-space-around" data-testid="collections">
                <div className={isViewer ? "grid__col-8" : "grid__col-4"}>
                    <h1 className="text-center">Select a collection</h1>
                    <Search />
                    <DoubleSelectableBox
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
                        <CreateNewCollection collections={collections} user={user} />
                    </div>
                )}
            </div>
            {props.params.collectionID && <CollectionDetailsController collectionID={props.params.collectionID} routes={props.routes} />}
        </>
    );
};

Collections.propTypes = {
    activeCollection: PropTypes.object,
    collections: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loadCollections: PropTypes.func.isRequired,
    params: PropTypes.shape({ collectionID: PropTypes.string }).isRequired,
    rootPath: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
    search: PropTypes.string,
    updateWorkingOn: PropTypes.func.isRequired,
    user: PropTypes.shape({ userType: PropTypes.string.isRequired }).isRequired,
};

export default Collections;
