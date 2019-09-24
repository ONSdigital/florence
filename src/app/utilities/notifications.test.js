import notifications from "./notifications";

let mockNotificationsState = [];

jest.mock("../config/store", () => ({
    store: {
        dispatch: jest.fn().mockImplementation(() => {
            // nothing needed here
        }),
        getState: jest.fn().mockImplementation(() => {
            return {
                state: {
                    notifications: mockNotificationsState
                }
            };
        })
    }
}));

jest.mock("./logging/log", () => {
    return {
        event: function() {
            // do nothing
        },
        data: function() {}
    };
});

jest.mock("../config/actions", () => ({
    addNotification: jest.fn().mockImplementation(notification => {
        mockNotificationsState.push(notification);
    }),
    removeNotification: jest.fn().mockImplementation(notificationID => {
        mockNotificationsState = mockNotificationsState.filter(notification => {
            return notification.id !== notificationID;
        });
    }),
    toggleNotificationVisibility: jest.fn().mockImplementation(notificationID => {
        mockNotificationsState = mockNotificationsState.map(notification => {
            if (notification.id === notificationID) {
                notification.isVisible = !notification.isVisible;
            }
            return notification;
        });
    })
}));

test("Auto dismiss configuration option automatically removes notification from state", () => {
    const mockNotifications = [
        {
            message: "Message 1"
        },
        {
            message: "Message 2",
            autoDismiss: 1000
        }
    ];
    jest.useFakeTimers();
    notifications.add(mockNotifications[0]);
    notifications.add(mockNotifications[1]);
    expect(mockNotificationsState.length).toBe(2);

    setTimeout(() => {
        expect(mockNotificationsState.length).toBe(1);
    }, 3000);
    jest.runAllTimers();

    mockNotificationsState = [];
});

test("Button to dismiss notification is added to config correctly and included by default", () => {
    const mockNotifications = [
        {
            message: "Message 1"
        },
        {
            message: "Message 2",
            isDismissable: false
        },
        {
            message: "Message 2",
            isDismissable: true
        }
    ];

    notifications.add(mockNotifications[0]);
    notifications.add(mockNotifications[1]);
    notifications.add(mockNotifications[2]);

    expect(mockNotificationsState.length).toBe(3);
    expect(mockNotificationsState[0].buttons.length).toBe(1);
    expect(mockNotificationsState[1].buttons.length).toBe(0);
    expect(mockNotificationsState[2].buttons.length).toBe(1);

    mockNotificationsState = [];
});

test("Click 'dismiss' button removes that notfication from state", () => {
    const mockNotifications = [
        {
            message: "Message 1",
            isDismissable: true
        }
    ];
    jest.useFakeTimers();

    notifications.add(mockNotifications[0]);
    mockNotificationsState[0].buttons[0].onClick();
    setTimeout(() => {
        expect(mockNotificationsState.length).toBe(0);
    }, 1000);

    jest.runAllTimers();

    mockNotificationsState = [];
});
