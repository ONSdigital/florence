import React from "react";
import Banner from "./Banner";
import renderer from "react-test-renderer";
import { render, screen, getByRole, queryByRole, queryByText } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

describe("Banner", () => {
    describe("when no props are passed", () => {
        test("matches the snapshot", () => {
            const wrapper = renderer.create(<Banner data={{}} handleBannerSave={jest.fn()} />);
            expect(wrapper.toJSON()).toMatchSnapshot();
        });

        test("shows Banner form when Add an Emergency Banner button is clicked ", () => {
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

        test("hides Banner form when Cancel button is clicked ", () => {
            render(<Banner data={{}} handleBannerSave={jest.fn()} />);
            const addButton = screen.getByText("Add an Emergency Banner");

            userEvent.click(addButton);

            expect(addButton).not.toBeInTheDocument();

            userEvent.click(screen.getByRole("button", { name: "Cancel" }));

            expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Save emergency banner" })).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Add an Emergency Banner" })).toBeInTheDocument();
        });

        test("does not hide Banner form when Save button is clicked if validation fails", () => {
            render(<Banner data={{}} handleBannerSave={jest.fn()} />);

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

        test("matches the snapshot", () => {
            const wrapper = renderer.create(<Banner {...props} />);
            expect(wrapper.toJSON()).toMatchSnapshot();
        });

        test("shows Banner form with data when Edit button is clicked", () => {
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

        test("doesn't change values and hides Banner form when Cancel button is clicked", () => {
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

        test("allows edit existing banner values", async () => {
            const handleBannerSave = jest.fn(() => {
                /*do nothing*/
            });
            render(<Banner {...props} handleBannerSave={handleBannerSave} />);

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

            await expect(screen.queryByLabelText("Title")).toHaveValue("Test TitleBoo");
            await expect(screen.queryByLabelText("Type")).toHaveValue("national_emergency");
            await expect(screen.queryByLabelText("Description")).toHaveValue("My emergency descriptionFoo");

            userEvent.click(screen.getByRole("button", { name: "Save emergency banner" }));

            expect(handleBannerSave).toBeCalledWith({
                description: "My emergency descriptionFoo",
                linkText: "Read more",
                title: "Test TitleBoo",
                type: "national_emergency",
                uri: "https://www.test.com/",
            });
        });

        test("allows delete banner", async () => {
            const handleBannerSave = jest.fn(() => {
                /*do nothing*/
            });
            render(<Banner {...props} handleBannerSave={handleBannerSave} />);

            expect(screen.queryByRole("button", { name: "Add an Emergency Banner" })).not.toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Title");
            expect(screen.getByTestId("banner")).toHaveClass("banner margin-top--1 local_emergency", { exact: true });
            expect(screen.getByTestId("description")).toHaveTextContent("My emergency description");

            userEvent.click(screen.getByText("Delete"));

            expect(handleBannerSave).toBeCalledWith({});
        });

        test("validates values filled in the Banner Form", () => {
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

        test("allows leave link and url empty when both are not filled in", () => {
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

        test("requires link text to be valid if link url is filled in", () => {
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

        test("requires link url to be valid if link text is filled in", () => {
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

            expect(screen.queryByText("Link text is required")).toBeInTheDocument();
        });
    });
});
