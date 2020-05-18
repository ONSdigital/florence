import React, { Component } from "react";
import EditHomepage from "./EditHompage";

class EditHomepageController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlightedContent: []
        };
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <EditHomepage />
            </div>
        );
    }
}

export default EditHomepageController;
