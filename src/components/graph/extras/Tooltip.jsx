// eslint-disable-next-line no-unused-vars
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCopy} from '@fortawesome/free-solid-svg-icons';

const TooltipContainer = styled.div`
    user-select: none;
`;

const TooltipText = styled.span`
    visibility: hidden;
    width: 100px;
    background-color: #fff;
    color: #000;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    margin-top: 5px;
    margin-right: 30px;
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.3s;

    ${TooltipContainer}:hover & {
        visibility: visible;
        opacity: 1;
    }
`;

const Tooltip = forwardRef(({handleCopy, tooltipText}, ref) => (
    <TooltipContainer>
        <button onClick={() => handleCopy(ref)} style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'transparent',
            border: 'none',
            paddingTop: '10px',
            paddingRight: '10px',
            fontSize: '16px',
            cursor: 'pointer'
        }}>
            <FontAwesomeIcon icon={faCopy}/>
        </button>
        <TooltipText>{tooltipText}</TooltipText>
    </TooltipContainer>
));

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
    handleCopy: PropTypes.func.isRequired,
    tooltipText: PropTypes.string.isRequired,
};

export default Tooltip;