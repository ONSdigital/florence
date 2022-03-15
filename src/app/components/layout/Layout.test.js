import React from "react";
import { shallow } from "enzyme";
import Layout from "./Layout";

describe("Layout", () => {
    const props = {
        params: [],
    };
    const wrapper = shallow(<Layout {...props} />);

    it("renders <NavBar /> component", () => {
        expect(wrapper.find("Connect(NavBar)")).toHaveLength(1);
    });

    describe("when notification props are not passed", () => {
        it("renders <Notifications /> component", () => {
            expect(wrapper.find("Notifications")).toHaveLength(0);
        });
    });

    describe("when notifications props are passed", () => {
        const props = {
            notifications: [
                {
                    id: "123",
                    message: "Test",
                    type: "positive",
                },
            ],
        };
        const wrapper = shallow(<Layout {...props} />);

        it("renders <Notifications /> component with props", () => {
            const notifications = wrapper.find("Notifications");

            expect(notifications).toHaveLength(1);
            expect(notifications.props()).toEqual({
                notifications: [{ id: "123", message: "Test", type: "positive" }],
            });
        });
    });
});
