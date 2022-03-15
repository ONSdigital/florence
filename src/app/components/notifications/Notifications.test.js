import React from "react";
import Notifications from "./Notifications";
import NotificationItem from "./NotificationItem.jsx";
import { shallow } from "enzyme";

describe("Notifications", () => {
    describe("when no notifications props", () => {
        it("do not render", () => {
            const component = shallow(<Notifications notifications={[]} />);
            expect(component.isEmptyRender()).toBe(true);
        });
    });

    describe("when notifications props are passed", () => {
        const notifications = [
            {
                type: "neutral",
                message: "message 1",
                id: "1",
            },
            {
                type: "neutral",
                message: "message 2",
                id: "2",
            },
        ];

        const component = shallow(<Notifications notifications={notifications} />);

        it("it renders NotificationItem", () => {
            expect(component.find("ul").hasClass("notifications")).toBe(true);
            expect(component.find(NotificationItem)).toHaveLength(notifications.length);
        });
    });
});
