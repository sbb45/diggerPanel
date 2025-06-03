'use client';
import React, { useState } from 'react';
import Input from '@/components/UI/Input';
import { useUI } from '@/components/UI/UIProvider';
import { User, Pools } from '@/lib/types';
import {api} from "@/lib/const";

type AddPoolProps = {
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
};

export default function AddPool({ userId, onClose, onSuccess }: AddPoolProps) {
    const { addToast, closeModal } = useUI();

    const [address, setAddress] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');
    const [loading, setLoading] = useState(false);

    const savePool = async () => {
        setLoading(true);
        try {
            const resUsers = await fetch(`${api}/api/v1/users`, { credentials: 'include' });
            if (!resUsers.ok) throw new Error(await resUsers.text());
            const allUsers: User[] = await resUsers.json();

            const user = allUsers.find(u => u.Id === userId);
            if (!user) throw new Error('User not found');

            const newPool: Partial<Pools> = {
                Address: address,
                Login: login,
                Password: password,
                Type: type,
            };

            const updatedPools = user.Pools ? [...user.Pools, newPool] : [newPool];

            const updatedUser = { ...user, Pools: updatedPools };

            const resSave = await fetch(`${api}/api/v1/users/${user.Id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedUser),
            });

            if (!resSave.ok) throw new Error(await resSave.text());

            addToast({ type: 'success', title: 'Created', message: 'Pool added successfully' });
            onSuccess();
            closeModal();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Create failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0' }}>
                <Input label="Address" value={address} onChange={setAddress} />
                <Input label="Login" value={login} onChange={setLogin} />
                <Input label="Password" value={password} onChange={setPassword} />
                <Input label="Type" value={type} onChange={setType} />
            </div>
            <div className="btns">
                <button onClick={onClose} className="cancel" disabled={loading}>
                    Cancel
                </button>
                <button onClick={savePool} className="success" disabled={loading || !address || !login}>
                    {loading ? 'Saving...' : 'Create'}
                </button>
            </div>
        </div>
    );
}
