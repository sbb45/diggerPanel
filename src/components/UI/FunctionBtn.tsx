import React from 'react';
import styled from "styled-components";
import Image from "next/image";
import {bgColor, bgHoverColor, blackColor, primaryColor, primaryHoverColor, whiteColor} from "@/styles/colors";

type ClearFilterProps = {
    onClick: ()=> void;
    title: string;
    image: string;
    primary?:boolean
}

const Button = styled.button<{ $primary?: boolean }>`
    background-color: ${({ $primary }) => ($primary ? primaryColor : bgColor)};
    border-radius: 8px;
    padding: 6px 12px;
    min-height: 44px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    transition: background-color .4s ease;
    color: ${({$primary})=>($primary ? whiteColor : blackColor)};
    &:hover{
        background-color: ${({ $primary }) => ($primary ? primaryHoverColor : bgHoverColor)};
    }
`

const FunctionBtn: React.FC<ClearFilterProps> = ({onClick,title,image,primary}) => {
    return (
        <Button onClick={onClick} $primary={primary}>
            <Image src={'/icons/'+image} alt={image} width={26} height={26} />
            {title}
        </Button>
    );
};

export default FunctionBtn;