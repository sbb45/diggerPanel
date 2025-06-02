import React from 'react';
import styled from "styled-components";
import {bgColor, grayColor} from "@/styles/colors";

type InputProps = {
    value: string;
    label: string;
    type?: string;
    onChange: (value: string) => void;
};


const InputWrapper = styled.div`
    width: 100%;
    margin-bottom: 16px;
    h4 {
        color: ${grayColor};
        font-size: 18px;
        margin-bottom: 4px;
    }
`

const InputBlock = styled.input`
    background-color: ${bgColor};
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 16px;
    width: 100%;
    min-height: 44px;
`

const Input = ({ value, label, onChange,type }: InputProps) => {
    return (
        <InputWrapper>
            <h4>{label}</h4>
            <InputBlock
                type={type ? type : 'text'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </InputWrapper>
    );
};

export default Input;
