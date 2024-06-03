// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from "prop-types";
import styled from "styled-components";

const Button = styled.button`
    position: relative;
    margin-top: 10px;
    background-color: #4CAF50;
    border: 2px solid transparent;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    transition-duration: 0.4s;
    border-radius: 12px;

    &:hover {
        background-color: white;
        color: black;
        border: 2px solid #4CAF50;
    }
`;

function GraphButton({onClick}) {
    return (
        <Button id="graph-button" onClick={onClick}>
            Display JSON Graph
        </Button>
    );
}

GraphButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default GraphButton;