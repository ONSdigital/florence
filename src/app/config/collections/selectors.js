import { createSelector } from "reselect";

export const getCollections = state => state.collections.all;
export const getCollectionsLoading = state => state.collections.isLoading;

