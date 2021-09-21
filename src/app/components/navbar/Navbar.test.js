import React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router";
import Navbar from "./Navbar"

jest.mock("../../utilities/logging/log", () => {
    return {
        event: function() {
            // do nothing
        }
    };
});

jest.mock("../../utilities/url", () => ({
    resolve: url => `/florence${url}`
}));

jest.mock("../../utilities/auth", () => ({
    isAuthenticated: jest.fn(() => true),
    isAdminOrEditor: jest.fn(() => true)
}));

let dispatchedActions = [];

const defaultProps = {
    config: {
        enableDatasetImport: false
    },
    user: {},
    rootPath: "/florence",
    location: {},
    dispatch: action => dispatchedActions.push(action)
};

describe("Dataset import functionality", () => {
    it("displays the dataset upload tab when enabled in global config", () => {
        const props = {
            ...defaultProps,
            config: {
                ...defaultProps.config,
                enableDatasetImport: true
            }
        };

        const component = shallow(<Navbar {...props} />);
        expect(component.find("Link[to='/florence/uploads/data']").exists()).toBe(true);
    });

    it("doesn't display the dataset upload tab when disabled in global config", () => {
        const props = {
            ...defaultProps,
            config: {
                ...defaultProps.config,
                enableDatasetImport: false
            }
        };
        const component = shallow(<Navbar {...props} />);
        expect(component.find("Link[to='/florence/uploads/data']").exists()).toBe(false);
    });
});
