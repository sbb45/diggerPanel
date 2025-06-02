'use client'
import React, { useState } from 'react';
import Input from '@/components/UI/Input';
import { useUI } from '@/components/UI/UIProvider';

type AddServerProps = {
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
};

const AddServer = ({ userId, onClose, onSuccess }: AddServerProps) => {
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const { addToast, closeModal } = useUI();

    const [name, setName] = useState('');
    const [addr, setAddr] = useState('');
    const [loading, setLoading] = useState(false);

    async function saveServer() {
        setLoading(true);
        try {
            const body = {
                UserId: userId,
                Name: name,
                Addr: addr,
            };
            const res = await fetch(`${api}/api/v1/servers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(await res.text());

            addToast({ type: 'success', title: 'Created', message: 'Server added successfully' });
            onSuccess();
            closeModal();
            onClose();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Creation failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0' }}>
                <Input label="Name" value={name} onChange={setName} />
                <Input label="Address" value={addr} onChange={setAddr} />
            </div>
            <div className="btns">
                <button onClick={onClose} className="cancel" disabled={loading}>
                    Cancel
                </button>
                <button onClick={saveServer} className="success" disabled={loading || !name || !addr}>
                    {loading ? 'Saving...' : 'Create'}
                </button>
            </div>
        </div>
    );
};

export default AddServer;
