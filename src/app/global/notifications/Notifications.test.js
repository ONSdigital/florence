import React from "react";
import Notifications from "./Notifications";
import { mount } from "enzyme";

test("Editing a notifications prop updates the number of notifications displayed", () => {
    const notifications = [
        {
            type: "neutral",
            message: "message 1",
            id: "1"
        },
        {
            type: "neutral",
            message: "message 2",
            id: "2"
        }
    ];
    const component = mount(<Notifications notifications={notifications} />);
    expect(component.find("li").length).toBe(2);
    component.setProps({
        notifications: [
            ...notifications,
            {
                type: "warning",
                message: "Message 3",
                id: "3"
            }
        ]
    });
    expect(component.find("li").length).toBe(3);
    component.setProps({
        notifications: notifications.slice(0, 1)
    });
    expect(component.find("li").length).toBe(1);
});

test("Button renders and onClick event calls back to caller", () => {
    let hasClickedButton = false;
    const notifications = [
        {
            type: "neutral",
            message: "Message 1",
            id: "1",
            buttons: [
                {
                    text: "Close",
                    onClick: function() {
                        hasClickedButton = true;
                    }
                }
            ]
        },
        {
            type: "neutral",
            message: "Message 2",
            id: "2"
        }
    ];
    const component = mount(<Notifications notifications={notifications} />);
    expect(hasClickedButton).toBe(false);
    component.find("li button").simulate("click");
    expect(hasClickedButton).toBe(true);
});
