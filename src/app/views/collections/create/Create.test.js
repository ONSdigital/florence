import React from "react";
import { render, screen, getByRole, queryByRole, queryByText } from "@testing-library/react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Create from "./Create";

const defaultProps = {
    collections: [],
    createCollectionRequest: jest.fn(),
    fetchingTeams: false,
    loadTeams: jest.fn(),
    teams: [],
    user: {
        userType: "ADMIN",
    },
};

describe("Create", () => {
    describe("when no teams are available", () => {
        it("matches the snapshot", () => {
            const tree = renderer.create(<Create {...defaultProps} />);
            expect(tree.toJSON()).toMatchSnapshot();
        });

        it("shows the form with default values", () => {
            render(<Create {...defaultProps} />);
            expect(screen.getByLabelText("Collection name")).toHaveValue("");
            expect(screen.getByLabelText("Select a team(s) that can view this collection")).toHaveValue("Select an option");

            expect(screen.getByRole("group", { name: "Publish type" })).toBeInTheDocument();
            expect(screen.getByLabelText("Scheduled publish")).toBeChecked();
            expect(screen.getByLabelText("Manual publish")).not.toBeChecked();

            expect(screen.getByRole("group", { name: "Schedule type" })).toBeInTheDocument();
            expect(screen.getByLabelText("Custom schedule")).toBeChecked();
            expect(screen.getByLabelText("Calendar entry schedule")).not.toBeChecked();

            expect(screen.getByLabelText("Publish date")).toHaveValue("");
            expect(screen.getByLabelText("Publish time")).toHaveValue("09:30");
            expect(screen.getByRole("button", { name: "Create collection" })).toBeInTheDocument();
        });

        it("allows adding collection name", () => {
            render(<Create {...defaultProps} />);

            expect(screen.getByLabelText("Collection name")).toHaveValue("");

            userEvent.paste(screen.getByLabelText("Collection name"), "My test");

            expect(screen.queryByLabelText("Collection name")).toHaveValue("My test");
        });

        it("validates collection name if not empty", () => {
            render(<Create {...defaultProps} />);

            expect(screen.getByLabelText("Collection name")).toHaveValue("");
            expect(screen.queryByText("Collections must be given a name.")).not.toBeInTheDocument();

            userEvent.click(screen.getByText("Create collection"));

            expect(screen.queryByText("Collections must be given a name.")).toBeInTheDocument();
        });

        it("validates collection name for special characters", () => {
            render(<Create {...defaultProps} />);

            expect(screen.getByLabelText("Collection name")).toHaveValue("");
            expect(screen.queryByText("Collection names can only contain letters and numbers. (!) are not allowed")).not.toBeInTheDocument();

            userEvent.paste(screen.getByLabelText("Collection name"), "My test!");
            expect(screen.getByLabelText("Collection name")).toHaveValue("My test!");

            userEvent.click(screen.getByText("Create collection"));
            expect(screen.queryByText("Collection names can only contain letters and numbers. (!) are not allowed.")).toBeInTheDocument();
        });

        it("validates collection name to be unique", () => {
            const props = {
                ...defaultProps,
                collections: [{ name: "My Test" }, { name: "My Test - 1" }],
            };
            render(<Create {...props} />);
            expect(screen.getByLabelText("Collection name")).toHaveValue("");

            userEvent.paste(screen.getByLabelText("Collection name"), "My test");
            expect(screen.queryByLabelText("Collection name")).toHaveValue("My test");

            userEvent.click(screen.getByText("Create collection"));
            expect(screen.queryByText("A collection with this name already exists.")).not.toBeInTheDocument();
        });

        it("allows changing collection Publish type", () => {
            render(<Create {...defaultProps} />);

            expect(screen.getByLabelText("Scheduled publish")).toBeChecked();
            expect(screen.getByLabelText("Manual publish")).not.toBeChecked();

            userEvent.click(screen.getByLabelText("Manual publish"));

            expect(screen.getByLabelText("Scheduled publish")).not.toBeChecked();
            expect(screen.getByLabelText("Manual publish")).toBeChecked();

            userEvent.click(screen.getByLabelText("Scheduled publish"));

            expect(screen.getByLabelText("Scheduled publish")).toBeChecked();
            expect(screen.getByLabelText("Manual publish")).not.toBeChecked();
        });

        it("allows changing collection Schedule type", () => {
            render(<Create {...defaultProps} />);

            expect(screen.getByLabelText("Custom schedule")).toBeChecked();
            expect(screen.getByLabelText("Calendar entry schedule")).not.toBeChecked();

            userEvent.click(screen.getByLabelText("Calendar entry schedule"));

            expect(screen.getByLabelText("Custom schedule")).not.toBeChecked();
            expect(screen.getByLabelText("Calendar entry schedule")).toBeChecked();

            userEvent.click(screen.getByLabelText("Custom schedule"));

            expect(screen.getByLabelText("Custom schedule")).toBeChecked();
            expect(screen.getByLabelText("Calendar entry schedule")).not.toBeChecked();
        });

        it("allows adding Publish date", () => {
            render(<Create {...defaultProps} />);

            expect(screen.getByLabelText("Publish date")).toHaveValue("");

            userEvent.paste(screen.getByLabelText("Publish date"), "2022-10-12");
            expect(screen.getByLabelText("Publish date")).toHaveValue("2022-10-12");
        });

        it("validates date", () => {
            render(<Create {...defaultProps} />);

            expect(screen.queryByText("Scheduled collections must be given a publish date.")).not.toBeInTheDocument();
            expect(screen.getByLabelText("Scheduled publish")).toBeChecked();
            expect(screen.getByLabelText("Manual publish")).not.toBeChecked();

            userEvent.click(screen.getByRole("button", { name: "Create collection" }));
            expect(screen.queryByText("Scheduled collections must be given a publish date.")).toBeInTheDocument();
        });

        it("allows adding Publish time", () => {
            render(<Create {...defaultProps} />);

            expect(screen.getByLabelText("Publish time")).toHaveValue("09:30");

            userEvent.paste(screen.getByLabelText("Publish time"), "12:00");
            expect(screen.getByLabelText("Publish time")).toHaveValue("12:00");
        });
    });

    describe("when there are teams available", () => {
        it("allows adding teams that can view this collection", () => {
            const initialState = {};
            const props = {
                ...defaultProps,
                teams: [
                    { id: "1", name: "Team1" },
                    { id: "2", name: "Team2" },
                ],
            };
            render(<Create {...props} />, { initialState });

            expect(screen.getByLabelText("Select a team(s) that can view this collection")).toHaveValue("Select an option");
            expect(screen.getByRole("option", { name: "Team1" })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "Team2" })).toBeInTheDocument();
            expect(screen.getByText("Select an option").selected).toBe(true);

            userEvent.click(screen.getByText("Team1"), [1]);

            expect(screen.queryByText("Team1")).toBeInTheDocument();
            expect(screen.getByText("Select an option").selected).toBe(true);
            expect(screen.queryByText("Select an option").selected).toBe(true);
        });
    });
});
