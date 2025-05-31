import React from 'react';
import styled from "styled-components";
import Image from "next/image";
import {bgColor, bgHoverColor} from "@/styles/colors";

type ClearFilterProps = {
    onClick: ()=> void;
    title: string;
    image: string;
}

const Button = styled.button`
    background-color: ${bgColor};
    border-radius: 8px;
    padding: 6px 12px;
    min-height: 44px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 22px;
    transition: background-color .4s ease;
    &:hover{
        background-color: ${bgHoverColor};
    }
`

const FunctionBtn: React.FC<ClearFilterProps> = ({onClick,title,image}) => {
    return (
        <Button onClick={onClick}>
            <Image src={'/icons/'+image} alt={image} width={24} height={24} />
            {title}
        </Button>
    );
};

export default FunctionBtn;