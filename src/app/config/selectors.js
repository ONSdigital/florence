import { createSelector } from "reselect";
import collectionMapper from "../views/collections/mapper/collectionMapper";
import { formatDateString } from "../utilities/formatDateString";
import fp from "lodash/fp";

export const getCollections = state => state.collections.all;
export const getSearch = state => state.search;

export const getMappedCollections = createSelector(getCollections, collections => {
    if (!collections || !Array.isArray(collections)) {
        return [];
    }
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
export const rootPath = state => state.rootPath;
export const getPreviewLanguage = state => state.previewLanguage;
export const getActive = state => state.collections.active;
export const getCollectionsLoading = state => state.collections.isLoading;
export const getCollectionCreating = state => state.collections.isCreating;
export const getIsUpdatingCollection = state => state.collections.isUpdating;
export const getPreviewUsers = state => state.users.previewUsers;
export const getCollectionAccessPolicy = state => state.policy.data;
export const getCollectionAccessPolicyLoading = state => state.policy.loading;
export const getCollectionAccessPolicyUpdating = state => state.policy.updating;

export const getGroups = state => (state.groups ? state.groups.all : []);
export const getGroupsLoading = state => state.groups.isLoading;
export const getGroup = state => state.groups.active;
export const getGroupLoading = state => state.groups.isLoadingActive;
export const getGroupMembersLoading = state => state.groups.isLoadingMembers;
export const getGroupMembers = state => state.groups.members;
export const getGroupsByCollectionID = (id, allCollections, allGroups) => {
    const collection = fp.filter(["id", id])(allCollections);
    const groups = fp.get("teams", fp.first(collection));
    return fp.filter(g => {
        return fp.includes(g.id)(groups);
    })(allGroups);
};

export const getEnableNewSignIn = state => state.config.enableNewSignIn;
export const getEnablePermissionsAPI = state => state.config.enablePermissionsAPI;
export const getNotifications = state => state.notifications;

export const getActiveUser = state => state.users.active; //TODO: check if this is needed
export const getActiveUserLoading = state => state.users.isLoadingActive;

export const getUser = state => state.user.data;
export const getUserLoading = state => state.user.isLoading;
export const getUserAddingToGroups = state => state.isUserAddingToGroups;

export const getUsers = state => state.users.all;
export const getUsersLoading = state => state.users.isLoading;

export const getActiveUsers = createSelector(getUsers, users => {
    if (!users) return [];
    return users.filter(user => user.active === true);
});

export const getMappedAvailableActiveUsers = createSelector(getActiveUsers, getGroupMembers, (users, members) => {
    if (!users) return [];
    const availableUsers = users.filter(user => !members.some(m => m.id === user.id));
    return availableUsers.map(user => ({ ...user, name: `${user.forename} ${user.lastname}` }));
});

export const getSuspendedUsers = createSelector(getUsers, users => {
    if (!users) return [];
    return users.filter(user => user.active === false);
});

export const getUserGroups = state => state.user.groups;
export const getIsRemovingAllTokens = state => state.users.isRemovingAllTokens;
export const getIsDeletingGroup = state => state.groups.isDeleting;

export const getSortedGroups = createSelector(getGroups, groups => {
    if (!groups) return [];
    return groups.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
});

export const getMappedSortedGroups = createSelector(getSortedGroups, rootPath, (groups, rootPath) => {
    if (!groups) return [];
    return groups.map(group => ({
        ...group,
        title: group.name,
        url: `${rootPath}/groups/${group.id}`,
        extraDetails: [[{ content: formatDateString(group.creation_date) }]],
    }));
});
