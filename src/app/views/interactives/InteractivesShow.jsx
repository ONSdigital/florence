import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getInteractive } from "../../actions/interactives";
import BackButton from "../../components/back-button";
import FooterAndHeaderLayout from "../../components/layout/FooterAndHeaderLayout";
import { getParameterByName } from "../../utilities/utils";

export default function InteractivesShow(props) {
    const dispatch = useDispatch();
    const { interactive } = useSelector(state => state.interactives);
    const { rootPath } = useSelector(state => state.state);
    const { interactiveId } = props.params;
    const [url, setUrl] = useState("");
    const collectionId = getParameterByName("collection");

    useEffect(() => {
        dispatch(getInteractive(interactiveId));
    }, []);

    useEffect(() => {
        if (interactive.metadata) {
            setUrl(window.location.origin + interactive.html_files[0].uri);
        }
    }, [interactive.metadata]);

    return (
        <div className="grid grid--justify-space-around padding-bottom--2 padding-top--2">
            <div className="grid__col-8">
                <BackButton
                    redirectUrl={`${rootPath}/interactives/edit/${interactive.id}?collection=${collectionId}`}
                    classNames="ons-breadcrumb__item"
                />
                <h1 className="text-align-left">Your interactive has been uploaded</h1>
                <div>
                    <iframe title="Embed website" src={url} name="iframe" width="800" height="500"></iframe>
                </div>
                <p className="padding-top--1">
                    Embedded preview of uploaded interactive - <a href={url}>{url}</a>
                </p>
            </div>
        </div>
    );
}
