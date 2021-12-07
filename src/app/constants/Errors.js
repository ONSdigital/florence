export const UNIQ_NAME_ERROR = "A collection with this name already exists.";

export const UNEXPECTED_ERR = key => {
    `An unexpected error's occurred whilst trying to get ${key}. You may only be able to see previously loaded information and won't be able to edit any team members.`;
};
export const FETCH_ERR = key => {
    `There's been a network error whilst trying to get ${key}. You may only be able to see previously loaded information and not be able to edit any team members.`;
};

export const NOT_FOUND_ERR = key => {
    `No API route available to get ${key}.`;
};

export const PERMISSIONS_ERR = key => {
    `You don't have permissions to view ${key}`;
};
