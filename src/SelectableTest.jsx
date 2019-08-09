import React, { Component } from "react";

import SelectableBox from "./app/components/selectable-box-new/SelectableBox";

export default class SelectableTest extends Component {
    constructor(props) {
        super(props);
    }

    handleClick(item) {
        console.log(item);
    }

    render() {
        const oneCol = {
            columns: [{ heading: "Heading 1", width: "12" }],
            activeRowID: "002",
            handleItemClick: this.handleClick,
            isUpdating: true,
            rows: [
                {
                    id: "001",
                    columnValues: ["Item 1"],
                    returnValue: { id: "001" },
                    status: {
                        neutral: false,
                        warning: false,
                        success: false,
                        message: ""
                    }
                },
                {
                    id: "002",
                    columnValues: ["Item 2"],
                    returnValue: { id: "002" },
                    status: {
                        neutral: false,
                        warning: false,
                        success: false,
                        message: ""
                    }
                }
            ]
        };

        const twoCol = {
            numberOfColumns: 2,
            columns: [{ heading: "Heading 1", width: "6" }, { heading: "Heading 2", width: "6" }],
            activeRowID: "",
            handleItemClick: this.handleClick,
            isUpdating: true,
            rows: [
                {
                    id: "001",
                    columnValues: ["Item 1", "Item 1 date"],
                    returnValue: { id: "001" },
                    status: {
                        neutral: false,
                        warning: false,
                        success: false,
                        message: ""
                    }
                },
                {
                    id: "002",
                    columnValues: ["Item 2", "Item 2 date"],
                    returnValue: { id: "002" },
                    status: {
                        neutral: false,
                        warning: false,
                        success: false,
                        message: ""
                    }
                }
            ]
        };

        const threeCol = {
            columns: [{ heading: "Heading 1", width: "6" }, { heading: "Heading 2", width: "3" }, { heading: "Heading 3", width: "3" }],
            activeRowID: "",
            handleItemClick: this.handleClick,
            isUpdating: true,
            rows: [
                {
                    id: "001",
                    columnValues: ["Item 1", "Item 1 date", "Item 1 other"],
                    returnValue: { id: "001" },
                    status: {
                        neutral: false,
                        warning: true,
                        success: false,
                        message: "YAY!"
                    }
                },
                {
                    id: "002",
                    columnValues: ["Item 2", "Item 2 date", "Item 2 other"],
                    returnValue: { id: "002" },
                    status: {
                        neutral: false,
                        warning: false,
                        success: false,
                        message: ""
                    }
                },
                {
                    id: "003",
                    columnValues: ["Item 3", "Item 3 date", "Item 3 other"],
                    returnValue: { id: "003" },
                    status: {
                        neutral: false,
                        warning: false,
                        success: false,
                        message: ""
                    }
                }
            ]
        };

        return (
            <div className="grid grid--justify-space-around">
                <div className="grid__col-10 margin-top--2">
                    <SelectableBox {...oneCol} />
                </div>
                <div className="grid__col-10 margin-top--2">
                    <SelectableBox {...twoCol} />
                </div>
                <div className="grid__col-10 margin-top--2 margin-bottom--2">
                    <SelectableBox {...threeCol} />
                </div>
            </div>
        );
    }
}
