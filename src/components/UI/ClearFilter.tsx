import React from 'react';
import styled from "styled-components";
import Image from "next/image";
import {bgColor, bgHoverColor} from "@/styles/colors";

type ClearFilterProps = {
    onClick: ()=> void
}

const BtnClear = styled.button`
    background-color: ${bgColor};
    height: 44px;
    width: 44px;
    border-radius: 8px;
    transition: background-color .4s ease;
    &:hover{
        background-color: ${bgHoverColor};
    }
`

const ClearFilter: React.FC<ClearFilterProps> = ({onClick}) => {
    return (
        <BtnClear onClick={onClick}>
            <Image src={'/admin/icons/close.svg'} alt={'close'} width={28} height={28} />
        </BtnClear>
    );
};

export default ClearFilter;