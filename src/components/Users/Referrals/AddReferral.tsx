'use client'
import React, { useState } from 'react';
import Input from '@/components/UI/Input';
import { useUI } from '@/components/UI/UIProvider';

type Props = {
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
};

const AddReferral = ({ userId, onClose, onSuccess }: Props) => {
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const { addToast, closeModal } = useUI();

    const [address, setAddress] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [percent, setPercent] = useState<number | ''>('');

    const saveReferral = async () => {
        if (!address || !login || percent === '') {
            addToast({
                type: 'warning',
                title: 'Validation error',
                message: 'Address, Login and Percent are required',
            });
            return;
        }

        try {
            const body = {
                UserId: userId,
                Address: address,
                Login: login,
                Password: password,
                Percent: Number(percent),
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
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Save failed',
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
