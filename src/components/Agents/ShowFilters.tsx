import React, { useEffect, useState } from 'react';
import { AgentAll } from "@/lib/types";
import { useUI } from "@/components/UI/UIProvider";
import Table from "@/components/UI/Table";
import { TableActions } from "@/app/admin/page.styled";
import { TableBtn } from "@/app/admin/page.styled";
import Image from "next/image";
import { api } from "@/lib/const";
import FilterOptionsButton from "./FilterOptionsButton";

interface Timing {
    type: string;
    time: number;
}

export interface Filter {
    Note?: string;
    Dst: string;
    Enabled: string;
    Debug: string;
    Type: string;
    Timings?: number | Timing[];
    PoolNote?: string;
    Id: string;
}

type EditAgentModalProps = {
    row: AgentAll,
    onClose: () => void
}

const columns = [
    { key: 'Dst', label: 'Dst' },
    { key: 'Enabled', label: 'Enabled' },
    { key: 'Debug', label: 'Debug' },
    { key: 'Type', label: 'Type' },
    { key: 'Timings', label: 'Timings' },
    { key: 'Pool', label: 'Pool' },
    { key: 'actions', label: '' },
];

const ShowFilters = ({ row, onClose }: EditAgentModalProps) => {
    const { addToast, openModal } = useUI();
    const [filters, setFilters] = useState<Filter[]>([]);

    const fetchFilters = async () => {
        try {
            const res = await fetch(`${api}api/v1/agents/${row.Id}/remote/filters`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setFilters(data || []);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Filters error',
                message: err instanceof Error ? err.message : 'Failed to fetch filters'
            });
            onClose();
        }
    };

    const toggleFilterEnabled = async (filter: Filter) => {
        try {
            await fetch(`${api}api/v1/agents/${row.Id}/command/filter-state/${filter.Id}/${!filter.Enabled}`, {
                method: 'POST',
                credentials: 'include',
            });
            fetchFilters();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Toggle Enabled error',
                message: err instanceof Error ? err.message : 'Failed to toggle filter state'
            });
        }
    };

    const toggleFilterDebug = async (filter: Filter) => {
        try {
            await fetch(`${api}api/v1/agents/${row.Id}/command/filter-debug/${filter.Id}/${!filter.Debug}`, {
                method: 'POST',
                credentials: 'include',
            });
            fetchFilters();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Toggle Debug error',
                message: err instanceof Error ? err.message : 'Failed to toggle filter debug'
            });
        }
    };

    const deleteFilter = async (filter: Filter) => {
        try {
            await fetch(`${api}api/v1/agents/${row.Id}/command/filter-del/${filter.Id}`, {
                method: 'POST',
                credentials: 'include',
            });
            fetchFilters();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Delete Filter error',
                message: err instanceof Error ? err.message : 'Failed to delete filter'
            });
        }
    };

    const buttons = (filter: Filter) => (
        <TableActions>
            <TableBtn title="Toggle Enabled" onClick={() => toggleFilterEnabled(filter)} >
                <Image
                    src={filter.Enabled ? "/admin/icons/play.svg" : "/icons/pause.svg"}
                    alt="enabled"
                    width={28}
                    height={28}
                    unoptimized
                />
            </TableBtn>
            <TableBtn title="Delete Filter" onClick={() => deleteFilter(filter)} >
                <Image src="/admin/icons/close.svg" alt="delete" width={20} height={20} unoptimized />
            </TableBtn>
            <FilterOptionsButton agentId={row.Id} filter={filter} fetchFilters={fetchFilters} toggleFilterDebug={toggleFilterDebug} />
        </TableActions>
    );

    useEffect(() => {
        fetchFilters();
    }, []);

    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 0', width: '100%' }}>
                <Table
                    columns={columns}
                    data={filters.map(f => ({
                        ...f,
                        Dst: f.Dst ?? f.Id ?? '',
                        Enabled: f.Enabled? 'True' : "False",
                        Debug: f.Debug ? 'True' : "False",
                        Type: f.Type ?? 'unknown',
                        Timings: f.Timings ?? 0,
                        Pool: f.PoolNote && f.PoolNote.length > 0 ? f.PoolNote : 'none',
                    }))}
                    buttons={buttons}
                    style={{margin: '0 40px' }}
                />
            </div>
            <div className="btns">
                <button className="success" onClick={() => openModal(<AddFilterModal agentId={Number(row.Id)} onSuccess={fetchFilters} />, "Add filter")}>+ Add Filter</button>
            </div>
        </div>
    );
};

const AddFilterModal = ({ agentId, onSuccess }: { agentId: number; onSuccess: () => void }) => {
    const { closeModal, addToast } = useUI();
    const [note, setNote] = useState('');
    const [dst, setDst] = useState('');

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/filter-add/${dst.trim()}/unknown/${note.trim()}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Unknown error');
            }
            addToast({ type: 'success', title: 'Filter added', message: 'New filter added' });
            closeModal();
            onSuccess();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Add error',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };

    return (
        <div className="modal">
            <div className="content" style={{ maxWidth: 400, margin: '0 auto' }}>
                <label htmlFor="noteInput">Note</label>
                <input
                    id="noteInput"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional note"
                    style={{ width: '100%', marginBottom: 12, padding: 8 }}
                />
                <label htmlFor="dstInput">Dst <span style={{ color: 'red' }}>*</span></label>
                <input
                    id="dstInput"
                    type="text"
                    value={dst}
                    onChange={(e) => setDst(e.target.value)}
                    placeholder="Destination (required)"
                    style={{ width: '100%', marginBottom: 16, padding: 8 }}
                />
                <div className="btns" style={{ textAlign: 'right' }}>
                    <button
                        className="success"
                        onClick={handleSubmit}
                        style={{ padding: '8px 16px' }}
                    >
                        {'+ Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowFilters;
