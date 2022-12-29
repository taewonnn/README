import React from 'react';
import styled from 'styled-components';
import defaultTheme from '../../../commons/style/themes/default';

export const TopNavBarHeader = styled.header`
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    padding: 0px 18px;
    border-bottom: 1px solid #dbdbdb;
`;

export const TopNavBarWrapBg = styled.div`
    width: 100%;
    height: 48px;
    padding: 10px 20px 8px;
    background-color: ${defaultTheme.palette.white};
    border-bottom: 1px solid ${defaultTheme.palette.primary};
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    position: fixed;
`;

function TopNavBarWrap() {
    return (
        <TopNavBarHeader>
            <TopNavBarWrapBg></TopNavBarWrapBg>
        </TopNavBarHeader>
    );
}

export default TopNavBarWrap;
