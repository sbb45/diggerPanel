'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styled, {keyframes} from 'styled-components';
import Image from 'next/image';
import {bgColor, bgHoverColor, blackColor, whiteColor} from "@/styles/colors";
import React from "react";
import { Filter } from "@/components/Agents/ShowFilters";
import {useUI} from "@/components/UI/UIProvider";
import ShowTypeFilterModal from "@/components/Agents/ShowTypeFilterModal";
import ShowPoolsModal from "@/components/Agents/ShowPoolsModal";
import ShowTimingsModal from "@/components/Agents/ShowTimingsModal";


const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TriggerButton = styled(DropdownMenu.Trigger)`
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    transition: background-color .4s ease;
    &:hover {
        background-color: ${bgHoverColor};
    }
`;

const Content = styled(DropdownMenu.Content)`
    min-width: 160px;
    max-height: 400px;
    overflow-y: auto;
    background: ${whiteColor};
    border-radius: 6px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    padding: 8px 0;
    user-select: none;
    z-index: 1001;
    display: flex;
    flex-direction: column; 
    gap: 4px;

    animation-duration: .4s;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-fill-mode: forwards;
    animation-name: ${({ side }) => (side === 'top' ? slideUp : slideDown)};
`;

const Item = styled(DropdownMenu.Item)`
    all: unset;
    font-size: 16px;
    padding: 10px 14px 10px 12px;
    cursor: pointer;
    color: ${blackColor};
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 8px;

    &:hover, &:focus {
        background-color: ${bgColor};
    }
`;

interface Action {
    label: string;
    image: string;
    onClick: () => void;
}

interface FilterOptionsButtonProps {
    agentId: number;
    filter: Filter;
    fetchFilters: ()=>void;
    toggleFilterDebug: (filter: Filter) => Promise<void>;
    actions?: Action[];
}

export default function FilterOptionsButton({ agentId, filter, fetchFilters, toggleFilterDebug, actions }: FilterOptionsButtonProps) {

    const {openModal, closeModal} = useUI();

    const defaultActions: Action[] = [
        {image:'globe', label: 'Debug State', onClick: debugFilter },
        {image:'fix', label: 'Filter Type', onClick: showTypeFilter },
        {image:'pools', label: 'Set Pool', onClick: showPools },
        {image:'users', label: 'Show Timings', onClick: showTimings },
    ];

    function debugFilter(){
        toggleFilterDebug(filter);
    }

    function showTypeFilter(){
        openModal(<ShowTypeFilterModal agentId={agentId} filter={filter} onClose={closeModal} onSuccess={fetchFilters} />, 'Filter Type')
    }
    function showPools(){
        openModal(<ShowPoolsModal agentId={agentId} filter={filter} onClose={closeModal} onSuccess={fetchFilters} />, 'Set Pool')
    }
    function showTimings(){
        openModal(<ShowTimingsModal agentId={agentId} filter={filter} onClose={closeModal} />, 'Filter Timings')
    }


    return (
        <DropdownMenu.Root>
            <TriggerButton title="Настройки" aria-label="Filter actions">
                <Image src="/admin/icons/options.svg" alt="options" width={28} height={28} />
            </TriggerButton>

            <DropdownMenu.Portal>
                <Content
                    side="bottom"
                    align="end"
                    sideOffset={6}
                    collisionPadding={8}
                >
                    {(actions ?? defaultActions).map(({image, label, onClick }, idx) => (
                        <Item
                            key={idx}
                            onSelect={() => {
                                onClick();
                            }}
                            role="menuitem"
                        >
                            <Image src={`/admin/icons/${image}.svg`} alt={'image'} width={28} height={28} />
                            {label}
                        </Item>
                    ))}
                </Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
} 