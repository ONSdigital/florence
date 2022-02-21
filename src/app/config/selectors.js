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

export const getGroups = state => state.groups.all;
export const getGroupsLoading = state => state.groups.isLoading;

export const getEnableNewSignIn = state => state.config.enableNewSignIn;

export const getMappedGroups = createSelector(getGroups, getEnableNewSignIn, (groups, isNewSignIn) => {
    if (!groups) return [];
    return isNewSignIn
        ? groups.map(group => ({ id: group.group_name, name: group.description }))
        : groups.map(group => ({ id: group.id.toString(), name: group.name }));
});

export const getNotifications = state => state.notifications;

export const getActiveUser = state => state.users.active; //TODO: check if this is needed
export const getActiveUserLoading = state => state.users.isLoadingActive;

export const getUser = state => state.user.data;
export const getUserLoading = state => state.user.isLoading;
export const getUserAddingToGroups = state => state.isUserAddingToGroups;

export const getUsers = state => state.users.all;
export const getUsersLoading = state => state.users.isLoading;
export const getRootPath = state => state.rootPath;

export const getUserGroups = state => state.user.groups;

export const getMappedUsers = createSelector(getUsers, getRootPath, (users, rootPath) => {
    if (!users) return [];
    return users.map(user => ({
        ...user,
        title: `${user.forename} ${user.lastname}`,
        details: [user.email],
        url: `${rootPath}/users/${user.id}`,
    }));
});
