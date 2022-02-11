import React from "react";
import renderer from "react-test-renderer";
import { render, screen, createMockUser, within } from "../../utilities/tests/test-utils";
import UserDetails from "./UserDetails";

const defaultProps = {
    user: {
        active: true,
        email: "anna.emson@ons.gov.uk",
        forename: "Anna",
        groups: [],
        id: "anna.emson@ons.gov.uk",
        lastname: "Emson",
        status: "CONFIRMED",
        status_notes: "",
    },
    loading: false,
};

describe("UserShow", () => {
    xit("matches the snapshot", () => {
        const wrapper = renderer.create(<UserDetails {...defaultProps} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });
    xit("shows spinner when loading user data", () => {
        const props = {
            user: null,
            isLoading: true,
        };
    });
    xit("shows user details", () => {
        render(<UserDetails {...defaultProps} />);
        expect(screen.getByText(/Back/i)).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Anna Emson/i);
        expect(screen.getByText("anna.emson@ons.gov.uk")).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("anna.emson@ons.gov.uk");
        expect(screen.getByText(/Save changes/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });
});
