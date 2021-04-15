import React from "react";
import './Footer.scss';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
    <footer>
        © Vallion, Shenkerina 2018-{currentYear}
    </footer>
    );
}
export default Footer;