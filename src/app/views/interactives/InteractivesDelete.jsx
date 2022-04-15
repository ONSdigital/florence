import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteInteractive, getInteractive } from "../../actions/interactives";
import ButtonWithShadow from "../../components/button/ButtonWithShadow";
import BackButton from "../../components/back-button";
import FooterAndHeaderLayout from "../../components/layout/FooterAndHeaderLayout";

export default function InteractivesDelete(props) {
    const dispatch = useDispatch();
    const { successMessage, interactive } = useSelector(state => state.interactives);
    const { rootPath } = useSelector(state => state.state);

    const [internalId, setInternalId] = useState("");
    const [title, setTitle] = useState("");
    const [label, setLabel] = useState("");
    const [slug, setSlug] = useState("");
    const [interactiveId, setInteractiveId] = useState("");
    const [published, setPublished] = useState(false);

    useEffect(() => {
        const { interactiveId } = props.params;
        setInteractiveId(interactiveId);
        dispatch(getInteractive(interactiveId));
    }, []);

    useEffect(() => {
        if (interactive.metadata) {
            const { metadata } = interactive;
            setInternalId(metadata.internal_id);
            setTitle(metadata.title);
            setLabel(metadata.label);
            setSlug(metadata.slug);
            setPublished(metadata.published);
        }
    }, [interactive]);

    useEffect(() => {
        if (successMessage.success) {
            if (successMessage.type === "delete") {
                props.router.push(`${rootPath}/interactives`);
            }
        }
    }, [successMessage]);

    const handleDelete = e => {
        e.preventDefault();
        dispatch(deleteInteractive(interactiveId));
    };

    const handleReturn = () => {
        const rootPath = props.rootPath;
        props.router.push(`${rootPath}/interactives/edit/${interactiveId}`);
    };

    return (
        <FooterAndHeaderLayout title="Manage my interactives">
            <div className="grid grid--justify-space-around padding-bottom--2">
                <div className={"grid__col-8"}>
                    <BackButton redirectUrl={`${rootPath}/interactives`} classNames={"ons-breadcrumb__item"} />
                    <h1 className="text-align-left">Delete interactive</h1>
                    <p className={"padding-bottom--1"}>You are about to delete this interactive:</p>
                    <ul className="list-simple">
                        <li className="list-simple__item">
                            Name - <b>{title}</b>
                        </li>
                        <li className="list-simple__item">
                            Published date - <b>11 March 2022</b>
                        </li>
                        <li className="list-simple__item">
                            Topic - <b>Health and social care (COVID-19)</b>
                        </li>
                    </ul>
                    <p className="">
                        Are you sure you want to delete this interactive? You will permanently lose access to the data associated to it, including the
                        uploaded file.
                    </p>
                    <div className={"inline-block padding-top--2"}>
                        <ButtonWithShadow type="button" buttonText="Continue" onClick={handleDelete} isSubmitting={false} />
                        <ButtonWithShadow type="button" class="secondary" buttonText="Cancel" onClick={handleReturn} isSubmitting={false} />
                    </div>
                </div>
            </div>
        </FooterAndHeaderLayout>
    );
}
