import React from "react";
import { HeaderComponent } from "./HeaderComponent";
import { FooterComponent } from "./FooterComponent";

const FooterAndHeaderLayout = props => {
    return (
        <div className="ons-page">
            <div className="ons-page__content">
                <main className="ons-patternlib-page__body">
                    <HeaderComponent />
                    {props.children}
                    <FooterComponent />
                </main>
            </div>
        </div>
    );
};

export default FooterAndHeaderLayout;
