import React from 'react';
import styled from "styled-components";
import {grayColor, primaryColor} from "@/styles/colors";

const TextCopyright = styled.p`
    color: ${grayColor};
    font-size: 14px;
    position: absolute;
    bottom: 16px;
    left: 50%;
    right: 50%;
    width: max-content;
    transform: translate(-50%, 0);
`
const LinkCopyright = styled.a`
    color: ${primaryColor};
`

const Copyright = () => {
    return (
        <TextCopyright>
            Copyright © 2024-2025
            <LinkCopyright href={'https://vaicom.tech/'}> VAICOM </LinkCopyright>
            (1.0.6)
        </TextCopyright>
    );
};

export default Copyright;