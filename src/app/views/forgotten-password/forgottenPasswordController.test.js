import { mount } from "enzyme";
import { forgottenPasswordController } from "../forgotten-password/forgottenPasswordController";
import React from "react";

test("", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        isAuthenticated: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find("h1").text()).toBe("Sign in to your Florence account");
});
