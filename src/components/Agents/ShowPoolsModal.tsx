'use client';

import React, {useEffect, useState} from 'react';
import {Filter} from "@/components/Agents/ShowFilters";
import {useUI} from "@/components/UI/UIProvider";
import {api} from "@/lib/const";
import styled from "styled-components";

interface ShowPoolsModalProps {
    agentId: number;
    filter: Filter;
    onClose: () => void;
    onSuccess: () => void;
}

interface Pool {
    Id: string;
    Note: string;
}

const Select = styled.select`
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
`;

const ShowPoolsModal = ({ agentId, filter, onClose, onSuccess }: ShowPoolsModalProps) => {
    const { addToast, closeModal } = useUI();
    const [pools, setPools] = useState<Pool[]>([]);
    const [selectedPool, setSelectedPool] = useState(filter.PoolNote || 'none');

    useEffect(() => {
        const fetchPools = async () => {
            try {
                const res = await fetch(`${api}api/v1/pools`, {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                setPools(data || []);
            } catch (err) {
                addToast({
                    type: 'danger',
                    title: 'Pools error',
                    message: err instanceof Error ? err.message : 'Failed to fetch pools'
                });
                onClose();
            }
        };
        fetchPools();
    }, [addToast, onClose]);

    const handleSave = async () => {
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/filter/${filter.Id}/assign/${selectedPool}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Unknown error');
            }
            addToast({ type: 'success', title: 'Pool Assigned', message: 'Pool assigned successfully' });
            closeModal();
            onSuccess();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Assign Pool Error',
                message: err instanceof Error ? err.message : 'Failed to assign pool',
            });
        }
    };

    return (
        <div className="modal">
            <div className="content" style={{ maxWidth: 400, margin: '0 auto' }}>
                <label htmlFor="filterPool">Pool</label>
                <Select id="filterPool" value={selectedPool} onChange={(e) => setSelectedPool(e.target.value)}>
                    <option value="none">none</option>
                    {pools.map((pool) => (
                        <option key={pool.Id} value={pool.Id}>
                            {pool.Note}
                        </option>
                    ))}
                </Select>
                <div className="btns" style={{ textAlign: 'right' }}>
                    <button className="success" onClick={handleSave} style={{ padding: '8px 16px' }}>
                        Set
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowPoolsModal; 