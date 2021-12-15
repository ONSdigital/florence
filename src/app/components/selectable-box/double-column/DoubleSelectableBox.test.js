import React from "react";
import { render, fireEvent, screen, getByText } from "@testing-library/react";
import { within } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import { items } from "../../../../tests/mockData";
import DoubleSelectableBox from "./DoubleSelectableBox";

const props = {
    headings: ["Header1", "Header2"],
    items,
    activeItemID: items[1].id,
    isUpdating: false,
    search: "baz",
    handleItemClick: jest.fn(),
};

describe("DoubleSelectableBox", () => {
    it("matches the snapshot", () => {
        const component = renderer.create(<DoubleSelectableBox {...props} />);
        expect(component.toJSON()).toMatchSnapshot();
    });

    describe("when there are no items", () => {
        test("displays search result message not generic inside the table if search phrase was passed", () => {
            const emptyProps = {
                ...props,
                items: [],
            };

            const { container } = render(<DoubleSelectableBox {...emptyProps} />);
            screen.getByText("Header1");
            screen.getByText("Header2");

            expect(container).not.toHaveTextContent("No items to display");

            screen.getByText("Cannot find collection");
            screen.getByText("Improve your results by:");
            screen.getByText("double-checking your spelling");
            screen.getByText("searching for something less specific");
        });

        test("displays generic message when no search phrase was passed", () => {
            const emptyProps = {
                ...props,
                search: "",
                items: [],
            };
            render(<DoubleSelectableBox {...emptyProps} />);

            screen.getByText("No items to display");
            expect(screen.findByText("Cannot find collection")).not.toBeInTheDocument;
            expect(screen.findByText("Bar")).not.toBeInTheDocument;
        });
    });

    describe("when there are items passed in props", () => {
        test("displays items in the table", () => {
            const { container } = render(<DoubleSelectableBox {...props} />);
            const items = container.getElementsByClassName("selectable-box__item");

            expect(items.length).toBe(3);
            expect(items[0]).toHaveTextContent("Bar");
            expect(items[0]).toHaveTextContent("Friday");
            expect(items[1]).toHaveTextContent("Baz");
            expect(items[1]).toHaveTextContent("[manual collection]");
            expect(items[2]).toHaveTextContent("Foo");
            expect(items[2]).toHaveTextContent("2021-12-17T09:30:00.000Z");

            expect(container).not.toHaveTextContent("No items to display");
            expect(container).not.toHaveTextContent("Cannot find collection");
        });
    });

    describe("when Name header is clicked", () => {
        test("updates active sort to DESC and back to ASC", () => {
            render(<DoubleSelectableBox {...props} />);

            const sortByNameBtn = screen.getByRole("button", { name: /sort by name/i });
            const ascending = within(sortByNameBtn).getByTestId("ASC");
            const descending = within(sortByNameBtn).getByTestId("DESC");

            // sort by name is active by default
            expect(ascending).toHaveClass("active");
            expect(descending).not.toHaveClass("active");

            fireEvent.click(sortByNameBtn);

            expect(ascending).not.toHaveClass("active");
            expect(descending).toHaveClass("active");

            fireEvent.click(sortByNameBtn);

            expect(ascending).toHaveClass("active");
            expect(descending).not.toHaveClass("active");
        });
    });

    describe("when Publish Date header is clicked", () => {
        test("updates active sort to ASC and back to DESC by publish date column", () => {
            render(<DoubleSelectableBox {...props} />);

            const sortByPublishNameBtn = screen.getByRole("button", { name: /sort by publishdate/i });
            const ascending = within(sortByPublishNameBtn).getByTestId("ASC");
            const descending = within(sortByPublishNameBtn).getByTestId("DESC");

            // sort by publish date is not active by default
            expect(ascending).not.toHaveClass("active");
            expect(descending).not.toHaveClass("active");

            fireEvent.click(sortByPublishNameBtn);

            expect(ascending).not.toHaveClass("active");
            expect(descending).toHaveClass("active");

            fireEvent.click(sortByPublishNameBtn);

            expect(descending).not.toHaveClass("active");
            expect(ascending).toHaveClass("active");
        });
    });
});
