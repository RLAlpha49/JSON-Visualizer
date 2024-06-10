// eslint-disable-next-line no-unused-vars
import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Tooltip from "./extras/Tooltip";
import styled from 'styled-components';
import {getColorBasedOnType} from './utils/TextColor';

Modal.setAppElement('#root');

const ModalContent = styled.div`
    padding: 10px 20px;
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const HeaderText = styled.h3`
    color: #4CAF50;
    font-family: monospace;
    font-weight: 500;
    font-size: 22px;
`;

const CloseButton = styled.button`
    background-color: transparent;
    border: none;
    color: #fff;
    font-family: monospace;
    font-weight: 500;
    font-size: 22px;
    cursor: pointer;
`;

const Body = styled.div``;

const Pre = styled.pre`
    color: #fff;
    font-family: "monospace";
    font-weight: 500;
    font-size: 14px;
    background-color: #111;
    border: 2px solid #4CAF50;
    padding: 15px 25px 15px 15px;
    border-radius: 5px;
    margin-bottom: 10px;
    min-width: 350px;
    width: auto;
`;

const P = styled.p`
    color: #fff;
    font-family: "monospace";
    font-weight: 500;
    font-size: 14px;
    background-color: #111;
    border: 2px solid #4CAF50;
    padding: 15px 25px 15px 15px;
    border-radius: 5px;
    margin-bottom: 10px;
    max-height: 150px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 10px;
        display: inherit !important;
    }

    &::-webkit-scrollbar-track {
        background: #111;
    }

    &::-webkit-scrollbar-thumb {
        background: #4CAF50;
        border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #45a049;
    }
`;

const TooltipDiv = styled.div`
    position: relative;
`;

const H4 = styled.h4`
    color: #4CAF50;
    font-size: 16px;
    font-family: monospace;
    font-weight: 500;
`;

const BasicSpan = styled.span`
    font-family: monospace;
    font-weight: 500;
    font-size: 12px;
`

const KeyOrValue = styled.span`
    font-family: monospace;
    font-weight: 500;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const PathButton = styled.button`
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    margin: 5px;
    cursor: pointer;
    font-family: "monospace";
    font-weight: 500;
    font-size: 12px;
    text-decoration: none;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;

const NodeDetails = ({nodeData, nodePath, nodes, edges, isOpen, onRequestClose, onSelectNode}) => {
    const preRef = useRef();
    const pRef = useRef();

    const handleCopy = (ref) => {
        navigator.clipboard.writeText(ref.current.textContent);
    };

    const handleNodeClick = (nodeID) => {
        const node = nodes.find(node => node.id === nodeID);
        onSelectNode(node);
    }

    const renderJsonContent = (data) => {
        if (typeof data === 'object' && data !== null) {
            return (
                <>
                    <BasicSpan style={{color: getColorBasedOnType('{')}}>{'{'}</BasicSpan>
                    {Object.entries(data).map(([key, value], index) => (
                        <div key={index} style={{textAlign: 'left', paddingLeft: '20px'}}>
                            <KeyOrValue style={{color: '#51b6ff'}}>{key}: </KeyOrValue>
                            <KeyOrValue
                                style={{color: getColorBasedOnType(value)}}>{JSON.stringify(value, null, 2)}</KeyOrValue>
                        </div>
                    ))}
                    <BasicSpan style={{color: getColorBasedOnType('}')}}>{'}'}</BasicSpan>
                </>
            );
        } else {
            return (
                <BasicSpan style={{color: getColorBasedOnType(data)}}>{JSON.stringify(data, null, 2)}</BasicSpan>
            );
        }
    };

    const renderPath = () => {
        let pathElements = [];

        if (nodeData.parentId !== null) {
            const parentEdge = edges.find(edge => edge.to === nodeData.id && edge.from === nodeData.parentId);
            pathElements.push(
                <div key={parentEdge.from}>
                    <PathButton
                        onClick={() => handleNodeClick(parentEdge.from)}>{parentEdge.from}</PathButton> → <PathButton
                    onClick={() => handleNodeClick(parentEdge.to)}>{parentEdge.to}</PathButton>
                </div>
            );
        }

        if (nodeData.connectedNodeIds && nodeData.connectedNodeIds.length > 0) {
            nodeData.connectedNodeIds.forEach((nodeId, index) => {
                const edge = edges.find(edge => edge.from === nodeData.id && edge.to === nodeId);
                pathElements.push(
                    <div key={index}>
                        <PathButton onClick={() => handleNodeClick(edge.from)}>{edge.from}</PathButton> → <PathButton
                        onClick={() => handleNodeClick(edge.to)}>{edge.to}</PathButton>
                    </div>
                );
            });
        }

        return pathElements.length > 0 ? pathElements : 'None';
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Node Details"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    zIndex: 10000
                },
                content: {
                    backgroundColor: '#1e1e1e',
                    width: 'fit-content',
                    height: 'fit-content',
                    margin: 'auto',
                    overflow: 'auto',
                    padding: '0px'
                }
            }}
        >
            <ModalContent>
                <Header>
                    <HeaderText>Node Details (ID: {nodeData.id})</HeaderText>
                    <CloseButton onClick={onRequestClose}>X</CloseButton>
                </Header>
                <Body>
                    <H4>JSON Content</H4>
                    <TooltipDiv>
                        <Pre ref={preRef}>
                            {renderJsonContent(nodeData.data)}
                        </Pre>
                        <Tooltip handleCopy={handleCopy} ref={pRef} tooltipText="Copy JSON"/>
                    </TooltipDiv>
                    <H4>JSON Path</H4>
                    <TooltipDiv>
                        <P ref={pRef} style={{color: '#bebbbb'}}>
                            {nodePath}
                        </P>
                        <Tooltip handleCopy={handleCopy} ref={pRef} tooltipText="Copy Path"/>
                    </TooltipDiv>
                    <H4>Node Path</H4>
                    <P ref={pRef} style={{color: '#bebbbb'}}>
                        {renderPath()}
                    </P>
                </Body>
            </ModalContent>
        </Modal>
    );
};

NodeDetails.propTypes = {
    nodeData: PropTypes.object.isRequired,
    nodePath: PropTypes.string.isRequired,
    nodes: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSelectNode: PropTypes.func.isRequired,
};

export default React.memo(NodeDetails);