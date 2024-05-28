// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from "prop-types";

function GraphButton({onClick}) {
    return (
        <button id="graph-button" onClick={onClick}>
            Display JSON Graph
        </button>
    );
}

GraphButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default GraphButton;