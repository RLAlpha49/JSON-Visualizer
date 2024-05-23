// main.js
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