import * as types from "./languageConstants";

const initialState = {
    previewLanguage: "en",
};

const languageReducer = (state = initialState, action) => {
    console.log("action", action);
    switch (action.type) {
        case types.SET_PREVIEW_LANGUAGE:
            return {
                ...state,
                previewLanguage: action.language,
            };
        default: {
            return state;
        }
    }
};

export default languageReducer;
