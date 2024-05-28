// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from "prop-types";

function DarkModeButton({onClick}) {
    return (
        <button id="dark-mode-button" onClick={onClick}>
            Dark Mode
        </button>
    );
}

DarkModeButton.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default DarkModeButton;