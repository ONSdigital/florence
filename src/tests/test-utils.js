import React from "react";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import reducer from "../app/config/reducer";
import thunkMiddleware from "redux-thunk";

export function createMockUser(
    email = "",
    isAdmin = false,
    isAuthenticated = false,
    userType = ""
) {
    return {
        email,
        isAdmin,
        isAuthenticated,
        userType
    };
}


export const WrapperComponent = ({children}) => {
    const store = createStore(reducer, applyMiddleware(thunkMiddleware));

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
