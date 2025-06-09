'use client';

import React, {useEffect, useState} from 'react';
import {Filter} from "@/components/Agents/ShowFilters";
import {useUI} from "@/components/UI/UIProvider";
import {api} from "@/lib/const";
import Table from "@/components/UI/Table";
import {TableActions, TableBtn} from "@/app/admin/page.styled";
import Image from "next/image";

interface Timing {
    Username: string;
    Worker: string;
    Firmware: string;
    PeriodLegalSec: number;
    PeriodIllegalSec: number;
    Type: string;
    Disabled: boolean;
    Extra: string;
}

interface ShowTimingsModalProps {
    agentId: number;
    filter: Filter;
    onClose: () => void;
}

const columns = [
    {key: 'Disabled', label: 'Enabled'},
    {key: 'Type', label: 'Type'},
    {key: 'Username', label: 'Username'},
    {key: 'Worker', label: 'Worker'},
    {key: 'Firmware', label: 'Firmware'},
    {key: 'PeriodLegalSec', label: 'Legal Period'},
    {key: 'PeriodIllegalSec', label: 'Illegal Period'},
    {key: 'Percent', label: 'Percent'},
    {key: 'actions', label: ''},
];

const ShowTimingsModal = ({agentId, filter, onClose}: ShowTimingsModalProps) => {
    const {addToast, openModal, closeModal} = useUI();
    const [timings, setTimings] = useState<Timing[]>([]);

    const fetchTimings = async () => {
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/remote/filters`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            const currentFilter = data.find((f: Filter) => f.Id === filter.Id);
            setTimings(currentFilter?.Timings || []);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Timings error',
                message: err instanceof Error ? err.message : 'Failed to fetch timings'
            });
            onClose();
        }
    };

    const toggleTimingState = async (timing: Timing) => {
        try {
            const encodedFirmware = encodeURIComponent(timing.Firmware.replaceAll("/", "!!!"));
            await fetch(`${api}api/v1/agents/${agentId}/command/timing-state/${filter.Id}/${timing.Username}/${timing.Worker}/${encodedFirmware}/${!timing.Disabled}`, {
                method: 'POST',
                credentials: 'include',
            });
            fetchTimings();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Toggle Timing State error',
                message: err instanceof Error ? err.message : 'Failed to toggle timing state'
            });
        }
    };

    const deleteTiming = async (timing: Timing) => {
        try {
            const encodedFirmware = encodeURIComponent(timing.Firmware.replaceAll("/", "!!!"));
            await fetch(`${api}api/v1/agents/${agentId}/command/filter-timing-del/${filter.Id}/${timing.Username}/${timing.Worker}/${encodedFirmware}`, {
                method: 'POST',
                credentials: 'include',
            });
            fetchTimings();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Delete Timing error',
                message: err instanceof Error ? err.message : 'Failed to delete timing'
            });
        }
    };

    const handleAddEditTiming = (timing?: Timing) => {
        openModal(
            <AddEditTimingModal
                agentId={agentId}
                filterId={filter.Id}
                timing={timing}
                onClose={closeModal}
                onSuccess={fetchTimings}
            />,
            timing ? 'Edit Timing' : 'Add Timing'
        );
    };

    const buttons = (timing: Timing) => (
        <TableActions>
            <TableBtn title="Toggle State" onClick={() => toggleTimingState(timing)}>
                <Image
                    src={timing.Disabled ? "/icons/play-button.svg" : "/icons/stop.svg"}
                    alt="toggle state"
                    width={20}
                    height={20}
                    unoptimized
                />
            </TableBtn>
            <TableBtn title="Edit Timing" onClick={() => handleAddEditTiming(timing)}>
                <Image src="/icons/edit.svg" alt="edit" width={20} height={20} unoptimized/>
            </TableBtn>
            <TableBtn title="Delete Timing" onClick={() => deleteTiming(timing)}>
                <Image src="/icons/close.svg" alt="delete" width={20} height={20} unoptimized/>
            </TableBtn>
        </TableActions>
    );

    useEffect(() => {
        fetchTimings();
    }, [filter.Id]);

    return (
        <div className="modal">
            <div className="content" style={{margin: '30px 0', width: '100%'}}>
                <Table
                    columns={columns}
                    data={timings.map(t => ({
                        ...t,
                        Disabled: t.Disabled ? 'false' : 'true',
                        Percent: t.PeriodLegalSec !== 0 ? ((t.PeriodIllegalSec / (t.PeriodIllegalSec + t.PeriodLegalSec)) * 100).toFixed(2) : 0.0.toFixed(2),
                        actions: buttons(t),
                    }))}
                    buttons={() => null}
                    style={{minWidth: "1200px", margin: '0 40px'}}
                />
            </div>
            <div className="btns">
                <button className="success" onClick={() => handleAddEditTiming()}>+ Add Timing</button>
            </div>
        </div>
    );
};

export default ShowTimingsModal;

interface AddEditTimingModalProps {
    agentId: number;
    filterId: string;
    timing?: Timing;
    onClose: () => void;
    onSuccess: () => void;
}

const AddEditTimingModal = ({agentId, filterId, timing, onSuccess}: AddEditTimingModalProps) => {
    const {addToast, closeModal} = useUI();
    const [type, setType] = useState(timing?.Type || "admin");
    const [username, setUsername] = useState(timing?.Username || "*");
    const [worker, setWorker] = useState(timing?.Worker || "*");
    const [firmware, setFirmware] = useState(timing?.Firmware || "*");
    const [periodLegalSec, setPeriodLegalSec] = useState(timing?.PeriodLegalSec.toString() || "0");
    const [periodIllegalSec, setPeriodIllegalSec] = useState(timing?.PeriodIllegalSec.toString() || "0");
    const [extra, setExtra] = useState(timing?.Extra || "");

    const handleSubmit = async () => {
        try {
            const encodedFirmware = encodeURIComponent(firmware.replaceAll("/", "!!!"));
            await fetch(`${api}api/v1/agents/${agentId}/command/filter-timing-add/${filterId}/${username}/${worker}/${encodedFirmware}/${type}/${Number(periodLegalSec)}/${Number(periodIllegalSec)}/${extra}`, {
                method: 'POST',
                credentials: 'include',
            });
            addToast({type: 'success', title: timing ? 'Timing Updated' : 'Timing Added', message: timing ? 'Timing updated successfully' : 'New timing added'});
            closeModal();
            onSuccess();
        } catch (err) {
            addToast({
                type: 'danger',
                title: timing ? 'Update Error' : 'Add Error',
                message: err instanceof Error ? err.message : 'Failed to save timing',
            });
        }
    };

    return (
        <div className="modal">
            <div className="content" style={{maxWidth: 400, margin: '0 auto'}}>
                <label htmlFor="timingType">Type</label>
                <select id="timingType" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="admin">admin</option>
                    <option value="user">user</option>
                    <option value="fee">fee</option>
                    <option value="auto">auto</option>
                    <option value="replace">replace</option>
                    <option value="block">block</option>
                    <option value="reject">reject</option>
                    <option value="redirect">redirect</option>
                    <option value="assign">assign</option>
                </select>

                <label htmlFor="username">Filter by username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" disabled={!!timing}/>

                <label htmlFor="worker">Filter by worker</label>
                <input type="text" id="worker" value={worker} onChange={(e) => setWorker(e.target.value)} placeholder="worker" disabled={!!timing}/>

                <label htmlFor="firmware">Filter by firmware</label>
                <input type="text" id="firmware" value={firmware} onChange={(e) => setFirmware(e.target.value)} placeholder="firmware" disabled={!!timing}/>

                <label htmlFor="periodLegalSec">Legal period seconds</label>
                <input type="text" id="periodLegalSec" value={periodLegalSec} onChange={(e) => setPeriodLegalSec(e.target.value)} placeholder="legal"/>

                <label htmlFor="periodIllegalSec">Illegal period seconds</label>
                <input type="text" id="periodIllegalSec" value={periodIllegalSec} onChange={(e) => setPeriodIllegalSec(e.target.value)} placeholder="illegal"/>

                <label htmlFor="extra">Extra</label>
                <input type="text" id="extra" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="extra"/>

                <div className="btns" style={{textAlign: 'right'}}>
                    <button className="success" onClick={handleSubmit} style={{padding: '8px 16px'}}>
                        {timing ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}; 