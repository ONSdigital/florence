import React from "react";
import renderer from "react-test-renderer";
import { render, screen, createMockUser, within } from "../../../utilities/tests/test-utils";
import AddGroupsToUser from "./AddGroupsToUser";

const defaultProps = {
    groups: [],
    loading: false,
};

describe("AddGroupsToUser", () => {
    xit("matches the snapshot", () => {
        const wrapper = renderer.create(<AddGroupsToUser {...defaultProps} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });
    xit("shows spinner when loading user data", () => {
        const props = {
            user: null,
            isLoading: true,
        };
    });
    xit("shows user details", () => {
        render(<AddGroupsToUser {...defaultProps} />);
        expect(screen.getByText(/Back/i)).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Anna Emson/i);
        expect(screen.getByText("anna.emson@ons.gov.uk")).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("anna.emson@ons.gov.uk");
        expect(screen.getByText(/Save changes/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });
});
