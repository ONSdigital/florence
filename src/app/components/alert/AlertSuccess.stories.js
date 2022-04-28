import React from "react";

import AlertSuccess from "./AlertSuccess";

export default {
    title: "Components/Alert",
    component: AlertSuccess,
    args: { ...AlertSuccess.defaultProps },
    argTypes: {
        text: { control: "text" },
    },
};

export const Primary = args => <AlertSuccess {...args} />;
