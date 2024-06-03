// eslint-disable-next-line no-unused-vars
import React, {useContext} from 'react';
import PropTypes from "prop-types";
import {DarkModeContext} from '../../context/DarkModeContext';
import styled from "styled-components";

const Button = styled.button`
    position: relative;
    margin-top: 10px;
    background-color: #4CAF50;
    border: 2px solid transparent;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    transition-duration: 0.4s;
    border-radius: 12px;

    &:hover {
        background-color: white;
        color: black;
        border: 2px solid #4CAF50;
    }
`;

function DarkModeButton({onClick}) {
    const {darkMode, setDarkMode} = useContext(DarkModeContext);

    const handleClick = () => {
        setDarkMode(!darkMode);
        if (onClick) {
            onClick();
        }
    };

    return (
        <Button id="dark-mode-button" onClick={handleClick}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
    );
}

DarkModeButton.propTypes = {
    onClick: PropTypes.func
}

export default DarkModeButton;