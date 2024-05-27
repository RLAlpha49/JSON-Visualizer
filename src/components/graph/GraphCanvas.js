import React from 'react';
import { Canvas, Edge, Node } from 'reaflow';
import { Space } from "react-zoomable-ui";

export function GraphCanvas(nodes, links) {
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
}

export default GraphCanvas;