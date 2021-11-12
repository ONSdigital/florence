import { createSelector } from "reselect";
import collectionMapper from "../../views/collections/mapper/collectionMapper";

export const getCollections = state => state.collections.all;

export const getIncompleteCollections = createSelector(getCollections, collections =>
    collections.filter(collection => !collection.approvalStatus !== "COMPLETE")
);

export const getMappedCollections = createSelector(getCollections, collections =>
    collections.map(collection => collectionMapper.collectionResponseToState(collection))
);

export const getCollectionsLoading = state => state.collections.isLoading;
