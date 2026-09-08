import React from "react";
import { MemoryRouter } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { createMemoryHistory } from "history";
import { connectRouter } from "connected-react-router";
import { Provider } from "react-redux";
import reducer from "../../config/reducer";
import userReducer from "../../config/user/userReducer";
import thunkMiddleware from "redux-thunk";
import { render as rtlRender } from "@testing-library/react";
import "@testing-library/jest-dom";

export function createMockUser(email = "", isAdmin = false, isAuthenticated = false, userType = "") {
    return {
        email,
        isAdmin,
        isAuthenticated,
        userType,
    };
}
//TODO: remove when/if tests migrated
export const WrapperComponent = ({ children }) => {
    const store = createStore(
        combineReducers({
            state: reducer,
            user: userReducer,
            router: connectRouter(createMemoryHistory()),
        }),
        applyMiddleware(thunkMiddleware)
    );
    return (
        <Provider store={store}>
            <MemoryRouter>{children}</MemoryRouter>
        </Provider>
    );
};

export function HookWrapper(props) {
    const hook = props.hook ? props.hook() : undefined;
    // eslint-disable-next-line react/no-unknown-property
    return <div hook={hook} />;
}

function render(
    ui,
    {
        store = createStore(
            combineReducers({
                state: reducer,
                user: userReducer,
                router: connectRouter(createMemoryHistory()),
            }),
            applyMiddleware(thunkMiddleware)
        ),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>;
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
