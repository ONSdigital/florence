import * as types from "./languageConstants";

const initialState = {
    language: "en",
};

const languageReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_LANGUAGE: {
            return {
                ...state,
                language: action.language,
            };
        }
        default: {
            return state;
        }
    }
};

export default languageReducer;
