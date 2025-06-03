import React from "react";
import Banner from "./Banner";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const defaultProps = {
    data: {},
    handleBannerSave: jest.fn(),
};

const props = {
    data: {
        title: "Test Title",
        type: "local_emergency",
        description: "My emergency description",
        uri: "https://www.test.com/",
        linkText: "Read more",
    },
    handleBannerSave: jest.fn(),
};

describe("Banner", () => {
    describe("when no props are passed", () => {
        it("matches the snapshot", () => {
            const wrapper = renderer.create(<Banner {...defaultProps} />);
            expect(wrapper.toJSON()).toMatchSnapshot();
        });

        it("shows Banner form when Add an Emergency Banner button is clicked ", () => {
            render(<Banner data={{}} handleBannerSave={jest.fn()} />);
            const addButton = screen.getByText("Add an Emergency Banner");

            userEvent.click(addButton);

            expect(screen.queryByRole("button", { name: "Add an Emergency Banner" })).not.toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByLabelText("Type")).toBeInTheDocument();
            expect(screen.getByLabelText("Description")).toBeInTheDocument();
            expect(screen.getByLabelText("Link text")).toBeInTheDocument();
            expect(screen.getByLabelText("Link url")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save emergency banner" })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Cancel" })).toBeInTheDocument();
        });

        it("hides Banner form when Cancel button is clicked ", () => {
            render(<Banner {...defaultProps} />);
            const addButton = screen.getByText("Add an Emergency Banner");

            userEvent.click(addButton);

            expect(addButton).not.toBeInTheDocument();

            userEvent.click(screen.getByRole("button", { name: "Cancel" }));

            expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Save emergency banner" })).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Add an Emergency Banner" })).toBeInTheDocument();
        });

        it("does not hide Banner form when Save button is clicked if validation fails", () => {
            render(<Banner {...defaultProps} />);

            userEvent.click(screen.getByText("Add an Emergency Banner"));

            expect(screen.queryByRole("button", { name: "Add an Emergency Banner" })).not.toBeInTheDocument();

            userEvent.click(screen.getByRole("button", { name: "Save emergency banner" }));

            expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save emergency banner" })).toBeDisabled();
            expect(screen.getByText("Type is required")).toBeVisible();
            expect(screen.getByText("Description is required")).toBeVisible();
            expect(screen.getByText("Title is required")).toBeVisible();
        });
    });

    describe("when it has values filled in", () => {
        it("matches the snapshot", () => {
            const wrapper = renderer.create(<Banner {...props} />);
            expect(wrapper.toJSON()).toMatchSnapshot();
        });

        it("shows Banner form with data when Edit button is clicked", () => {
            render(<Banner {...props} />);

            expect(screen.queryByRole("button", { name: "Add an Emergency Banner" })).not.toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Title");
            expect(screen.getByTestId("banner")).toHaveClass("banner margin-top--1 local_emergency", { exact: true });
            expect(screen.getByTestId("description")).toHaveTextContent("My emergency description");
            expect(screen.getByTestId("description")).toHaveTextContent("My emergency description");
            expect(screen.getByTestId("description")).toHaveTextContent("My emergency description");
            expect(screen.getByText("Read more").closest("a")).toHaveAttribute("href", "https://www.test.com/");

            userEvent.click(screen.getByText("Edit"));

            expect(screen.getByLabelText("Title")).toHaveValue("Test Title");
            expect(screen.getByLabelText("Type")).toHaveValue("local_emergency");
            expect(screen.getByLabelText("Description")).toHaveValue("My emergency description");
            expect(screen.getByLabelText("Link text")).toHaveValue("Read more");
            expect(screen.getByLabelText("Link url")).toHaveValue("https://www.test.com/");

            userEvent.selectOptions(screen.getByLabelText("Type"), ["national_emergency"]);

            expect(screen.queryByTestId("banner")).not.toBeInTheDocument();
            expect(screen.getByLabelText("Type")).toHaveValue("national_emergency");
        });

        it("doesn't change values and hides Banner form when Cancel button is clicked", () => {
            render(<Banner {...props} />);

            expect(screen.queryByRole("button", { name: "Add an Emergency Banner" })).not.toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Title");
            expect(screen.getByTestId("banner")).toHaveClass("banner margin-top--1 local_emergency", { exact: true });
            expect(screen.getByTestId("description")).toHaveTextContent("My emergency description");

            userEvent.click(screen.getByText("Edit"));

            expect(screen.getByLabelText("Title")).toHaveValue("Test Title");
            expect(screen.getByLabelText("Type")).toHaveValue("local_emergency");
            expect(screen.getByLabelText("Description")).toHaveValue("My emergency description");
            expect(screen.getByLabelText("Link text")).toHaveValue("Read more");
            expect(screen.getByLabelText("Link url")).toHaveValue("https://www.test.com/");

            userEvent.click(screen.getByRole("button", { name: "Cancel" }));

            expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Title");
        });

        it("allows edit existing banner values", () => {
            render(<Banner {...props} />);

            expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Title");
            expect(screen.getByTestId("banner")).toHaveClass("banner margin-top--1 local_emergency", { exact: true });
            expect(screen.getByTestId("description")).toHaveTextContent("My emergency description");

            userEvent.click(screen.getByText("Edit"));

            expect(screen.queryByTestId("banner")).not.toBeInTheDocument();
            expect(screen.getByLabelText("Type")).toHaveValue("local_emergency");
            expect(screen.getByLabelText("Title")).toHaveValue("Test Title");
            expect(screen.getByLabelText("Description")).toHaveValue("My emergency description");

            userEvent.paste(screen.getByLabelText("Title"), "Boo");
            userEvent.selectOptions(screen.getByLabelText("Type"), ["national_emergency"]);
            userEvent.paste(screen.getByLabelText("Description"), "Foo");

            expect(screen.queryByLabelText("Title")).toHaveValue("Test TitleBoo");
            expect(screen.queryByLabelText("Type")).toHaveValue("national_emergency");
            expect(screen.queryByLabelText("Description")).toHaveValue("My emergency descriptionFoo");

            userEvent.click(screen.getByRole("button", { name: "Save emergency banner" }));

            expect(props.handleBannerSave).toBeCalledWith({
                description: "My emergency descriptionFoo",
                linkText: "Read more",
                title: "Test TitleBoo",
                type: "national_emergency",
                uri: "https://www.test.com/",
            });
        });

        it("allows delete banner", () => {
            render(<Banner {...props} />);

            expect(screen.queryByRole("button", { name: "Add an Emergency Banner" })).not.toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Title");
            expect(screen.getByTestId("banner")).toHaveClass("banner margin-top--1 local_emergency", { exact: true });
            expect(screen.getByTestId("description")).toHaveTextContent("My emergency description");

            userEvent.click(screen.getByText("Delete"));

            expect(props.handleBannerSave).toBeCalledWith({});
        });

        it("validates values filled in the Banner Form", () => {
            render(<Banner {...props} />);

            expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Title");
            expect(screen.getByTestId("banner")).toHaveClass("banner margin-top--1 local_emergency", { exact: true });
            expect(screen.getByTestId("description")).toHaveTextContent("My emergency description");

            userEvent.click(screen.getByText("Edit"));

            expect(screen.queryByTestId("banner")).not.toBeInTheDocument();
            expect(screen.getByLabelText("Type")).toHaveValue("local_emergency");
            expect(screen.getByLabelText("Title")).toHaveValue("Test Title");
            expect(screen.getByLabelText("Description")).toHaveValue("My emergency description");

            userEvent.clear(screen.getByLabelText("Title"));
            userEvent.clear(screen.getByLabelText("Description"));
            userEvent.clear(screen.getByLabelText("Link text"));
            userEvent.selectOptions(screen.getByLabelText("Type"), "Select an option");

            expect(screen.queryByLabelText("Title")).toHaveValue("");
            expect(screen.queryByLabelText("Description")).toHaveValue("");
            expect(screen.queryByLabelText("Type")).toHaveValue("");

            userEvent.click(screen.getByText("Save emergency banner"));

            expect(screen.getByText("Title is required")).toBeInTheDocument();
            expect(screen.getByText("Description is required")).toBeInTheDocument();
            expect(screen.getByText("Type is required")).toBeInTheDocument();
            expect(screen.getByText("Link text is required")).toBeInTheDocument();
            expect(screen.queryByText("Link url is required")).not.toBeInTheDocument();
        });

        it("allows leave link and url empty when both are not filled in", () => {
            const data = {
                title: "My Title",
                type: "national_emergency",
                description: "My description",
            };
            render(<Banner data={data} handleBannerSave={jest.fn()} />);

            userEvent.click(screen.getByText("Edit"));

            expect(screen.getByLabelText("Link text")).toHaveValue("");
            expect(screen.getByLabelText("Link url")).toHaveValue("");

            userEvent.click(screen.getByRole("button", { name: "Save emergency banner" }));

            expect(screen.getByTestId("banner")).toHaveClass("banner margin-top--1 national_emergency");
            expect(screen.getByTestId("description")).toHaveTextContent("My description");
            expect(screen.queryByText("Link text is required")).not.toBeInTheDocument();
            expect(screen.queryByText("Link url is required")).not.toBeInTheDocument();
            expect(screen.getByText("Edit")).toBeInTheDocument();
            expect(screen.getByText("Delete")).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Save emergency banner" })).not.toBeInTheDocument();
        });

        it("requires link text to be valid if link url is filled in", () => {
            const data = {
                title: "My Title",
                type: "national_emergency",
                description: "My description",
            };
            render(<Banner data={data} handleBannerSave={jest.fn()} />);

            userEvent.click(screen.getByText("Edit"));
            userEvent.paste(screen.getByLabelText("Link text"), "My link text");

            expect(screen.getByLabelText("Link text")).toHaveValue("My link text");
            expect(screen.getByLabelText("Link url")).toHaveValue("");

            userEvent.click(screen.getByRole("button", { name: "Save emergency banner" }));

            expect(screen.queryByText("Link url is required")).toBeInTheDocument();
        });

        it("requires link url to be valid if link text is filled in", () => {
            const data = {
                title: "My Title",
                type: "national_emergency",
                description: "My description",
            };
            render(<Banner data={data} handleBannerSave={jest.fn()} />);

            userEvent.click(screen.getByText("Edit"));

            userEvent.paste(screen.getByLabelText("Link url"), "http://www.boo.net");

            expect(screen.getByLabelText("Link text")).toHaveValue("");
            expect(screen.getByLabelText("Link url")).toHaveValue("http://www.boo.net");

            userEvent.click(screen.getByRole("button", { name: "Save emergency banner" }));

            expect(props.handleBannerSave).toBeCalledWith({
                description: "My emergency descriptionFoo",
                linkText: "Read more",
                title: "Test TitleBoo",
                type: "national_emergency",
                uri: "https://www.test.com/",
            });
            expect(screen.queryByText("Link text is required")).toBeInTheDocument();
        });
    });
});
