import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const FooterAndHeaderLayout = ({ children, title }) => {
    return (
        <div className="ons-page">
            <div className="ons-page__content">
                <main className="ons-patternlib-page__body">
                    <Header title={title} />
                    {children}
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default FooterAndHeaderLayout;
