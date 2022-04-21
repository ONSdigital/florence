import React from "react";
import OnsLogo from "../../icons/OnsLogo";

export default function Footer() {
    return (
        <footer className="ons-footer grid grid--justify-space-around padding-bottom--2">
            <div className="ons-footer__body grid__col-8">
                <div className="grid__col-12">
                    <OnsLogo />
                </div>
            </div>
        </footer>
    );
}
