import * as types from "./languageConstants";

export const setPreviewLanguage = language => {
    return {
        type: types.SET_PREVIEW_LANGUAGE,
        language,
    };
};
