import React, { useEffect, useState } from 'react';
import { AgentAll } from "@/lib/types";
import { useUI } from "@/components/UI/UIProvider";
import Table from "@/components/UI/Table";
import { TableActions } from "@/app/admin/page.styled";
import { TableBtn } from "@/app/admin/page.styled";
import Image from "next/image";
import Input from "@/components/UI/Input";

interface Filter {
    Note: string;
    Dst: string;
    Enabled: boolean;
    Debug: boolean;
    Type: string;
    Timings: string;
    Pool: string;
}

type EditAgentModalProps = {
    row: AgentAll,
    onClose: () => void
}

const columns = [
    { key: 'Note', label: 'Note' },
    { key: 'Dst', label: 'Dst' },
    { key: 'Enabled', label: 'Enabled' },
    { key: 'Debug', label: 'Debug' },
    { key: 'Type', label: 'Type' },
    { key: 'Timings', label: 'Timings' },
    { key: 'Pool', label: 'Pool' },
    { key: 'actions', label: '' },
];

const ShowFilters = ({ row, onClose }: EditAgentModalProps) => {
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const { addToast, openModal } = useUI();
    const [filters, setFilters] = useState<Filter[]>([]);

    const fetchFilters = async () => {
        try {
            const res = await fetch(`${api}/api/v1/agents/${row.Id}/remote/filters`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setFilters(data);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Filters error',
                message: err instanceof Error ? err.message : 'Failed to fetch filters'
            });
            onClose();
        }
    };

    const toggleFilter = async (index: number, field: 'Enabled' | 'Debug') => {
        const updated = [...filters];
        updated[index][field] = !updated[index][field];
        setFilters(updated);
    };

    const deleteFilter = async (index: number) => {
        const updated = [...filters];
        updated.splice(index, 1);
        setFilters(updated);
    };

    const handleAddFilter = () => {
        openModal(<AddFilterModal agentId={Number(row.Id)} onSuccess={fetchFilters} />);
    };

    const buttons = (row: Filter, index: number) => (
        <TableActions>
            <TableBtn title="Toggle Enabled" onClick={() => toggleFilter(index, 'Enabled')}>
                <Image src="/icons/power.svg" alt="enabled" width={20} height={20} />
            </TableBtn>
            <TableBtn title="Toggle Debug" onClick={() => toggleFilter(index, 'Debug')}>
                <Image src="/icons/debug.svg" alt="debug" width={20} height={20} />
            </TableBtn>
            <TableBtn title="Delete Filter" onClick={() => deleteFilter(index)}>
                <Image src="/icons/close.svg" alt="delete" width={20} height={20} />
            </TableBtn>
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
                    data={filters.map((item, index) => ({ ...item, actions: buttons(item, index) }))}
                    buttons={() => null}
                    style={{ minWidth: "1300px", margin: '0 40px' }}
                />
            </div>
            <div className="btns">
                <button className="success" onClick={handleAddFilter}>+ Add Filter</button>
            </div>
        </div>
    );
};

const AddFilterModal = ({ agentId, onSuccess }: { agentId: number; onSuccess: () => void }) => {
    const { closeModal, addToast } = useUI();
    const [form, setForm] = useState<Partial<Record<keyof Filter, string>>>({});

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/agents/${agentId}/remote/filters`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error(await res.text());
            addToast({ type: 'success', title: 'Filter added', message: 'New filter added' });
            closeModal();
            onSuccess();
        } catch (err) {
            addToast({ type: 'danger', title: 'Add error', message: err instanceof Error ? err.message : 'Unknown error' });
        }
    };

    return (
        <div className="modal">
            <div className={'content'}>
                <h3>Add Filter</h3>
                {(['Note', 'Dst', 'Type', 'Pool', 'Timings'] as (keyof Filter)[]).map((field) => (
                    <Input
                        key={field}
                        name={field}
                        label={field}
                        value={form[field] || ''}
                        onChange={(name, value) => setForm(prev => ({ ...prev, [name]: value }))}
                    />
                ))}
                <div className="btns">
                    <button className="success" onClick={handleSubmit}>+ Add</button>
                </div>
            </div>
        </div>
    );
};

export default ShowFilters;
