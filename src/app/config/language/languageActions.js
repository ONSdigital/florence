import * as types from "./languageConstants";

export const getLangauge = () => {
    return {
        type: types.GET_LANGUAGE,
    };
};

export const setLanguage = language => {
    return {
        type: types.SET_LANGUAGE,
        language: language,
    };
};
