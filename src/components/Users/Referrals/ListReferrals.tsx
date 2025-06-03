'use client'
import React, { useState, useEffect } from 'react';
import AddReferral from "@/components/Users/Referrals/AddReferral"
import { useUI } from '@/components/UI/UIProvider';
import Table from '@/components/UI/Table';
import { TableActions, TableBtn } from '@/app/admin/page.styled';
import Image from 'next/image';
import {User} from "@/lib/types";

type Referral = {
    Id: number;
    Address: string;
    Login: string;
    Password: string;
    Percent: number;
};

type ListReferralsProps = {
    row: User;
    onSuccess: () => void;
};

const columns = [
    { key: 'Address', label: 'Pool' },
    { key: 'Login', label: 'Worker' },
    { key: 'Password', label: 'Password' },
    { key: 'Percent', label: 'Percent' },
    { key: 'actions', label: '' },
];

export default function ListReferrals({ row, onSuccess }: ListReferralsProps) {
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const userId = row.Id
    const { addToast, openModal, closeModal } = useUI();
    const [referrals, setReferrals] = useState<Referral[]>([]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${api}/api/v1/users`, { credentials: 'include' });
            if (!res.ok) throw new Error(await res.text());
            const allUsers: User[] = await res.json();

            const user = allUsers.find(u => u.Id === userId);
            if (!user) {
                setReferrals([]);
                return;
            }

            setReferrals(user.Referrals || []);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Error loading referrals',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [userId]);

    const deleteReferral = async (targetReferral: { Address: string; Login: string; Percent: number }) => {
        try {
            const res = await fetch(`${api}/api/v1/users`, { credentials: 'include' });
            if (!res.ok) throw new Error(await res.text());
            const allUsers: User[] = await res.json();

            const user = allUsers.find(u => u.Id === userId);
            if (!user) throw new Error('User not found');

            if (!user.Referrals || !Array.isArray(user.Referrals)) {
                throw new Error('User has no referrals');
            }

            // Фильтруем, исключая реферала с такими же уникальными полями
            const updatedReferrals = user.Referrals.filter(r => {
                return !(
                    r.Address === targetReferral.Address &&
                    r.Login === targetReferral.Login &&
                    r.Percent === targetReferral.Percent
                );
            });

            const updatedUser = { ...user, Referrals: updatedReferrals };

            const saveRes = await fetch(`${api}/api/v1/users/${user.Id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedUser),
            });

            if (!saveRes.ok) throw new Error(await saveRes.text());

            addToast({ type: 'success', title: 'Deleted', message: 'Referral deleted successfully' });
            fetchUsers();
            onSuccess();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Delete failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };




    const buttons = (referral: Referral) => (
        <TableActions>
            <TableBtn title="Delete referral" onClick={() => deleteReferral({
                Address: referral.Address,
                Login: referral.Login,
                Percent: referral.Percent,
            })}>
                <Image src="/icons/close.svg" alt="delete" width={28} height={28} />
            </TableBtn>
        </TableActions>
    );

    const handleAddReferral = () => {
        openModal(
            <AddReferral
                userId={userId}
                onClose={() => {
                    closeModal();
                    fetchUsers();
                    onSuccess();
                }}
                onSuccess={() => {
                    fetchUsers();
                    onSuccess();
                }}
            />,
            'Add Referral'
        );
    };

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0', width: '700px' }}>
                <Table columns={columns} data={referrals} buttons={buttons} />
            </div>
            <div className="btns">
                <button className="success" onClick={handleAddReferral}>
                    + Add Referral
                </button>
            </div>
        </div>
    );
}
