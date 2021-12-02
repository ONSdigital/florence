import { createSelector } from "reselect";
import collectionMapper from "../views/collections/mapper/collectionMapper";

export const getCollections = state => state.collections.all;
export const getSearch = state => state.search;

export const getMappedCollections = createSelector(getCollections, collections => {
    if (!collections) return [];
    return collections.sort((a, b) => a.name.localeCompare(b.name)).map(collection => collectionMapper.collectionResponseToState(collection));
});

export const getFilteredCollections = createSelector(getMappedCollections, getSearch, (collections, search) => {
    if (!collections) return [];
    if (!getSearch) return collections;
    return collections.filter(collection => {
        const string = search.toLowerCase();
        const name = collection.name.toLowerCase();
        return name.includes(string);
    });
});
export const getWorkingOn = state => state.global.workingOn;
export const getActive = state => state.collections.active;
export const getCollectionsLoading = state => state.collections.isLoading;
export const getCollectionCreating = state => state.collections.isCreating;
