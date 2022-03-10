import React from "react";
import renderer from "react-test-renderer";
import { render, screen } from "../../utilities/tests/test-utils";
import Groups from "./Groups";
import "@testing-library/jest-dom/extend-expect";
import { groups } from "../../utilities/tests/mockData";

const defaultProps = {
    groups: [],
    loadTeams: jest.fn(),
};

describe("Groups", () => {
    it("matches the snapshot", () => {
        const wrapper = renderer.create(<Groups {...defaultProps} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it("requests all teams on load", () => {
        render(<Groups {...defaultProps} />);
        expect(defaultProps.loadTeams).toHaveBeenCalled();
    });

    it("shows Back Button", () => {
        render(<Groups {...defaultProps} />);
        expect(screen.getByText(/Back/i)).toBeInTheDocument();
    });

    it("shows, message if no teams found", () => {
        render(<Groups {...defaultProps} />);
        expect(screen.getByText(/Nothing to show/i)).toBeInTheDocument();
    });
    it("shows, creation option and search option", () => {
        render(<Groups {...defaultProps} />);
        expect(screen.getByText("Create a new team")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name or ID")).toHaveValue("");
    });
    it("shows list of teams details", () => {
        const props = { ...defaultProps, groups: groups };
        render(<Groups {...props} />);

        expect(screen.getByText(/Back/i)).toBeInTheDocument();
        expect(screen.getByText(/Preview teams/i)).toBeInTheDocument();
        expect(screen.getByText(/my first test group description/i)).toBeInTheDocument();
        expect(screen.getByText(/my test group description/i)).toBeInTheDocument();
        expect(screen.getByText(/admins group description/i)).toBeInTheDocument();
    });
});
