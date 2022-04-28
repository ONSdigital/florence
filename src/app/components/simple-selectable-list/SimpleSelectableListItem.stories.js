import React from "react";

import SimpleSelectableListItem from "./SimpleSelectableListItem";

export default {
  title: "Components/SimpleSelectableListItem",
  component: SimpleSelectableListItem,
  args: {
    title: "Simple List Item [1]",
    id: "simpleListItem1",
    url: "/",
    externalLink: "/external",
    colCount: 2,
    extraDetails: [[{ content: "extraDetails" }]],
    disabled: false,
  },
};

export const Primary = (args) => <SimpleSelectableListItem {...args} />;
