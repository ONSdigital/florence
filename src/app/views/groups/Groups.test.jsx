import React from "react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import { render, screen, createMockUser } from "../../utilities/tests/test-utils";
import Groups from "./Groups";
import "@testing-library/jest-dom/extend-expect";
import { mappedSortedGroups } from "../../utilities/tests/mockData";

const admin = createMockUser("admin@test.com", true, true, "ADMIN");
const editor = createMockUser("editor@test.com", false, true, "EDITOR");
const defaultProps = {
    groups: [],
    loadTeams: jest.fn(),
    isNewSignIn: true,
    isLoading: false,
    loggedInUser: admin,
};

describe("Groups", () => {
    it("matches the snapshot with empty props", () => {
        const wrapper = renderer.create(<Groups {...defaultProps} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it("matches the snapshot with groups props", () => {
        const props = { ...defaultProps, groups: mappedSortedGroups };
        const wrapper = renderer.create(<Groups {...props} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it("requests all teams on load", () => {
        render(<Groups {...defaultProps} />);
        expect(defaultProps.loadTeams).toHaveBeenCalledWith(true);
    });

    it("shows, message if no teams found", () => {
        render(<Groups {...defaultProps} />);
        expect(screen.getByText(/Nothing to show/i)).toBeInTheDocument();
    });

    it("shows, create button and search input", () => {
        render(<Groups {...defaultProps} />);
        expect(screen.getByText("Create a new team")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
    });

    it("shows list of teams details", () => {
        const props = { ...defaultProps, groups: mappedSortedGroups };
        render(<Groups {...props} />);

        expect(screen.getByText(/Preview teams/i)).toBeInTheDocument();
        expect(screen.getByText(/Hello Group/i)).toBeInTheDocument();
        expect(screen.getByText(/Test/i)).toBeInTheDocument();
        expect(screen.getByText(/This team has 5 members/i)).toBeInTheDocument();
        expect(screen.getByText(/Admins/i)).toBeInTheDocument();
    });

    it("filters list of teams by search term", () => {
        const getFilteredGroups = jest.fn();
        const props = { ...defaultProps, groups: mappedSortedGroups };

        render(<Groups {...props} />);

        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");

        userEvent.paste(screen.getByPlaceholderText(/Search teams by name/i), "Admin");
        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("Admin");

        expect(screen.getByText(/Admins/i)).toBeInTheDocument();

        expect(screen.queryByText(/Hello Group/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Test/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/This team has 5 members/i)).not.toBeInTheDocument();
    });

    it("doesn't show the create new team button and teams report button if user is not an admin", () => {
        const newProps = {
            ...defaultProps,
            loggedInUser: editor,
        };
        render(<Groups {...newProps} />);

        expect(screen.queryByRole("link", { name: "Create new team" })).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
        expect(screen.queryByRole("button", { name: "Export teams report" })).not.toBeInTheDocument();
    });
});
