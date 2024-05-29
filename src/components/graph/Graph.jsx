import React, {useEffect, useRef, useState, useContext} from 'react';
import GraphButton from './buttons/GraphButton';
import DarkModeButton from './buttons/DarkModeButton';
import Editor from './Editor';
import {ConvertJsonToGraph} from './utils/ConvertJson';
import {GraphCanvas} from "./GraphCanvas";
import {DarkModeContext} from "../context/DarkModeContext";

function Graph() {
    const jsonInputRef = useRef(null);
    const svgContainerRef = useRef(null);

    const [graph, setGraph] = useState(null);

    const [jsonData, setJsonData] = useState("");

    const { darkMode } = useContext(DarkModeContext);

    const handleGraphButtonClick = () => {
        if (jsonData.trim() !== "") { // Check if jsonData is not an empty string
            try {
                const json = JSON.parse(jsonData);

                // Convert the JSON into nodes and links
                const {nodes, edges} = ConvertJsonToGraph(json);

                console.log('Nodes:', nodes);
                console.log('Edges:', edges);

                // Create the graph
                const newGraph = GraphCanvas(nodes, edges);

                // Update the graph state variable
                setGraph(newGraph);
            } catch (error) {
                console.log(error);
            }
        }
    };

    // Create a ref for the div
    const divRef = React.createRef();

    useEffect(() => {
        if (divRef.current) {
            const width = divRef.current.offsetWidth;
            const height = divRef.current.offsetHeight;

            // Set the width and height of the foreign object
            divRef.current.parentNode.setAttribute('width', width);
            divRef.current.parentNode.setAttribute('height', height);
        }

        const resizer = document.getElementById('resizer');
        const jsonInput = jsonInputRef.current;
        const svgContainer = svgContainerRef.current;

        let isResizing = false;
        // eslint-disable-next-line no-unused-vars
        let initialMousePosition;

        const mousemove = (e) => {
            if (!isResizing) return;
            const windowWidth = window.innerWidth;
            const jsonInputWidth = (e.clientX / windowWidth) * 100;
            const svgContainerWidth = 100 - jsonInputWidth;
            jsonInput.style.width = `${jsonInputWidth}%`;
            svgContainer.style.width = `${svgContainerWidth}%`;
            initialMousePosition = e.clientX;
        }

        const mouseup = () => {
            isResizing = false;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        }

        resizer.addEventListener('mousedown', function (e) {
            e.preventDefault();
            isResizing = true;
            initialMousePosition = e.clientX;
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);
        });
    }, [divRef]);

    return (
        <div id="graph" className={darkMode ? 'dark-mode' : 'light-mode'}>
            <div id="json-input" ref={jsonInputRef} className={darkMode ? 'dark-mode' : 'light-mode'}>
                <div id="buttons">
                    <GraphButton onClick={handleGraphButtonClick}/>
                    <DarkModeButton/>
                </div>
                <Editor onGraphButtonClick={setJsonData}/>
            </div>
            <div id="resizer"></div>
            <div id="svg-container" ref={svgContainerRef}>
                {graph}
            </div>
        </div>
    );
}

export default Graph;