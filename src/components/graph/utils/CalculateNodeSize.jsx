import React from 'react';
import {renderToString} from 'react-dom/server';

export function calculateNodeSize(node) {
    // Create a new div element
    const dummyNode = document.createElement("div");

    // Apply the same styles to the dummy element
    dummyNode.style.position = "absolute";
    dummyNode.style.padding = "10px";
    dummyNode.style.textAlign = "center";
    dummyNode.style.pointerEvents = "none";

    // Set the content of the dummy element
    if (typeof node.data === 'string') {
        dummyNode.textContent = node.data;
    } else if (node.data && !React.isValidElement(node.data)) {
        dummyNode.innerHTML = Object.entries(node.data).map(([key, value]) => (
            `<div style={{pointerEvents: 'none', textAlign: 'left'}}>
                <span style={{fontFamily: "monospace", fontWeight: '500', fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", pointerEvents: 'none'}}>${key}: </span>
                <span style={{fontFamily: "monospace", fontWeight: '500', fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", pointerEvents: 'none'}}>${JSON.stringify(value, null, 2)}</span>
            </div>`
        )).join("");
    } else if (React.isValidElement(node.data)) {
        dummyNode.innerHTML = renderToString(node.data);
    }

    // Append the dummy element to the body
    document.body.appendChild(dummyNode);

    // Get the dimensions of the dummy element
    const rect = dummyNode.getBoundingClientRect();

    // Remove the dummy element from the body
    document.body.removeChild(dummyNode);

    // Return the dimensions
    return {
        height: rect.height + 4.5,
        width: rect.width + 4
    };
}