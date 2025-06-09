'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styled, {keyframes} from 'styled-components';
import Image from 'next/image';
import {AgentAll} from "@/lib/types";
import {bgColor, bgHoverColor, blackColor, whiteColor} from "@/styles/colors";
import {useUI} from "@/components/UI/UIProvider";
import React from "react";
import useConfirm from "@/components/UI/UseConfirm";
import EditAgentModal from "@/components/Agents/EditAgentModal";
import ShowConnections from "@/components/Agents/ShowConnections";
import ShowFilters from "@/components/Agents/ShowFilters";
import ShowTunnels from "@/components/Agents/ShowTunnels";
import ShowConfigModal from "@/components/Agents/ShowConfigModal";
import ShowCountersModal from "@/components/Agents/ShowCountersModal";
import {api} from "@/lib/const";


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
    row: AgentAll;
    fetchAgents: ()=>void
    actions?: Action[];
}

export default function OptionsButton({ row, actions,fetchAgents }: OptionsButtonProps) {
    const {addToast, openModal, closeModal} = useUI();
    const confirm = useConfirm();

    const agentId = row.Id

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
        {image:'disabled', label: 'Disable', onClick: disabled },
        {image:'refresh', label: 'Reload Agent', onClick: reloadAgent },
        {image:'sync', label: 'Restart Device', onClick: restartDevice },
        {image:'trash', label: 'Delete Agent', onClick: deleteAgent }
    ];


    function fillFormEditAgent(){
        openModal(<EditAgentModal row={row} onClose={closeModal} onSuccess={fetchAgents} />, 'Edit Agent')
    }
    function showConnections(){
        openModal(<ShowConnections row={row} onClose={closeModal} />, 'Remote connections')
    }
    function showFilters(){
        openModal(<ShowFilters row={row} onClose={closeModal} />, 'Remote filters')
    }
    async function cleanFilters(){
        const ok = await confirm({
            title: 'Clean filters',
            image: 'eraserRed.svg',
            message: 'Are you sure you want to clean the filters?',
            confirmText: 'Clean',
        })
        if (!ok) return;
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/filters-clean`,{
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Restart error'); 
            }
            addToast({
                type: 'success',
                title: 'Filters Cleaned',
                message: 'All filters have been successfully cleaned'
            })
        }catch (err){
            addToast({
                type: 'danger',
                title: 'Cleaning error',
                message: err instanceof Error ? err.message : 'Failed to clean filters'
            })
            console.error(err)
        }
    }
    function showTunnels(){
        openModal(<ShowTunnels row={row} onClose={closeModal} />, 'Show Tunnels')
    }
    function showCounters(){
        openModal(<ShowCountersModal row={row} onClose={closeModal} />, 'Remote counters')
    }
    async function cleanCounters(){
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/counters-clean`,{
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Restart error'); 
            }
            addToast({
                type: 'success',
                title: 'Counters Cleaned',
                message: 'All counters have been successfully cleaned'
            })
        }catch (err){
            addToast({
                type: 'danger',
                title: 'Cleaning error',
                message: err instanceof Error ? err.message : 'Failed to clean counters'
            })
            console.error(err)
        }
    }
    async function resetStatistics(){
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/reset-statistics`,{
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Restart error'); 
            }
            addToast({
                type: 'success',
                title: 'Statistics Reset',
                message: 'Agent statistics have been successfully reset'
            })
        }catch (err){
            addToast({
                type: 'danger',
                title: 'Reset error',
                message: err instanceof Error ? err.message : 'Failed to reset statistics'
            })
            console.error(err)
        }
    }
    function showConfig(){
        openModal(<ShowConfigModal row={row} onClose={closeModal} />, 'Remote config')
    }
    async function downloadLogs(){
        window.open(`${api}api/v1/agents/${agentId}/command/logs`, "_blank")
    }
    async function cleanLogs(){
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/logs-clean`,{
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Restart error'); 
            }
            addToast({
                type: 'success',
                title: 'Logs Cleaned',
                message: 'All logs have been successfully cleaned'
            })
        }catch (err){
            addToast({
                type: 'danger',
                title: 'Cleaning error',
                message: err instanceof Error ? err.message : 'Failed to clean logs'
            })
            console.error(err)
        }
    }
    async function upgradeAgent(){
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/upgrade`,{
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Restart error'); 
            }
            addToast({
                type: 'success',
                title: 'Agent Upgraded',
                message: 'Agent was successfully upgraded'
            })
        }catch (err){
            addToast({
                type: 'danger',
                title: 'Upgrade error',
                message: err instanceof Error ? err.message : 'Failed to upgrade agent'
            })
            console.error(err)
        }
    }
    async function revertAgent(){
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/revert`,{
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Restart error'); 
            }
            addToast({
                type: 'success',
                title: 'Agent Reverted',
                message: 'Agent was successfully reverted to previous version'
            })
        }catch (err){
            addToast({
                type: 'danger',
                title: 'Revert error',
                message: err instanceof Error ? err.message : 'Failed to revert agent'
            })
            console.error(err)
        }
    }
    async function disabled(){
        const state = row.State
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/state/${!state}`,{
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Restart error'); 
            }
            addToast({
                type: 'success',
                title: !state ? 'Agent Disabled' : 'Agent Enabled',
                message: `Agent was successfully ${!state ? 'disabled' : 'enabled'}`
            })
        }catch (err){
            addToast({
                type: 'danger',
                title: 'State switch error',
                message: err instanceof Error ? err.message : 'Failed to switch agent state'
            })
            console.error(err)
        }
    }
    async function reloadAgent(){
        const ok = await confirm({
            title: 'Reload agent',
            image: 'syncRed.svg',
            message: 'Are you sure you want to reload the agent?',
            confirmText: 'Reload',
        })
        if (!ok) return;
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/reload`,{
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Restart error'); 
            }
            addToast({
                type:'success',
                title: 'Reloaded',
                message: 'Agent successfully reloaded'
            })
        }catch (err){
            addToast({
                type: 'danger',
                title: 'Reload error',
                message: err instanceof Error ? err.message : 'Failed to reload agent'
            })
            console.error(err)
        }
    }
    async function restartDevice(){
        const ok = await confirm({
            title: 'Restart device',
            image: 'reloadRed.svg',
            message: 'Are you sure you want to reset the device?',
            confirmText: 'Restart',
        })
        if (!ok) return;
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/restart`,{
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Restart error'); 
            }
            addToast({
                type:'success',
                title: 'Restarted',
                message: 'Device restarted successfully'
            })
        }catch (err){
            addToast({
                type:'danger',
                title: 'Restart error',
                message: err instanceof Error ? err.message : 'Failed to restart device'
            })
            console.error(err)
        }
    }
    async function deleteAgent(){
        const ok = await confirm({
            title: 'Delete Agent',
            message: 'Are you sure you want to delete the agent?',
        })
        if (!ok) return;
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}`,{
                method: 'DELETE',
                credentials: 'include'
            })
            if(!res.ok) throw new Error('Deletion error');
            addToast({
                type:'success',
                title: 'Reloaded',
                message: 'Agent successfully deleted'
            })
        }catch (err){
            addToast({
                type:'danger',
                title: 'Deletion error',
                message: err instanceof Error ? err.message : 'Unknown error'
            })
            console.error(err)
        }
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
                            <Image src={`/icons/${image}.svg`} alt={'image'} width={28} height={28} />
                            {label}
                        </Item>
                    ))}
                </Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
