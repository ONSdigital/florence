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
    if (!search) return collections;
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
export const getIsUpdatingCollection = state => state.collections.isUpdating;
export const getPreviewUsers = state => state.users.previewUsers;

export const getTeams = state => state.teams.all;
export const getTeamsLoading = state => state.teams.isLoading;
export const getMappedTeams = createSelector(getTeams, teams => {
    if (!teams) return [];
    return teams.map(team => ({ id: team.id.toString(), name: team.name }));
});

export const getNotifications = state => state.notifications;

export const getUser = state => state.users.active;
export const getUserLoading = state => state.users.isLoadingActive;
export const getUserAddingToGroups = state => state.isUserAddingToGroups;

export const getGroups = state => state.groups.all;
export const getGroupsLoading = state => state.groups.isLoading;
