'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styled, {keyframes} from 'styled-components';
import Image from 'next/image';
import {AgentAll, User} from "@/lib/types";
import {bgColor, blackColor, whiteColor} from "@/styles/colors";
import {useUI} from "@/components/UI/UIProvider";
import React from "react";
import useConfirm from "@/components/UI/UseConfirm";
import FillFormEditUser from "@/components/Users/fillFormEditUser";
import AgentList from "@/components/Users/AgentList";
import ListPools from "@/components/Users/Pools/ListPools";
import ListServers from "@/components/Users/Server/ListServer";
import ListServer from "@/components/Users/Server/ListServer";
import ListReferrals from "@/components/Users/Referrals/ListReferrals";

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
    width: 36px;
    height: 36px;
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
    z-index: 500;
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

interface OptionsButtonProps {
    row: User;
    fetchUsers: ()=>void
    actions?: Action[];
}

export default function OptionUser({ row,actions, fetchUsers }: OptionsButtonProps) {
    const {openModal, closeModal} = useUI();

    const defaultActions: Action[] = [
        {image:'edit', label: 'Edit User', onClick: fillFormEditUser },
        {image:'sort-horizontal', label: 'Agent Pools', onClick: agentList },
        {image:'edit', label: 'Pool Pools', onClick: poolList },
        {image:'file-lines', label: 'Server List', onClick: serverList },
        {image:'percent', label: 'Referrals', onClick: referralsList },
    ];

    async function fillFormEditUser(){
        openModal(<FillFormEditUser row={row} onClose={closeModal} onSuccess={fetchUsers} />, 'Edit User')
    }
    async function agentList(){
        openModal(<AgentList row={row} onSuccess={fetchUsers} />, 'AgentList')
    }

    async function poolList(){
        openModal(<ListPools row={row} onSuccess={fetchUsers} />, 'Pool Pools')
    }

    async function serverList(){
        openModal(<ListServer row={row} onSuccess={fetchUsers} />, 'Server List')
    }

    async function referralsList(){
        openModal(<ListReferrals row={row} onSuccess={fetchUsers} />, 'Referrals')
    }



    return (
        <DropdownMenu.Root>
            <TriggerButton title="Настройки" aria-label="Agent actions">
                <Image src="/icons/options.svg" alt="options" width={28} height={28} />
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
                            <Image src={`/icons/${image}.svg`} alt={'image'} width={20} height={20} />
                            {label}
                        </Item>
                    ))}
                </Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
