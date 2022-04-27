import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getInteractive, resetSuccessMessage } from "../../actions/interactives";
import ButtonWithShadow from "../../components/button/ButtonWithShadow";
import BackButton from "../../components/back-button";
import FooterAndHeaderLayout from "../../components/layout/FooterAndHeaderLayout";
import AlertSuccess from "../../components/alert/AlertSuccess";

export default function InteractivesShow(props) {
    const dispatch = useDispatch();
    const { successMessage, interactive } = useSelector(state => state.interactives);
    const { rootPath } = useSelector(state => state.state);

    const [successCreate, setSuccessCreate] = useState(false);

    const [interactiveId, setInteractiveId] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        const { interactiveId } = props.params;
        setInteractiveId(interactiveId);
        dispatch(getInteractive(interactiveId));
    }, []);

    useEffect(() => {
        if (interactive.metadata) {
            setUrl(interactive.url);
        }
    }, [interactive.metadata]);

    useEffect(() => {
        if (successMessage.success) {
            if (successMessage.type === "create") {
                setSuccessCreate(true);
            }
            dispatch(resetSuccessMessage());
        }
    }, [successMessage]);

    return (
        <FooterAndHeaderLayout title="Manage my interactives">
            <div className="grid grid--justify-space-around padding-bottom--2">
                <div className={"grid__col-8"}>
                    <BackButton redirectUrl={`${rootPath}/interactives`} classNames={"ons-breadcrumb__item"} />
                    {successCreate && <AlertSuccess classNames={"margin-top--2"} text="Interactive has been successfully submitted" />}
                    <h1 className="text-align-left">Your interactive has been uploaded</h1>
                    <div>
                        <iframe title="Embed website" src={url} name="iframe" width="800" height="500"></iframe>
                    </div>
                    <p className="padding-top--1">
                        Embedded preview of uploaded interactive - <a href={url}>{url}</a>
                    </p>
                </div>
            </div>
        </FooterAndHeaderLayout>
    );
}
