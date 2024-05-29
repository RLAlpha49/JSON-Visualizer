// eslint-disable-next-line no-unused-vars
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {Canvas, Edge, Node} from 'reaflow';
import {Space} from "react-zoomable-ui";
import {calculateNodeSize} from './utils/CalculateNodeSize';
import {getColorBasedOnNodeType, getColorBasedOnType} from './utils/TextColor';
import PropTypes from "prop-types";

export const GraphCanvas = forwardRef(({nodes, edges}, ref) => {
    const canvasRef = useRef();

    useImperativeHandle(ref, () => ({
        zoomToFit: () => canvasRef.current.zoomToFit()
    }));

    useEffect(() => {
        const setDimensions = () => {
            const gElement = document.querySelector('#ref-2 g');
            const ref2Element = document.getElementById('ref-2');
            const containerElement = document.querySelector('._container_32rpv_1')

            if (gElement && ref2Element) {
                const bbox = gElement.getBBox();

                ref2Element.style.width = `${(bbox.width * (1 + 4.1264671 / 100) * (100.0029 / 100)) + 14}px`;
                ref2Element.style.height = `${parseFloat(bbox.height) + 50}px`;

                containerElement.style.width = `${(bbox.width * (1 + 4.1264671 / 100) * (100.0029 / 100)) + 14}px`;
                containerElement.style.height = `${parseFloat(bbox.height) + 50}px`;
            }
        };

        // Function to start observer
        const startObserver = () => {
            const targetNode = document.getElementById('ref-2');
            if (targetNode) {
                observer.observe(targetNode, {childList: true, subtree: true});
            }
        };

        const timeoutId = setTimeout(() => {
            setDimensions();
            startObserver();
        }, 2000);

        let dimensionsTimeoutId;

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    clearTimeout(dimensionsTimeoutId);

                    dimensionsTimeoutId = setTimeout(setDimensions, 2000);
                }
            }
        });

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(dimensionsTimeoutId);
            observer.disconnect();
        };
    }, [nodes, edges]);

    const handleNodeClick = (event) => {
        console.log('Node Click:', event.id);
    };

    return (
        <Space>
            <Canvas
                ref={canvasRef}
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
                edges={edges.map(edge => ({
                    id: `edge-${edge.from}-${edge.to}`,
                    from: edge.from,
                    to: edge.to,
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
});

GraphCanvas.displayName = 'GraphCanvas';

GraphCanvas.propTypes = {
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
};

export default GraphCanvas;
