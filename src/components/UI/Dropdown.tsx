import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import Image from "next/image";
import {bgColor, grayColor, primaryColor, whiteColor} from "@/styles/colors";

type Option = {
    value: string,
    label: string
}
type DropdownProps = {
    options: Option[];
    value: Option;
    onChange: (option: Option) => void;
    label: string;
}

const DropdownWrapper = styled.div`
    position: relative;
`
const LabelDropdown = styled.p`
    color: ${grayColor};
    font-size: 18px;
    margin-bottom: 4px;
`
const DropdownHeader= styled.div`
    background-color: ${bgColor};
    border-radius: 8px;
    padding: 6px 12px 6px 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    font-size: 22px;
`
const DropdownList = styled.ul<{$isOpen: boolean}>`
    display: flex;
    justify-content: start;
    align-items: start;
    flex-direction: column;
    background-color: ${bgColor};
    padding: 8px;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    position: absolute;
    z-index: 20;
    top: 120%;
    max-height: ${({$isOpen}) => ($isOpen ? '200px' : '0')}; 
    opacity: ${({$isOpen}) => ($isOpen ? '1' : '0')}; 
    visibility: ${({$isOpen}) => ($isOpen ? 'visible' : 'hidden')};  
    transition: max-height 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
`
const DropdownLink = styled.li`
    font-size: 20px;
    cursor: pointer;
    padding: 6px 0 6px 8px;
    width: 100%;
    border-radius: 8px;
    &:hover{
        background-color: ${primaryColor};
        color: ${whiteColor};
        
    }
`

const Dropdown = ({options, value, onChange, label}:DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null)

    function toggleOpen(){
        setIsOpen((prev)=> !prev)
    }
    function handleSelect(option: Option){
        onChange(option);
        setIsOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent){
            if(
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ){
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, []);

    return (
        <DropdownWrapper ref={dropdownRef}>
            <LabelDropdown>{label}</LabelDropdown>
            <DropdownHeader onClick={toggleOpen}>
                <p>{value.label}</p>
                <Image src={'/icons/arrow.svg'} alt={'arrow'} width={32} height={32} />
            </DropdownHeader>
            <DropdownList $isOpen={isOpen}>
                {options.map((option, i)=>(
                    <DropdownLink key={i} onClick={()=> handleSelect(option)}>
                        {option.label}
                    </DropdownLink>
                ))}
            </DropdownList>
        </DropdownWrapper>
    );
};

export default Dropdown;