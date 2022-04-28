import React from "react";

import SimpleSelectableList from "./SimpleSelectableList";

export default {
  title: "Components/SimpleSelectableList",
  component: SimpleSelectableList,
  args: {
    showLoadingState: true,
    rows: [
      {
        title: "Simple List Item [1]",
        id: "simpleListItem1",
        url: "/",
        externalLink: "/external",
        colCount: 2,
        extraDetails: [[{ content: "extraDetails1" }]],
        disabled: false,
      },
      {
        title: "Simple List Item [2]",
        id: "simpleListItem2",
        url: "/",
        externalLink: "/external",
        colCount: 2,
        extraDetails: [[{ content: "extraDetails2" }]],
        disabled: false,
      },
    ],
  },
};

export const Primary = (args) => <SimpleSelectableList {...args} />;
