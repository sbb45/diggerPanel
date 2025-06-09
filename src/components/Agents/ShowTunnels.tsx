import React, {useEffect, useState} from 'react';
import {AgentAll} from "@/lib/types";
import {api} from "@/lib/const";
import {useUI} from "@/components/UI/UIProvider";
import Table from "@/components/UI/Table";
import {TableActions, TableBtn} from "@/app/admin/page.styled";
import Image from "next/image";
import Input from "@/components/UI/Input";

type ShowTunnelsProps = {
    row: AgentAll,
    onClose: ()=>void
}

interface Tunnel {
    Port: number;
    Address: string;
}

const columns = [
    {key: 'Port', label: 'Port'},
    {key: 'actions', label: ''},
];

const ShowTunnels = ({row, onClose}:ShowTunnelsProps) => {
    const {addToast, openModal} = useUI();
    const [tunnels, setTunnels] = useState<Tunnel[]>([]);

    const fetchTunnels = async () => {
        try{
            const res = await fetch(`${api}api/v1/agents/${row.Id}/command/tunnels-ports`,{
                credentials: 'include'
            })
            if(!res.ok){
                const text = await res.text();
                throw new Error(text || 'Unknown error')
            }
            const data = await res.json();
            setTunnels(data.map((port: number) => ({ Port: port, Address: row.Address || '' })) || [])
        }catch (err){
            addToast({
                type: 'danger',
                title: 'Tunnels error',
                message: err instanceof Error ? err.message : 'Failed to fetch tunnels'
            });
            onClose();
        }
    }

    const closeTunnel = async (port: number) => {
        try {
            await fetch(`${api}api/v1/agents/${row.Id}/command/tunnel-del/${port}`, {
                method: 'POST',
                credentials: 'include',
            });
            fetchTunnels();
            addToast({ type: 'success', title: 'Tunnel closed', message: `Tunnel on port ${port} closed successfully` });
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Close Tunnel error',
                message: err instanceof Error ? err.message : 'Failed to close tunnel'
            });
        }
    };

    const buttons = (tunnel: Tunnel) => (
        <TableActions>
            <TableBtn title="Browse" onClick={() => window.open(`http://${row.Address}:${tunnel.Port}`, '_blank')} disabled={!row.Address}>
                <Image src="/icons/chrome.svg" alt="browse" width={20} height={20} />
            </TableBtn>
            <TableBtn title="Close" onClick={() => closeTunnel(tunnel.Port)}>
                <Image src="/icons/close.svg" alt="close" width={20} height={20} />
            </TableBtn>
        </TableActions>
    );

    useEffect(() => {
        fetchTunnels()
    }, []);

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0', width: '100%' }}>
                <Table
                    columns={columns}
                    data={tunnels}
                    buttons={buttons}
                    style={{ minWidth: "300px", margin: '0 auto' }}
                />
            </div>
            <div className="btns">
                <button className="success" onClick={() => openModal(<AddTunnelModal agentId={Number(row.Id)} onSuccess={fetchTunnels} />, "Add Tunnel")}>+ Add Tunnel</button>
            </div>
        </div>
    );
};


const AddTunnelModal = ({ agentId, onSuccess }: { agentId: number; onSuccess: () => void }) => {
    const { closeModal, addToast } = useUI();
    const [dst, setDst] = useState('');

    const handleSubmit = async () => {

        if (!dst.trim()) {
            addToast({
                type: 'danger',
                title: 'Validation Error',
                message: 'Destination port cannot be empty.',
            });
            return;
        }

        try {
           
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/tunnel-add/${dst.trim()}`, {
                method: 'POST',
                credentials: 'include',
            });
            
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Unknown error');
            }
            addToast({ type: 'success', title: 'Tunnel Added', message: 'New tunnel added' });
            closeModal();
            onSuccess();
             alert('erg')
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Add Tunnel error',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };

    return (
        <div className="modal">
            <div className="content" style={{ maxWidth: 400, margin: '0 auto' }}>
                <Input
                    label="DST"
                    value={dst}
                    onChange={setDst}
                    type="text"
                />
                <div className="btns" style={{ textAlign: 'right' }}>
                    <button
                        className="success"
                        onClick={handleSubmit}
                        style={{ padding: '8px 16px' }}
                    >
                        {'+ Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowTunnels;