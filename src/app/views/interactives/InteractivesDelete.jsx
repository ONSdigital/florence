import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteInteractive, getInteractive } from "../../actions/interactives";
import ButtonWithShadow from "../../components/button/ButtonWithShadow";
import BackButton from "../../components/back-button";
import FooterAndHeaderLayout from "../../components/layout/FooterAndHeaderLayout";
import moment from "moment";

export default function InteractivesDelete(props) {
    const dispatch = useDispatch();
    const { successMessage, interactive } = useSelector(state => state.interactives);
    const { rootPath } = useSelector(state => state.state);

    const [title, setTitle] = useState("");
    const [interactiveId, setInteractiveId] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
        const { interactiveId } = props.params;
        setInteractiveId(interactiveId);
        dispatch(getInteractive(interactiveId));
    }, []);

    useEffect(() => {
        if (interactive.metadata) {
            const { metadata } = interactive;
            setTitle(metadata.title);
            setLastUpdated(interactive.last_updated);
        }
    }, [interactive.metadata]);

    useEffect(() => {
        if (successMessage.success) {
            if (successMessage.type === "delete") {
                props.router.push(`${rootPath}/interactives`);
            }
        }
    }, [successMessage.success]);

    const handleDelete = e => {
        e.preventDefault();
        dispatch(deleteInteractive(interactiveId));
    };

    const handleReturn = () => {
        props.router.push(`${rootPath}/interactives/edit/${interactiveId}`);
    };

    return (
        <FooterAndHeaderLayout title="Manage my interactives">
            <div className="grid grid--justify-space-around padding-bottom--2 ons-content">
                <div className="grid__col-8">
                    <BackButton redirectUrl={`${rootPath}/interactives`} classNames="ons-breadcrumb__item" />
                    <h1 className="text-align-left">Delete interactive</h1>
                    <p className="padding-bottom--1">You are about to delete this interactive:</p>
                    <ul className="list-simple">
                        <li className="list-simple__item">
                            Name - <b>{title}</b>
                        </li>
                        <li className="list-simple__item">
                            Last updated - <b>{moment(lastUpdated).format("DD MMMM YYYY")}</b>
                        </li>
                    </ul>
                    <p>
                        Are you sure you want to delete this interactive? You will permanently lose access to the data associated to it, including the
                        uploaded file.
                    </p>
                    <div className="inline-block padding-top--2">
                        <ButtonWithShadow type="button" buttonText="Continue" onClick={handleDelete} isSubmitting={false} />
                        <ButtonWithShadow type="button" class="secondary" buttonText="Cancel" onClick={handleReturn} isSubmitting={false} />
                    </div>
                </div>
            </div>
        </FooterAndHeaderLayout>
    );
}
