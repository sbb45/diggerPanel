'use client'
import React, { useState } from 'react';
import Input from '@/components/UI/Input';
import { useUI } from '@/components/UI/UIProvider';
import { User } from '@/lib/types';
import {api} from "@/lib/const";

type AddServerProps = {
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
};

const AddServer = ({ userId, onClose, onSuccess }: AddServerProps) => {
    const { addToast, closeModal } = useUI();

    const [name, setName] = useState('');
    const [addr, setAddr] = useState('');
    const [loading, setLoading] = useState(false);

    async function saveServer() {
        setLoading(true);
        try {
            // Получаем всех пользователей
            const resUsers = await fetch(`${api}/api/v1/users`, { credentials: 'include' });
            if (!resUsers.ok) throw new Error(await resUsers.text());
            const allUsers: User[] = await resUsers.json();

            const user = allUsers.find(u => u.Id === userId);
            if (!user) throw new Error('User not found');

            // Добавляем новый сервер в массив Servers (создаем, если его нет)
            const updatedServers = user.Servers ? [...user.Servers] : [];
            updatedServers.push({ Name: name, Addr: addr });

            // Обновляем пользователя с новым списком серверов
            const updatedUser = { ...user, Servers: updatedServers };

            // Сохраняем обновлённого пользователя
            const resSave = await fetch(`${api}/api/v1/users/${user.Id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedUser),
            });

            if (!resSave.ok) throw new Error(await resSave.text());

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
