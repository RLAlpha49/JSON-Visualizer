import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../styles.css';
import {Canvas, Edge, Node} from 'reaflow';
import {Space} from "react-zoomable-ui";
import {EditorState, StateEffect, StateField} from '@codemirror/state';
import {EditorView, lineNumbers, ViewUpdate} from '@codemirror/view';
import {javascript} from '@codemirror/lang-javascript';
import {dracula} from 'thememirror';

// Define a state effect that will replace the document with formatted JSON
const formatJsonEffect = StateEffect.define({map: (effect, mapping) => effect});

// Define a state field that responds to the formatJsonEffect by replacing the document
const formatJsonField = StateField.define({
    create: () => null,
    update(value, tr) {
        for (let effect of tr.effects) {
            if (effect.is(formatJsonEffect)) {
                return effect.value;
            }
        }
        return value;
    },
    provide: f => EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
            let tr = v.state.update({effects: formatJsonEffect.of(null)});
            v.view.dispatch(tr);
        }
    })
});

function Graph() {
    const jsonInputRef = useRef(null);
    const svgContainerRef = useRef(null);

    const convertJsonToGraph = useCallback((json, parent = null, nodes = [], edges = [], id = 0) => {
        const processItem = (item, index, node, nodes, edges, id) => {
            if (typeof item === 'object' && item !== null) {
                let nodeData = {};
                for (const key in item) {
                    if (typeof item[key] !== 'object') {
                        nodeData[key] = item[key];
                    }
                }

                const indexNode = {id: id++, data: nodeData, parentId: node.id};
                nodes.push(indexNode);
                edges.push({from: node.id, to: indexNode.id});

                if (typeof item === 'object') {
                    id = convertJsonToGraph(item, indexNode, nodes, edges, id).id;
                } else {
                    const valueNode = {id: id++, data: item, parentId: indexNode.id};
                    nodes.push(valueNode);
                    edges.push({from: indexNode.id, to: valueNode.id});
                }
            } else {
                const valueNode = {id: id++, data: item, parentId: node.id};
                nodes.push(valueNode);
                edges.push({from: node.id, to: valueNode.id});
            }
            return id;
        };

        if (parent === null) {
            let rootData = {};
            for (const key in json) {
                if (typeof json[key] !== 'object') {
                    rootData[key] = json[key];
                }
            }

            const node = {id: id++, data: rootData, parentId: null};
            nodes.push(node);
            parent = node;
        }

        for (const key in json) {
            if (Array.isArray(json[key]) || (typeof json[key] === 'object' && json[key] !== null)) {
                let node;
                if (Array.isArray(json[key])) {
                    node = {id: id++, data: `${key} (${json[key].length})`, parentId: parent.id};
                    // eslint-disable-next-line no-loop-func
                    json[key].forEach((item, index) => {
                        id = processItem(item, index, node, nodes, edges, id, convertJsonToGraph);
                    });
                } else {
                    node = {id: id++, data: key, parentId: parent.id};
                    id = convertJsonToGraph(json[key], node, nodes, edges, id).id;
                }

                nodes.push(node);
                edges.push({from: parent.id, to: node.id});

                if (typeof json[key] === 'object' && !Array.isArray(json[key]) && json[key] !== null) {
                    for (const subKey in json[key]) {
                        if (!Array.isArray(json[key][subKey])) {
                            const subNode = {id: id++, data: {[subKey]: json[key][subKey]}, parentId: node.id};
                            nodes.push(subNode);
                            edges.push({from: node.id, to: subNode.id});
                        }
                    }
                }
            }
        }

        return {nodes, edges, id};
    }, []);

    // Create a ref for the div
    const divRef = React.createRef();

    const createGraph = useCallback((nodes, links) => {
        return (
            <Space>
                <Canvas
                    className="graph-canvas"
                    nodes={nodes.map(node => {
                        let maxWidth;
                        let maxHeight;

                        // Check if node.data is an object or a string
                        if (typeof node.data === 'object' && node.data !== null) {
                            // Iterate over the properties and find the maximum length of key-value pair
                            maxWidth = Math.max(...Object.entries(node.data).map(([key, value]) => (`${key}:${value}`).length));
                        } else if (typeof node.data === 'string') {
                            // If it's a string, use its length
                            maxWidth = node.data.length;
                        }

                        // Calculate the maximum height
                        if (typeof node.data === 'object' && node.data !== null) {
                            maxHeight = (Object.keys(node.data).length) * 1.88;
                        } else {
                            maxHeight = 1;
                        }

                        // console.log('Node:', node);
                        // console.log('Max Width:', maxWidth);
                        // console.log('Max Height:', maxHeight);

                        // Set a base size
                        const baseSize = 30;

                        // Set the size per character
                        const sizePerCharacterHeight = 9;
                        const sizePerCharacterWidth = 7;

                        // Calculate the height and width
                        const height = baseSize + maxHeight * sizePerCharacterHeight
                        const width = baseSize + maxWidth * sizePerCharacterWidth;

                        return {
                            id: node.id,
                            data: node.data,
                            height: height,
                            width: width
                        };
                    })}
                    edges={links.map(link => ({
                        id: `edge-${link.from}-${link.to}`,
                        from: link.from,
                        to: link.to,
                    }))}
                    node={<Node>
                        {event => {
                            return (
                                <foreignObject height={event.height} width={event.width} x={0} y={0}>
                                    <div style={{
                                        padding: 10,
                                        textAlign: 'center'
                                    }}>
                                        {typeof event.node.data === 'string' ?
                                            <span style={{color: 'white', fontFamily: "monospace", fontWeight: '500', fontSize: "12px"}}>{event.node.data}</span> :
                                            event.node.data ? Object.entries(event.node.data).map(([key, value], index) => (
                                                <div key={index}>
                                                    <span style={{color: 'white', fontFamily: "monospace", fontWeight: '500', fontSize: "12px"}}>{key}:</span>
                                                    <span style={{color: 'white', fontFamily: "monospace", fontWeight: '500', fontSize: "12px"}}>{JSON.stringify(value, null, 2)}</span>
                                                </div>
                                            )) : <h3 style={{color: 'white'}}>{event.node.text}</h3>}
                                    </div>
                                </foreignObject>
                            );
                        }}
                    </Node>}
                    edge={<Edge/>}
                    maxWidth="1000000px"
                    maxHeight="1000000px"
                    width="1000000px"
                    height="1000000px"
                    direction="RIGHT"
                    zoomable={false}
                    animated={false}
                    readonly={true}
                    dragEdge={null}
                    dragNode={null}
                    fit={true}
                />
            </Space>
        );
    }, []);

    const editorViewRef = useRef(null);

    const [graph, setGraph] = useState(null);

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

        const darkModeButton = document.getElementById('dark-mode-button');

        darkModeButton.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
            const svgElements = document.querySelectorAll('svg');
            svgElements.forEach(svg => {
                svg.classList.toggle('dark-mode');
            });
        });

        const state = EditorState.create({
            doc: '',
            extensions: [
                dracula,
                lineNumbers(),
                EditorView.lineWrapping,
                javascript(),
                formatJsonField,
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        let doc = update.view.state.doc.toString();
                        try {
                            let parsedJson = JSON.parse(doc);
                            let formattedJson = JSON.stringify(parsedJson, null, 2);
                            if (doc !== formattedJson) {
                                let tr = update.view.state.update({
                                    changes: {from: 0, to: doc.length, insert: formattedJson},
                                    effects: formatJsonEffect.of(formattedJson)
                                });
                                update.view.dispatch(tr);
                            }
                        } catch (error) {
                            // If parsing fails, leave the data as is
                        }
                    }
                })
            ]
        });

        if (!editorViewRef.current) {
            editorViewRef.current = new EditorView({
                parent: document.querySelector('#editor'),
                state
            });
        }

        document.getElementById('graph-button').addEventListener('click', function () {
            const jsonData = editorViewRef.current.state.doc.toString();
            if (jsonData.trim() !== "") { // Check if jsonData is not an empty string
                try {
                    const json = JSON.parse(jsonData);

                    // Convert the JSON into nodes and links
                    const {nodes, edges} = convertJsonToGraph(json);

                    // Log the nodes and links
                    console.log('Nodes:', nodes);
                    console.log('Edges:', edges);

                    // Create the graph
                    const newGraph = createGraph(nodes, edges);

                    // Update the graph state variable
                    setGraph(newGraph);
                } catch (error) {
                    console.log(error);
                }
            }
        });

        return () => {
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        }
    }, [convertJsonToGraph, createGraph, divRef]);

    return (
        <div id="graph">
            <div id="json-input" ref={jsonInputRef}>
                <div id="buttons">
                    <button id="graph-button">Display JSON Graph</button>
                    <button id="dark-mode-button">Dark Mode</button>
                </div>
                <div id="editor"></div>
                {/* CodeMirror editor will be initialized here */}
            </div>
            <div id="resizer"></div>
            <div id="svg-container" ref={svgContainerRef}>
                {/* Graph will be rendered here */}
                {graph}
            </div>
        </div>
    );
}

export default Graph;