import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "../app/config/reducer";

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
  const store = createStore(reducer);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export function HookWrapper(props) {
  const hook = props.hook ? props.hook() : undefined;
  return <div hook={hook} />;
}
