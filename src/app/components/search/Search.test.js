import React from "react";
import { WrapperComponent } from "../../utilities/tests/test-utils";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import Search from "./Search";

const defaultProps = { saveSearch: jest.fn() };

describe("Search", () => {
    it("matches the snapshot", () => {
        const tree = renderer.create(
            <WrapperComponent>
                <Search {...defaultProps} />
            </WrapperComponent>
        );
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("updates value on change", () => {
        render(
            <WrapperComponent>
                <Search {...defaultProps} />
            </WrapperComponent>
        );
        const searchInput = screen.getByPlaceholderText("Search for a collection name");

        userEvent.paste(searchInput, "Boo");
        expect(searchInput).toHaveValue("Boo");
        expect(defaultProps.saveSearch).toHaveBeenCalledWith("Boo");
    });
});
