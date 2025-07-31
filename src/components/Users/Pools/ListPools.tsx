'use client'
import React, {useCallback, useEffect, useState} from 'react';
import {Pools, User} from '@/lib/types';
import { useUI } from '@/components/UI/UIProvider';
import Table from '@/components/UI/Table';
import {TableActions, TableBtn} from '@/app/page.styled';
import AddPool from "@/components/Users/Pools/AddPool";
import Image from "next/image";
import {api} from "@/lib/const";

type ListPoolsProps = {
    row: User;
    onSuccess: () => void;
};

const columns = [
    { key: 'Address', label: 'Address' },
    { key: 'Login', label: 'Login' },
    { key: 'Password', label: 'Password' },
    { key: 'Type', label: 'Type' },
    { key: 'actions', label: '' },
];

export default function ListPools({ row, onSuccess }: ListPoolsProps) {
    const userId = row.Id;
    const { addToast, openModal, closeModal } = useUI();
    const [pools, setPools] = useState<Pools[]>([]);

    const fetchPools = useCallback(async () => {
        try {
            const res = await fetch(`${api}api/v1/users`, { credentials: 'include' });
            if (!res.ok) throw new Error(await res.text());
            const allUsers: User[] = await res.json();

            const user = allUsers.find(u => u.Id === userId);
            if (!user) {
                setPools([]);
                return;
            }

            const mappedPools: Pools[] = (user.Pools || []).map((pool, index) => ({
                Id: index,
                Note: '',
                Login: pool.Login,
                Address: pool.Address,
                Type: pool.Type,
                Username: pool.Login,
                Password: pool.Password,
                Worker: '',
                FilterKeys: undefined,
                Updated: new Date().toISOString(),
                State: false
            }));

            setPools(mappedPools);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Error loading pools',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    }, [userId, addToast]);

    useEffect(() => {
        fetchPools();
    }, [fetchPools]);

    const handleAddPool = () => {
        openModal(
            <AddPool
                userId={userId}
                onClose={() => {
                    closeModal();
                    fetchPools();
                    onSuccess();
                }}
                onSuccess={() => {
                    fetchPools();
                    onSuccess();
                }}
            />,
            'Add Pool'
        );
    };

    const deletePool = async (index: number) => {
        try {
            const resUsers = await fetch(`${api}api/v1/users`, { credentials: 'include' });
            if (!resUsers.ok) throw new Error(await resUsers.text());
            const allUsers: User[] = await resUsers.json();

            const user = allUsers.find(u => u.Id === userId);
            if (!user) throw new Error('User not found');

            const updatedPools = [...(user.Pools || [])];
            updatedPools.splice(index, 1);

            const updatedUser = { ...user, Pools: updatedPools };

            const resSave = await fetch(`${api}api/v1/users/${user.Id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedUser),
            });

            if (!resSave.ok) throw new Error(await resSave.text());

            addToast({ type: 'success', title: 'Deleted', message: 'Pool deleted successfully' });
            fetchPools();
            onSuccess();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Delete failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };



    const buttons = (pool: Pools) => (
        <TableActions>
            <TableBtn title="Delete pool" onClick={() => deletePool(pool.Id)}>
                <Image src="/admin/icons/close.svg" alt="delete" width={28} height={28} />
            </TableBtn>
        </TableActions>
    );

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0', width: '100%' }}>
                <Table columns={columns} data={pools} buttons={buttons} />
            </div>
            <div className="btns">
                <button className="success" onClick={handleAddPool}>+ Add Pool</button>
            </div>
        </div>
    );
}
