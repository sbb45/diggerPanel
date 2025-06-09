'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {AgentAll} from "@/lib/types";
import {api} from "@/lib/const";
import {useUI} from "@/components/UI/UIProvider";
import Input from "@/components/UI/Input";
import styled from "styled-components";

interface ShowConfigModalProps {
    row: AgentAll;
    onClose: () => void;
}

interface Config {
    [key: string]: string | number | boolean | object;
}

const ConfigItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    gap: 10px;
    width: 400px;

    label {
        font-weight: bold;
        width: 200px;
    }

    input,
    select {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 200px;
    }
    
    select.boolean-select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 16px;
        padding-right: 30px;
    }
`;

const ShowConfigModal = ({row, onClose}: ShowConfigModalProps) => {
    const {addToast, closeModal} = useUI();
    const [config, setConfig] = useState<Config>({});
    const [loading, setLoading] = useState(true);

    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api}api/v1/agents/${row.Id}/remote/config`, {
                credentials: 'include'
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Unknown error');
            }
            const data = await res.json();
            setConfig(data || {});
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Config Error',
                message: err instanceof Error ? err.message : 'Failed to fetch config',
            });
            onClose();
        } finally {
            setLoading(false);
        }
    }, [row.Id, addToast, onClose]);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    const saveConfig = async () => {
        try {
            const res = await fetch(`${api}api/v1/agents/${row.Id}/command/config-set`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(config),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Unknown error');
            }
            addToast({type: 'success', title: 'Config Saved', message: 'Configuration saved successfully'});
            closeModal();
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Save Config Error',
                message: err instanceof Error ? err.message : 'Failed to save config',
            });
        }
    };

    const handleInputChange = (key: string, value: string | number | boolean | object) => {
        setConfig(prevConfig => ({
            ...prevConfig,
            [key]: value,
        }));
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <div className="modal">

            <div className="content" style={{maxWidth: 700, margin: '0 auto'}}>
                {loading ? (
                    <div>Loading config...</div>
                ) : (
                    <form>
                        {Object.entries(config).map(([key, value]) => {
                            let inputElement;
                            const typeOfValue = typeof value;

                            if (typeOfValue === 'boolean') {
                                inputElement = (
                                    <select
                                        className="boolean-select"
                                        value={String(value)}
                                        onChange={(e) => handleInputChange(key, e.target.value === 'true')}
                                    >
                                        <option value="true">true</option>
                                        <option value="false">false</option>
                                    </select>
                                );
                            } else if (typeOfValue === 'object' && value !== null) {
                                inputElement = (
                                    <Input
                                        label=""
                                        value={JSON.stringify(value, null, 2)}
                                        onChange={(newValue) => {
                                            try {
                                                handleInputChange(key, JSON.parse(newValue));
                                            } catch (e) {
                                                console.error(e)
                                                addToast({
                                                    type: 'danger',
                                                    title: 'JSON Error',
                                                    message: 'Invalid JSON format',
                                                });
                                            }
                                        }}
                                        type="text"
                                    />
                                );
                            } else if (typeOfValue === 'number') {
                                inputElement = (
                                    <Input
                                        label=""
                                        value={String(value)}
                                        onChange={(newValue) => handleInputChange(key, Number(newValue))}
                                        type="number"
                                    />
                                );
                            } else {
                                // Default to text input for string and other types
                                inputElement = (
                                    <Input
                                        label=""
                                        value={String(value)}
                                        onChange={(newValue) => handleInputChange(key, newValue)}
                                        type="text"
                                    />
                                );
                            }

                            return (
                                <ConfigItem key={key}>
                                    <label>{key}</label>
                                    {inputElement}
                                </ConfigItem>
                            );
                        })}
                    </form>
                )}
            </div>
            <div className="btns" style={{textAlign: 'right'}}>
                <button className="success" onClick={saveConfig} style={{padding: '8px 16px'}}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default ShowConfigModal; 