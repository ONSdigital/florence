import * as types from "./languageConstants";

export const setEnglish = () => {
    return {
        type: types.SET_ENGLISH
    };
};

export const setNotEnglish = () => {
    return {
        type: types.SET_NOT_ENGLISH,
    };
};
