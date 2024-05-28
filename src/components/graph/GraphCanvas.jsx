// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Canvas, Edge, Node} from 'reaflow';
import {Space} from "react-zoomable-ui";
import {calculateNodeSize} from './utils/CalculateNodeSize';
import {getColorBasedOnNodeType, getColorBasedOnType} from './utils/TextColor';

export function GraphCanvas(nodes, links) {
    const handleNodeClick = (event) => {
        console.log('Node Click:', event.id);
    };

    return (
        <Space>
            <Canvas
                className="graph-canvas"
                nodes={nodes.map(node => {
                    const {height, width} = calculateNodeSize(node);
                    return {
                        id: node.id,
                        data: node.data,
                        type: node.type,
                        height: height,
                        width: width
                    };
                })}
                edges={links.map(link => ({
                    id: `edge-${link.from}-${link.to}`,
                    from: link.from,
                    to: link.to,
                }))}
                node={<Node
                    onClick={handleNodeClick}
                    animated={false}
                    label={null}
                >
                    {event => {
                        return (
                            <foreignObject height={event.height} width={event.width} x={0} y={0}
                                           style={{pointerEvents: 'none'}}>
                                <div style={{
                                    padding: 10,
                                    textAlign: 'center',
                                    pointerEvents: 'none'
                                }}>
                                    {typeof event.node.data === 'string' ?
                                        <span style={{
                                            color: getColorBasedOnNodeType(event.node.type),
                                            fontFamily: "monospace",
                                            fontWeight: '500',
                                            fontSize: "12px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            pointerEvents: 'none'
                                        }}>{event.node.data}</span> :
                                        event.node.data ? Object.entries(event.node.data).map(([key, value], index) => (
                                            <div key={index} style={{pointerEvents: 'none', textAlign: 'left'}}>
                                                <span style={{
                                                    color: '#51b6ff',
                                                    fontFamily: "monospace",
                                                    fontWeight: '500',
                                                    fontSize: "12px",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    pointerEvents: 'none'
                                                }}>{key}: </span>
                                                <span style={{
                                                    color: getColorBasedOnType(value),
                                                    fontFamily: "monospace",
                                                    fontWeight: '500',
                                                    fontSize: "12px",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    pointerEvents: 'none'
                                                }}>{JSON.stringify(value, null, 2)}</span>
                                            </div>
                                        )) : <h3 style={{color: 'white', pointerEvents: 'none'}}>{event.node.text}</h3>}
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