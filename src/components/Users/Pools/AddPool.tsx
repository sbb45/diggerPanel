'use client';
import React, { useState } from 'react';
import Input from '@/components/UI/Input';
import { useUI } from '@/components/UI/UIProvider';

type AddPoolProps = {
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
};

export default function AddPool({ userId, onClose, onSuccess }: AddPoolProps) {
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const { addToast, closeModal } = useUI();

    const [address, setAddress] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');

    const savePool = async () => {
        try {
            const item = {
                UserId: userId,
                Address: address,
                Login: login,
                Password: password,
                Type: type,
            };

            const res = await fetch(`${api}/api/v1/pools`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(item),
            });

            if (!res.ok) throw new Error(await res.text());

            addToast({ type: 'success', title: 'Created', message: 'Pool added successfully' });
            onSuccess();
            closeModal();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Create failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
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
                <button onClick={onClose} className="cancel">
                    Cancel
                </button>
                <button onClick={savePool} className="success">
                    Create
                </button>
            </div>
        </div>
    );
}
