import React from 'react';

function DarkModeButton({ onClick }) {
    return (
        <button id="dark-mode-button" onClick={onClick}>
            Dark Mode
        </button>
    );
}

export default DarkModeButton;