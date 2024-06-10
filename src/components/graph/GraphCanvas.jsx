// eslint-disable-next-line no-unused-vars
import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Canvas, Edge, Node} from 'reaflow';
import {Space} from "react-zoomable-ui";
import {calculateNodeSize} from './utils/CalculateNodeSize';
import {getColorBasedOnNodeType, getColorBasedOnType} from './utils/TextColor';
import NodeDetails from "./NodeDetails";
import PropTypes from "prop-types";

const GraphCanvas = forwardRef(({nodes, edges}, ref) => {
    const canvasRef = useRef();
    const [viewport, setViewport] = useState(null)

    useEffect(() => {
        const setDimensions = () => {
            const gElement = document.querySelector('#ref-2 g');
            const ref2Element = document.getElementById('ref-2');
            const containerElement = document.querySelector('._container_32rpv_1')

            if (gElement && ref2Element) {
                const bbox = gElement.getBBox();

                const width = (bbox.width * (1 + 4.1264671 / 100) * (100.0029 / 100)) + 14;
                const height = parseFloat(bbox.height) + 50;

                ref2Element.style.width = `${width}px`;
                ref2Element.style.height = `${height}px`;

                containerElement.style.width = `${width}px`;
                containerElement.style.height = `${height}px`;

                const position = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2};
                viewport.camera.recenter((position.x / 2), (position.y / 2), 1);
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
        }, 250);

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
    }, [nodes, edges, viewport]);

    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedNodePath, setSelectedNodePath] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNode(null);
        setSelectedNodePath(null);
    };

    const handleSelectNode = (node) => {
        setSelectedNode(node);
    }

    return (
        <Space
            onCreate={vp => {
                setViewport(vp);
            }}
        >
            <Canvas
                ref={canvasRef}
                className="graph-canvas"
                nodes={nodes.map(node => {
                    const {height, width} = calculateNodeSize(node);
                    const connectedEdges = edges.filter(edge => edge.from === node.id || edge.to === node.id);
                    return {
                        id: node.id,
                        data: node.data,
                        path: node.path,
                        type: node.type,
                        height: height,
                        width: width,
                        parentId: node.parentId,
                        connectedNodeIds: node.connectedNodeIds,
                        connectedEdges: connectedEdges
                    };
                })}
                edges={edges.map(edge => ({
                    id: `edge-${edge.from}-${edge.to}`,
                    from: edge.from,
                    to: edge.to,
                }))}
                node={<Node
                    animated={false}
                    label={null}
                    onClick={(event, node) => {
                        setSelectedNode(node);
                        setSelectedNodePath(node.path);
                        setIsModalOpen(true);
                        console.log(node)
                    }}
                >
                    {event => {
                        return (
                            <foreignObject height={event.height} width={event.width} x={0} y={0}
                                           style={{pointerEvents: 'none'}}>
                                <div style={{
                                    padding: 10,
                                    textAlign: 'center',
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
                                        }}>{event.node.data}</span> :
                                        event.node.data ? Object.entries(event.node.data).map(([key, value], index) => (
                                            <div key={index} style={{textAlign: 'left'}}>
                                                <span style={{
                                                    color: '#51b6ff',
                                                    fontFamily: "monospace",
                                                    fontWeight: '500',
                                                    fontSize: "12px",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}>{key}: </span>
                                                <span style={{
                                                    color: getColorBasedOnType(value),
                                                    fontFamily: "monospace",
                                                    fontWeight: '500',
                                                    fontSize: "12px",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}>{JSON.stringify(value, null, 2)}</span>
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
            {selectedNode &&
                <NodeDetails nodeData={selectedNode} nodePath={selectedNodePath} nodes={nodes} edges={edges}
                             isOpen={isModalOpen}
                             onRequestClose={closeModal} onSelectNode={handleSelectNode}/>}
        </Space>
    );
});

GraphCanvas.displayName = 'GraphCanvas';

GraphCanvas.propTypes = {
    nodes: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
};

export default React.memo(GraphCanvas);
