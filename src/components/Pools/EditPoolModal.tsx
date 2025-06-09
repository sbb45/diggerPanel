import React, { useState } from "react";
import Input from "@/components/UI/Input";
import { Pools } from "@/lib/types";
import { useUI } from "@/components/UI/UIProvider";
import {api} from "@/lib/const";

type Props = {
    row: Pools;
    onClose: ()=>void;
    onSuccess: () => void;
};

const EditPoolModal = ({ row, onSuccess, onClose }: Props) => {
    const { closeModal, addToast } = useUI();
    const [note, setNote] = useState(row.Note);
    const [address, setAddress] = useState(row.Address);
    const [username, setUsername] = useState(row.Username);
    const [worker, setWorker] = useState(row.Worker);
    const [password, setPassword] = useState(row.Password ?? '');

    async function savePool() {
        try {
            const fullItem = {
                ...row,
                Note: note,
                Address: address,
                Username: username,
                Worker: worker,
                Password: password,
            };

            const res = await fetch(`${api}api/v1/pools/${row.Id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(fullItem),
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
                <button onClick={savePool} className="success">Save</button>
            </div>
        </div>
    );
};

export default EditPoolModal;
