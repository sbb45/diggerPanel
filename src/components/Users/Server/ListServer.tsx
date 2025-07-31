'use client'
import React, {useCallback, useEffect, useState} from 'react';
import { User } from '@/lib/types';
import { useUI } from '@/components/UI/UIProvider';
import Table from '@/components/UI/Table';
import { TableActions, TableBtn } from '@/app/page.styled';
import Image from 'next/image';
import AddServer from "@/components/Users/Server/AddServer";
import {api} from "@/lib/const";

type Server = {
    Name: string;
    Addr: string;
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
    const userId = row.Id;
    const { addToast, openModal, closeModal } = useUI();
    const [servers, setServers] = useState<Server[]>([]);

    const fetchServers = useCallback(async () => {
        try {
            const res = await fetch(`${api}api/v1/users`, { credentials: 'include' });
            if (!res.ok) throw new Error(await res.text());
            const allUsers: User[] = await res.json();

            const user = allUsers.find(u => u.Id === userId);
            if (!user) {
                setServers([]);
                return;
            }
            setServers(user.Servers || []);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Error loading servers',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    }, [userId, addToast]);

    useEffect(() => {
        fetchServers();
    }, [fetchServers]);

    // Удаление сервера — обновляем список и отправляем обновлённого пользователя
    const deleteServer = async (index: number) => {
        if (!confirm('Are you sure you want to delete this server?')) return;

        try {
            const resUsers = await fetch(`${api}api/v1/users`, { credentials: 'include' });
            if (!resUsers.ok) throw new Error(await resUsers.text());
            const allUsers: User[] = await resUsers.json();

            const user = allUsers.find(u => u.Id === userId);
            if (!user) throw new Error('User not found');

            const updatedServers = [...(user.Servers || [])];
            updatedServers.splice(index, 1);

            const updatedUser = { ...user, Servers: updatedServers };

            const resSave = await fetch(`${api}api/v1/users/${user.Id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedUser),
            });

            if (!resSave.ok) throw new Error(await resSave.text());

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

    const buttons = (server: Server) => {
        const index = servers.findIndex(s => s === server);
        return (
            <TableActions>
                <TableBtn title="Delete server" onClick={() => deleteServer(index)}>
                    <Image src="/admin/icons/close.svg" alt="delete" width={28} height={28} />
                </TableBtn>
            </TableActions>
        );
    };


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
