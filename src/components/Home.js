import React, {useEffect} from 'react';
import '../styles.css';

function Home() {
    useEffect(() => {
        document.getElementById('format-button').addEventListener('click', function() {
            const input = document.getElementById('json-input').value;
            const display = document.getElementById('json-display');

            // Clear the display div
            display.innerHTML = '';

            try {
                const json = JSON.parse(input);
                const formattedJson = JSON.stringify(json, null, 2);

                // Create a new pre element
                const pre = document.createElement('pre');

                // Set the text content of the pre element to the formatted JSON
                pre.textContent = formattedJson;

                // Append the pre element to the display div
                display.appendChild(pre);
            } catch (error) {
                display.textContent = 'Invalid JSON';
            }
        });
    }, []);
    return (
        <div>
            <textarea id="json-input"></textarea>
            <button id="format-button">Format JSON</button>
            <div id="json-display"></div>
            <a href="/graph">Go to JSON Graph</a>
        </div>
    );
}

export default Home;