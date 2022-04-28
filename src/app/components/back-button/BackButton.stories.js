import React from "react";

import BackButton from "./BackButton";

export default {
    title: "Components/BackButton",
    component: BackButton,
    args: { ...BackButton.defaultProps },
    argTypes: {
        text: { control: "text" },
        redirectUrl: { control: "text" },
        classNames: { control: "text" },
    },
};

export const Primary = args => <BackButton {...args} />;
