'use client'
import React, { useState } from 'react';
import Input from '@/components/UI/Input';
import { useUI } from '@/components/UI/UIProvider';
import {User} from "@/lib/types";
import {api} from "@/lib/const";

type Props = {
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
};

const AddReferral = ({ userId, onClose, onSuccess }: Props) => {
    const { addToast, closeModal } = useUI();

    const [address, setAddress] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [percent, setPercent] = useState<number | ''>('');

    async function saveReferral() {
        try {
            // Получаем текущего пользователя из API
            const userRes = await fetch(`${api}api/v1/users`, {credentials:'include'});
            const users = await userRes.json();
            const user = users.find((u: User) => u.Id === userId);
            if (!user) throw new Error('User not found');

            // Добавляем реферала к пользователю
            const updatedUser = {
                ...user,
                Referrals: [...(user.Referrals || []), {
                    Address: address,
                    Login: login,
                    Password: password,
                    Percent: percent,
                }],
            };

            // Отправляем обновленного пользователя на сервер
            const res = await fetch(`${api}api/v1/users/${userId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

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
            console.error(err)
        }
    }


    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0' }}>
                <Input label="Address" value={address} onChange={setAddress} />
                <Input label="Login" value={login} onChange={setLogin} />
                <Input label="Password" value={password} onChange={setPassword} />
                <Input
                    label="Percent"
                    value={percent === '' ? '' : String(percent)}
                    onChange={val => {
                        const num = Number(val);
                        if (val === '' || (!isNaN(num) && num >= 0 && num <= 100)) setPercent(val === '' ? '' : num);
                    }}
                />
            </div>
            <div className="btns">
                <button onClick={onClose} className="cancel">Cancel</button>
                <button onClick={saveReferral} className="success">Create</button>
            </div>
        </div>
    );
};

export default AddReferral;
