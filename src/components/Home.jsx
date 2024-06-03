// eslint-disable-next-line no-unused-vars
import React, {useEffect} from 'react';
import '../styles.css';
import styled from 'styled-components';

const TextArea = styled.textarea`
    width: 100%;
    height: 100%;
`;

const Button = styled.button`
    background-color: #4CAF50;
    border: 2px solid transparent;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    transition-duration: 0.4s;
    border-radius: 12px;
`;

const DisplayDiv = styled.div`
    margin-top: 20px;
`;

function Home() {
    useEffect(() => {
        document.getElementById('format-button').addEventListener('click', function () {
            const input = document.getElementById('json-input').value;
            const display = document.getElementById('json-display');

            display.innerHTML = '';
            try {
                const json = JSON.parse(input);
                const formattedJson = JSON.stringify(json, null, 2);
                const pre = document.createElement('pre');
                pre.textContent = formattedJson;
                display.appendChild(pre);
            } catch (error) {
                display.textContent = 'Invalid JSON';
            }
        });
    }, []);

    return (
        <div>
            <TextArea id="json-input"/>
            <Button id="format-button">Format JSON</Button>
            <DisplayDiv id="json-display"/>
            <a href="/graph">Go to JSON Graph</a>
        </div>
    );
}

export default Home;