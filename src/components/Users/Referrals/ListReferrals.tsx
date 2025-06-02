'use client'
import React, { useState, useEffect } from 'react';
import Input from '@/components/UI/Input';
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

const AddReferral = ({ userId, onClose, onSuccess }: { userId: number; onClose: () => void; onSuccess: () => void }) => {
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const { addToast, closeModal } = useUI();

    const [address, setAddress] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [percent, setPercent] = useState<number>(0);

    async function saveReferral() {
        try {
            const body = {
                UserId: userId,
                Address: address,
                Login: login,
                Password: password,
                Percent: percent,
            };
            const res = await fetch(`${api}/api/v1/referrals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(await res.text());

            addToast({ type: 'success', title: 'Created', message: 'Referral added successfully' });
            onSuccess();
            closeModal();
            onClose();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Creation failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    }

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0' }}>
                <Input label="Address" value={address} onChange={setAddress} />
                <Input label="Login" value={login} onChange={setLogin} />
                <Input label="Password" value={password} onChange={setPassword} />
                <Input label="Percent" value={percent.toString()} onChange={val => setPercent(Number(val))} />
            </div>
            <div className="btns">
                <button onClick={onClose} className="cancel">
                    Cancel
                </button>
                <button onClick={saveReferral} className="success" disabled={!address || !login || percent <= 0}>
                    Create
                </button>
            </div>
        </div>
    );
};

export default function ListReferrals({ row, onSuccess }: ListReferralsProps) {
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const userId = row.Id
    const { addToast, openModal, closeModal } = useUI();
    const [referrals, setReferrals] = useState<Referral[]>([]);

    const fetchReferrals = async () => {
        try {
            const res = await fetch(`${api}/api/v1/users/${userId}/referrals`, { credentials: 'include' });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setReferrals(data);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Error loading referrals',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, [userId]);

    const deleteReferral = async (referralId: number) => {
        if (!confirm('Are you sure you want to delete this referral?')) return;

        try {
            const res = await fetch(`${api}/api/v1/referrals/${referralId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error(await res.text());

            addToast({ type: 'success', title: 'Deleted', message: 'Referral deleted successfully' });
            fetchReferrals();
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
            <TableBtn title="Delete referral" onClick={() => deleteReferral(referral.Id)}>
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
                    fetchReferrals();
                    onSuccess();
                }}
                onSuccess={() => {
                    fetchReferrals();
                    onSuccess();
                }}
            />,
            'Add Referral'
        );
    };

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0', width: '100%' }}>
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
