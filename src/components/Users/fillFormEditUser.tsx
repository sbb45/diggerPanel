import React, { useState } from "react";
import Input from "@/components/UI/Input";
import { useUI } from "@/components/UI/UIProvider";
import { User } from "@/lib/types";
import Dropdown from "@/components/UI/Dropdown";
import {api} from "@/lib/const";

type Props = {
    row: User;
    onClose: () => void;
    onSuccess: () => void;
};

const booleanOptions = [
    { value: 'true', label: 'Enabled' },
    { value: 'false', label: 'Disabled' },
];

const FillFormEditUser = ({ row, onSuccess, onClose }: Props) => {
    const { closeModal, addToast } = useUI();

    const [note, setNote] = useState(row.Note);
    const [login, setLogin] = useState(row.Login);
    const [password, setPassword] = useState(row.Password);
    const [ratio, setRatio] = useState(row.Ratio ?? 0);
    const [persistentDevPercent, setPersistentDevPercent] = useState(row.PersistentDevPercent ?? 0);

    const [workerAsIP, setWorkerAsIP] = useState(
        booleanOptions.find(opt => opt.value === String(row.WorkerAsIP)) || booleanOptions[1]
    );
    const [ignoreExclusions, setIgnoreExclusions] = useState(
        booleanOptions.find(opt => opt.value === String(row.IgnoreExclusions)) || booleanOptions[1]
    );
    const [hideDevHash, setHideDevHash] = useState(
        booleanOptions.find(opt => opt.value === String(row.HideDevHash)) || booleanOptions[1]
    );

    async function saveUser() {
        try {
            const fullItem = {
                ...row,
                Note: note,
                Login: login,
                Password: password,
                Ratio: ratio,
                PersistentDevPercent: persistentDevPercent,
                WorkerAsIP: workerAsIP.value === 'true',
                IgnoreExclusions: ignoreExclusions.value === 'true',
                HideDevHash: hideDevHash.value === 'true',
            };

            const res = await fetch(`${api}api/v1/users/${row.Id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(fullItem),
            });

            if (!res.ok) throw new Error(await res.text());

            addToast({ type: 'success', title: 'Saved', message: 'User updated' });
            onSuccess();
            closeModal();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Save failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
            console.error(err);
        }
    }

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 40px', display:"flex", flexDirection:'row',alignItems:"start", gap:"60px", width:"100%" }}>
                <span style={{width:"250px"}}>
                    <Input label="Note" value={note} onChange={setNote} />
                    <Input label="Login" value={login} onChange={setLogin} />
                    <Input label="Password" value={password} onChange={setPassword} type="password" />
                    <Input label="Ratio" value={String(ratio)} onChange={val => setRatio(Number(val))} />
                </span>
                <span style={{width:"250px"}}>
                    <Input
                        label="Persistent Dev Percent"
                        value={String(persistentDevPercent)}
                        onChange={val => setPersistentDevPercent(Number(val))}
                    />
                    <Dropdown
                        options={booleanOptions}
                        value={workerAsIP}
                        onChange={setWorkerAsIP}
                        label="Worker As IP"
                        style={{ width: "100%", marginBottom:"18px" }}
                    />
                    <Dropdown
                        options={booleanOptions}
                        value={ignoreExclusions}
                        onChange={setIgnoreExclusions}
                        label="Ignore Exclusions"
                        style={{ width: "100%", marginBottom:"18px" }}
                    />
                    <Dropdown
                        options={booleanOptions}
                        value={hideDevHash}
                        onChange={setHideDevHash}
                        label="Hide Dev Hash"
                        style={{ width: "100%", marginBottom:"18px" }}
                    />
                </span>
            </div>
            <div className="btns">
                <button onClick={onClose} className="cancel">Cancel</button>
                <button onClick={saveUser} className="success">Save</button>
            </div>
        </div>
    );
};

export default FillFormEditUser;
