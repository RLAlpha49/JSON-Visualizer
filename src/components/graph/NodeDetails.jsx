// eslint-disable-next-line no-unused-vars
import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Tooltip from "./extras/Tooltip";
import styled from 'styled-components';

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
    border: 1px solid #4CAF50;
    padding: 20px;
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
    border: 1px solid #4CAF50;
    padding: 15px 20px;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const NodeDetails = ({nodeData, nodePath, isOpen, onRequestClose}) => {
    const preRef = useRef();
    const pRef = useRef();

    const handleCopy = (ref) => {
        navigator.clipboard.writeText(ref.current.textContent);
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
                    <HeaderText>Node Details</HeaderText>
                    <CloseButton onClick={onRequestClose}>X</CloseButton>
                </Header>
                <Body>
                    <h4 style={{color: '#4CAF50', fontSize: '16px', fontFamily: "monospace", fontWeight: '500'}}>JSON
                        Content</h4>
                    <div style={{position: 'relative'}}>
                        <Pre ref={preRef}>
                            {JSON.stringify(nodeData, null, 2)}
                        </Pre>
                        <Tooltip handleCopy={handleCopy} ref={pRef} tooltipText="Copy JSON"/>
                    </div>
                    <h4 style={{color: '#4CAF50', fontSize: '16px', fontFamily: "monospace", fontWeight: '500'}}>JSON
                        Path</h4>
                    <div style={{position: 'relative'}}>
                        <P ref={pRef}>
                            {nodePath}
                        </P>
                        <Tooltip handleCopy={handleCopy} ref={pRef} tooltipText="Copy Path"/>
                    </div>
                </Body>
            </ModalContent>
        </Modal>
    );
};

NodeDetails.propTypes = {
    nodeData: PropTypes.object.isRequired,
    nodePath: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
};

export default NodeDetails;