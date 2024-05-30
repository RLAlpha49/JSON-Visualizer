// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const NodeDetails = ({ nodeData, nodePath, isOpen, onRequestClose }) => {
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
                    color: '#fff',
                    backgroundColor: '#1e1e1e',
                    width: 'fit-content',
                    height: 'fit-content',
                    margin: 'auto',
                    overflow: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }}
        >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <h3 style={{ color: '#4CAF50' }}>Node Details</h3>
                <button style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '20px',
                    cursor: 'pointer',
                }} onClick={onRequestClose}>X</button>
            </div>
            <h4 style={{ color: '#4CAF50' }}>JSON Content:</h4>
            <pre style={{ color: '#fff' }}>{JSON.stringify(nodeData, null, 2)}</pre>
            <h4 style={{ color: '#4CAF50' }}>JSON Path:</h4>
            <p style={{ color: '#fff' }}>{nodePath}</p>
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