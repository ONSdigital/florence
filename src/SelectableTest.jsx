import React, { Component } from 'react';

import SelectableBox from './app/components/selectable-box/SelectableBox'

export default class SelectableTest extends Component {
    constructor(props) {
        super(props);

    }

    handleClick(item) {
        console.log(item)
    }

    render() {

        const oneCol = {
            numberOfColumns: 1,
            headings: ["Heading 1"],
            activeItem: "",
            handleItemClick: this.handleClick,
            isUpdating: false,
            items: [{
                id: "001",
                name: "Item 1",
                status: {
                    neutral: false,
                    warning: false,
                    success: false,
                    message: "",
                },
                selectableBox: {
                    firstColumn: "Item 1"
                }
            }, {
                id: "002",
                name: "Item 2",
                status: {
                    neutral: false,
                    warning: false,
                    success: false,
                    message: "",
                },
                selectableBox: {
                    firstColumn: "Item 2"
                }
            }]
        };
        const twoCol = {
            numberOfColumns: 2,
            headings: ["Heading 1", "Heading 2"],
            activeItem: "",
            handleItemClick: this.handleClick,
            isUpdating: false,
            items: []
        };
        const threeCol = {
            numberOfColumns: 3,
            headings: ["Heading 1", "Heading 2", "Heading 3"],
            activeItem: "",
            handleItemClick: this.handleClick,
            isUpdating: false,
            items: []
        };


        return (
            <div className="grid grid--justify-space-around">
                <div className="grid__col-10 margin-top--2">
                    <SelectableBox
                        {...oneCol}
                    />
                </div>
                <div className="grid__col-10 margin-top--2">
                    <SelectableBox
                        {...twoCol}
                    />
                </div>
                <div className="grid__col-10 margin-top--2">
                    <SelectableBox
                        {...threeCol}
                    />
                </div>
            </div>
        )
    }
}