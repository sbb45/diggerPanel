'use client'
import React, { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { useUI } from '@/components/UI/UIProvider';
import Table from '@/components/UI/Table';
import { TableActions, TableBtn } from '@/app/admin/page.styled';
import Image from 'next/image';
import AddServer from "@/components/Users/Server/AddServer";

type Server = {
    Id: number;
    Name: string;
    Addr: string;
    Online: boolean;
};

type ListServersProps = {
    row: User;
    onSuccess: () => void;
};

const columns = [
    { key: 'Name', label: 'Name' },
    { key: 'Addr', label: 'Address' },
    { key: 'actions', label: '' },
];

export default function ListServer({ row, onSuccess }: ListServersProps) {
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const userId = row.Id;
    const { addToast, openModal, closeModal } = useUI();
    const [servers, setServers] = useState<Server[]>([]);

    const fetchServers = async () => {
        try {
            const res = await fetch(`${api}/api/v1/users/${userId}/servers`, { credentials: 'include' });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setServers(data);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Error loading servers',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };

    useEffect(() => {
        fetchServers();
    }, [userId]);

    const handleAddServer = () => {
        openModal(
            <AddServer
                userId={userId}
                onClose={() => {
                    closeModal();
                    fetchServers();
                    onSuccess();
                }}
                onSuccess={() => {
                    fetchServers();
                    onSuccess();
                }}
            />,
            'Add Server'
        );
    };

    const deleteServer = async (serverId: number) => {
        if (!confirm('Are you sure you want to delete this server?')) return;

        try {
            const res = await fetch(`${api}/api/v1/servers/${serverId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error(await res.text());

            addToast({ type: 'success', title: 'Deleted', message: 'Server deleted successfully' });
            fetchServers();
            onSuccess();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Delete failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };

    const buttons = (server: Server) => (
        <TableActions>
            <TableBtn title="Delete server" onClick={() => deleteServer(server.Id)}>
                <Image src="/icons/close.svg" alt="delete" width={28} height={28} />
            </TableBtn>
        </TableActions>
    );

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0', width: '100%' }}>
                <Table columns={columns} data={servers} buttons={buttons} />
            </div>
            <div className="btns">
                <button className="success" onClick={handleAddServer}>
                    + Add Server
                </button>
            </div>
        </div>
    );
}
