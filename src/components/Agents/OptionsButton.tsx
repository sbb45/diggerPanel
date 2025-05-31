'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styled, {keyframes} from 'styled-components';
import Image from 'next/image';
import {AgentAll} from "@/lib/types";
import {bgColor, bgHoverColor, blackColor, primaryColor, whiteColor} from "@/styles/colors";

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
    z-index: 999;
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
    row: AgentAll;
    actions?: Action[];
}

export default function OptionsButton({ row, actions }: OptionsButtonProps) {
    const defaultActions: Action[] = [
        {image:'edit', label: 'Edit Agent', onClick: fillFormEditAgent },
        {image:'sort-horizontal', label: 'Show Connections', onClick: showConnections },
        {image:'filter', label: 'Show Filters', onClick: showFilters },
        {image:'eraser', label: 'Clean Filters', onClick: cleanFilters},
        {image:'shuffle', label: 'Show Tunnels', onClick: showTunnels },
        {image:'globe', label: 'Show Counters', onClick: showCounters },
        {image:'eraser', label: 'Clean Counters', onClick: cleanCounters },
        {image:'percent', label: 'Reset Statistics', onClick: resetStatistics },
        {image:'fix', label: 'Show Config', onClick: showConfig },
        {image:'file-lines', label: 'Download Logs', onClick: downloadLogs },
        {image:'trash', label: 'Clean Logs', onClick: cleanLogs },
        {image:'download', label: 'Upgrade Agent', onClick: upgradeAgent },
        {image:'refresh', label: 'Revert Agent', onClick: revertAgent },
        {image:'disabled', label: 'disable', onClick: disabled },
        {image:'refresh', label: 'Reload Agent', onClick: reloadAgent },
        {image:'sync', label: 'Restart Device', onClick: restartAgent },
        {image:'trash', label: 'Delete Agent', onClick: deleteAgent }
    ];


    function fillFormEditAgent(){
        alert('ger')
    }
    function showConnections(){
        alert('ger')
    }
    function showFilters(){
        alert('ger')
    }
    function cleanFilters(){
        alert('ger')
    }
    function showTunnels(){
        alert('ger')
    }
    function showCounters(){
        alert('ger')
    }
    function cleanCounters(){
        alert('ger')
    }
    function resetStatistics(){
        alert('ger')
    }
    function showConfig(){
        alert('ger')
    }
    function downloadLogs(){
        alert('ger')
    }
    function cleanLogs(){
        alert('ger')
    }
    function upgradeAgent(){
        alert('ger')
    }
    function revertAgent(){
        alert('ger')
    }
    function disabled(){
        alert('ger')
    }
    function reloadAgent(){
        alert('ger')
    }
    function restartAgent(){
        alert('ger')
    }
    function deleteAgent(){
        alert('ger')
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
                            onSelect={e => {
                                e.preventDefault();
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
