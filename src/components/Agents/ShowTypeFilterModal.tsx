'use client';

import React, {useState} from 'react';
import {Filter} from "@/components/Agents/ShowFilters";
import {useUI} from "@/components/UI/UIProvider";
import {api} from "@/lib/const";
import styled from "styled-components";

interface ShowTypeFilterModalProps {
    agentId: number;
    filter: Filter;
    onClose: () => void;
    onSuccess: () => void;
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

const ShowTypeFilterModal = ({ agentId, filter, onSuccess }: ShowTypeFilterModalProps) => {
    const { addToast, closeModal } = useUI();
    const [selectedType, setSelectedType] = useState(filter.Type);

    const handleSave = async () => {
        try {
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/filter-type/${filter.Id}/${selectedType}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Unknown error');
            }
            addToast({ type: 'success', title: 'Filter Type Updated', message: 'Filter type updated successfully' });
            closeModal();
            onSuccess();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Update Error',
                message: err instanceof Error ? err.message : 'Failed to update filter type',
            });
        }
    };

    return (
        <div className="modal">
            <div className="content" style={{ maxWidth: 400, margin: '0 auto' }}>
                <label htmlFor="filterType">Filter Type</label>
                <Select id="filterType" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="unknown">unknown</option>
                    <option value="mockup">mockup</option>
                    <option value="btc">btc</option>
                    <option value="ltc">ltc</option>
                    <option value="fee">btc-fee(aggressive)</option>
                    <option value="fee2">btc-fee</option>
                    <option value="fee3">ltc-fee(aggressive)</option>
                    <option value="fee4">ltc-fee</option>
                    <option value="fee5">btc-fee(fast)</option>
                    <option value="fee6">ltc-fee(fast)</option>
                    <option value="block">block</option>
                </Select>
                <div className="btns" style={{ textAlign: 'right' }}>
                    <button className="success" onClick={handleSave} style={{ padding: '8px 16px' }}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowTypeFilterModal; 