import React from "react";
import renderer from "react-test-renderer";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom/extend-expect";
import { group, specialGroup } from "../../../utilities/tests/mockData";
import EditGroup from "./EditGroup";

const props = {
    group: group,
    loadGroup: jest.fn(),
    loading: false,
    params: { id: "0", router: setRouteLeaveHook },
    rootPath: "test",
    router: { setRouteLeaveHook: jest.fn() },
    updateGroup: jest.fn(),
};

const setRouteLeaveHook = jest.fn();

describe("EditGroup", () => {
    it("matches the snapshot", () => {
        const tree = renderer.create(<EditGroup.WrappedComponent {...props} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("requests group on load by params", () => {
        render(<EditGroup.WrappedComponent {...props} />);
        expect(props.loadGroup).toHaveBeenCalledWith("0");
    });

    it("shows Back Button", () => {
        render(<EditGroup.WrappedComponent {...props} />);
        expect(screen.getByRole("link", { name: "Back" })).toBeInTheDocument();
    });

    it("shows message if no group has been found", () => {
        render(<EditGroup.WrappedComponent {...props} group={null} />);
        expect(screen.getByText("No group found.")).toBeInTheDocument();
    });

    it("shows loader when fetching group", () => {
        render(<EditGroup.WrappedComponent {...props} group={null} loading={true} />);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("shows group details and name input to edit", () => {
        render(<EditGroup.WrappedComponent {...props} />);
        expect(screen.getByRole("heading", { level: 1, name: "Boo is fine" })).toBeInTheDocument();
        expect(screen.getByLabelText("Name")).toHaveValue("Boo is fine");
        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.queryByText(/You have unsaved changes/i)).not.toBeInTheDocument();
    });

    describe("when editing normal group name", () => {
        it("validates for emptiness", () => {
            render(<EditGroup.WrappedComponent {...props} />);

            userEvent.clear(screen.getByLabelText(/name/i));

            expect(screen.getByLabelText("Name")).toHaveValue("");

            userEvent.click(screen.getByRole("button", { name: "Save changes" }));

            expect(screen.getByText(/Please enter a name/i)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
        });

        it("validates for emptiness", () => {
            render(<EditGroup.WrappedComponent {...props} />);

            userEvent.clear(screen.getByLabelText(/name/i));
            userEvent.paste(screen.getByLabelText(/name/i), "Foo");

            expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
            expect(screen.getByLabelText("Name")).toHaveValue("Foo");

            userEvent.click(screen.getByRole("button", { name: "Save changes" }));

            expect(props.updateGroup).toHaveBeenCalledWith("0", { name: "Foo", precedence: 10 });
        });
    });
    describe("when special group ", () => {
        it("shows details but do not allow to change the name", () => {
            render(<EditGroup.WrappedComponent {...props} group={specialGroup} />);

            expect(screen.getByRole("heading", { level: 1, name: "Admins" })).toBeInTheDocument();
            expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
            expect(screen.queryByText(/You have unsaved changes/i)).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
        });
    });
});
