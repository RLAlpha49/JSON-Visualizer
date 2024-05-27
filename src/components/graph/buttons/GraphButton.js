import React from 'react';

function GraphButton({onClick}) {
    return (
        <button id="graph-button" onClick={onClick}>
            Display JSON Graph
        </button>
    );
}

export default GraphButton;