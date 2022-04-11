import * as types from "./languageConstants";

const initialState = {
  isEnglish: true,
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ENGLISH:
      return {
        ...state,
        isEnglish: true,
    };
    case types.SET_NOT_ENGLISH:
      return {
        ...state,
        isEnglish: false,
    };
    default: {
        return state;
    }
  }
}

export default languageReducer;
