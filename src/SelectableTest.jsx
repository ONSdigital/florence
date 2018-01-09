import React, { Component } from 'react';

import SelectableBox from './app/components/selectable-box-new/SelectableBox'

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
            columns: [{heading: "Heading 1", width: "12"}],
            activeItem: {},
            handleItemClick: this.handleClick,
            isUpdating: true,
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
                    firstColumn: {value: "Item 1", width: "12"}
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
                    firstColumn: {value: "Item 2", width: "12"}
                }
            }]
        };

        const twoCol = {
            numberOfColumns: 2,
            columns: [{heading: "Heading 1", width: "6"}, {heading: "Heading 2", width: "6"}],
            activeItem: {},
            handleItemClick: this.handleClick,
            isUpdating: true,
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
                    firstColumn: {value: "Item 1 title", width: "6"},
                    secondColumn: {value: "Item 1 date", width: "6"}
                }
            }, {
                id: "002",
                name: "Item 2",
                status: {
                    neutral: true,
                    warning: false,
                    success: false,
                    message: "",
                },
                selectableBox: {
                    firstColumn: {value: "Item 2 title", width: "6"},
                    secondColumn: {value: "Item 1 date", width: "6"}
                }
            }]
        };

        const threeCol = {
            numberOfColumns: 3,
            columns: [{heading: "Heading 1", width: "6"}, {heading: "Heading 2", width: "3"}, {heading: "Heading 3", width: "3"}],
            activeItem: {},
            handleItemClick: this.handleClick,
            isUpdating: true,
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
                    firstColumn: {value: "Item 1 title", width: "6"},
                    secondColumn: {value: "Item 1 date", width: "3"},
                    thirdColumn: {value: "Item 1 other", width: "3"}
                }
            }, {
                id: "002",
                name: "Item 2",
                status: {
                    neutral: true,
                    warning: false,
                    success: false,
                    message: "",
                },
                selectableBox: {
                    firstColumn: {value: "Item 2 title", width: "6"},
                    secondColumn: {value: "Item 2 date", width: "3"},
                    thirdColumn: {value: "Item 2 other", width: "3"}
                }
            }, {
                id: "003",
                name: "Item 3",
                status: {
                    neutral: false,
                    warning: true,
                    success: false,
                    message: "",
                },
                selectableBox: {
                    firstColumn: {value: "Item 3 title", width: "6"},
                    secondColumn: {value: "Item 3 date", width: "3"},
                    thirdColumn: {value: "Item 3 other", width: "3"}
                }
            }]
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
                <div className="grid__col-10 margin-top--2 margin-bottom--2">
                    <SelectableBox
                        {...threeCol}
                    />
                </div>
            </div>
        )
    }
}