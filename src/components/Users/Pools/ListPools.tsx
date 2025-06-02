'use client'
import React, { useEffect, useState } from 'react';
import {Pools, User} from '@/lib/types';
import { useUI } from '@/components/UI/UIProvider';
import Table from '@/components/UI/Table';
import {TableActions, TableBtn} from '@/app/admin/page.styled';
import AddPool from "@/components/Users/Pools/AddPool";
import Image from "next/image";

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
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const userId = row.Id;
    const { addToast, openModal, closeModal } = useUI();
    const [pools, setPools] = useState<Pools[]>([]);

    const fetchPools = async () => {
        try {
            const res = await fetch(`${api}/api/v1/users/${userId}/pools`, { credentials: 'include' });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setPools(data);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Error loading pools',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };

    useEffect(() => {
        fetchPools();
    }, [userId]);

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

    const deletePool = async (poolId: number) => {
        if (!confirm('Are you sure you want to delete this pool?')) return;

        try {
            const res = await fetch(`${api}/api/v1/pools/${poolId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error(await res.text());

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
                <Image src="/icons/close.svg" alt="delete" width={28} height={28} />
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
