import React from "react";
import renderer from "react-test-renderer";
import { render, screen } from "../../utilities/tests/test-utils";
import EditGroup from "./EditGroup";
import "@testing-library/jest-dom/extend-expect";

const groups = [
    {
        creation_date: "2021-10-12T14:32:50.913Z",
        description: "foo",
        group_name: "104ea95f-dcf2-4e36-81cc-bbf840b6ee10",
        last_modified_date: "2021-10-12T14:32:50.913Z",
        precedence: 19,
        role_arn: null,
        user_pool_id: "bar",
    },
    {
        creation_date: "2021-09-14T12:57:50.913Z",
        description: "baz",
        group_name: "45a6c8ed-2494-4e68-89ce-0ca504dc020a",
        last_modified_date: "2021-10-12T12:57:50.238Z",
        precedence: 19,
        role_arn: null,
        user_pool_id: "bar",
    },
];
const defaultProps = {
    groups: [],
    loadTeams: jest.fn(),
};

describe("EditGroup", () => {
    it("matches the snapshot", () => {
        const wrapper = renderer.create(<EditGroup {...defaultProps} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it("requests all teams on load", () => {
        render(<EditGroup {...defaultProps} />);
        expect(defaultProps.loadTeams).toHaveBeenCalled();
    });

    it("shows Back Button", () => {
        render(<EditGroup {...defaultProps} />);
        expect(screen.getByText(/Back/i)).toBeInTheDocument();
    });

    it("shows, message if no teams found", () => {
        render(<EditGroup {...defaultProps} />);
        expect(screen.getByText(/Nothing to show/i)).toBeInTheDocument();
    });
    it("shows, creation option and search option", () => {
        render(<EditGroup {...defaultProps} />);
        expect(screen.getByText("Create a new team")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name or ID")).toHaveValue("");
    });
    it("shows list of teams details", () => {
        const props = { ...defaultProps, groups: groups };
        render(<EditGroup {...props} />);

        expect(screen.getByText(/Back/i)).toBeInTheDocument();
        expect(screen.getByText("Preview teams")).toBeInTheDocument();
        expect(screen.getByText("foo")).toBeInTheDocument();
        expect(screen.getByText("baz")).toBeInTheDocument();
        expect(screen.getByText("12 October 2021 at 15:32")).toBeInTheDocument();
        expect(screen.getByText("14 September 2021 at 13:57")).toBeInTheDocument();
    });
});
