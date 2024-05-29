// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import PropTypes from "prop-types";
import { DarkModeContext } from '../../context/DarkModeContext';

function DarkModeButton({ onClick }) {
    const { darkMode, setDarkMode } = useContext(DarkModeContext);

    const handleClick = () => {
        setDarkMode(!darkMode);
        if (onClick) {
            onClick();
        }
    };

    return (
        <button id="dark-mode-button" onClick={handleClick}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
}

DarkModeButton.propTypes = {
    onClick: PropTypes.func
}

export default DarkModeButton;