import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
    <footer>
        © Valentine Sokolovskiy, Shenkerina 2018-{currentYear}
    </footer>
    );
}
export default Footer;