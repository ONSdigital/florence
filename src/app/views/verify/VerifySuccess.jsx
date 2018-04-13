import React, { Component } from 'react';

class VerifySuccess extends Component {
    constructor(props) {
        super(props);

        this.previewURL = "//" + location.host.replace("publishing", "preview") + "/ermintrude/index.html";
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <h1 className="grid__col-8">Email verification complete</h1>
                <div className="grid__col-8">
                    <p className="font-size--16">Thank you for verifying your email address. You can now login to preview with your email address and new password.</p>
                    <p className="margin-top--3"><a className="btn btn--primary" href={this.previewURL}>Log in</a></p>
                </div>
            </div>
        )
    }
}

export default VerifySuccess;