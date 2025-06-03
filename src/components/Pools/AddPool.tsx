import React, { useState } from "react";
import Input from "@/components/UI/Input";
import { useUI } from "@/components/UI/UIProvider";
import {api} from "@/lib/const";

type Props = {
    onClose: ()=>void;
    onSuccess: () => void;
};

const AddPool = ({ onSuccess, onClose }: Props) => {
    const { closeModal, addToast } = useUI();

    const [note, setNote] = useState('');
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [worker, setWorker] = useState('');
    const [password, setPassword] = useState('');

    async function savePool() {
        try {
            const item = {
                Note: note,
                Address: address,
                Username: username,
                Worker: worker,
                Password: password,
            }
            const res = await fetch(`${api}/api/v1/pools`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(item)
            });

            if (!res.ok) throw new Error(await res.text());

            addToast({ type: 'success', title: 'Saved', message: 'Pool updated' });
            onSuccess();
            closeModal();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Save failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
            console.error(err)
        }
    }

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0' }}>
                <Input label="Note" value={note} onChange={setNote} />
                <Input label="Address" value={address} onChange={setAddress} />
                <Input label="Username" value={username} onChange={setUsername} />
                <Input label="Worker" value={worker} onChange={setWorker} />
                <Input label="Password" value={password} onChange={setPassword} />
            </div>
            <div className="btns">
                <button onClick={onClose} className="cancel">Cancel</button>
                <button onClick={savePool} className="success">Create</button>
            </div>
        </div>
    );
};

export default AddPool;
