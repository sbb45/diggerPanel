'use client';

import React, {useEffect, useState} from 'react';
import {AgentAll} from "@/lib/types";
import {api} from "@/lib/const";
import {useUI} from "@/components/UI/UIProvider";
import styled from "styled-components";
import { grayColor } from "@/styles/colors";

interface ShowCountersModalProps {
    row: AgentAll;
    onClose: () => void;
}

interface CountersData {
    FilteredConnections: { [key: string]: { [key: string]: number } };
    UnfilteredConnections: { [key: string]: { [key: string]: number } };
}

const CountersWrapper = styled.div`
    width: 100%;
    margin: 30px 0;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;

    h3 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 15px;
        color: #333;
    }

    .category {
        font-size: 1.2em;
        font-weight: bold;
        margin-top: 15px;
        margin-bottom: 10px;
        padding-left: 10px;
        border-bottom: 1px solid #eee;
        padding-bottom: 5px;
    }

    .group {
        font-size: 1.1em;
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 5px;
        padding-left: 20px;
        color: #555;
    }

    .connection-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 30px;
        border-bottom: 1px dotted #eee;

        &:last-child {
            border-bottom: none;
        }

        span {
            color: #666;
        }
    }

    .empty-message {
        text-align: center;
        padding: 20px;
        color: ${grayColor};
    }
`;

const ShowCountersModal = ({row, onClose}: ShowCountersModalProps) => {
    const {addToast} = useUI();
    const [counters, setCounters] = useState<CountersData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCounters = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api}api/v1/agents/${row.Id}/remote/counters`, {
                credentials: 'include'
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Unknown error');
            }
            const data: CountersData = await res.json();
            setCounters(data);
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Counters Error',
                message: err instanceof Error ? err.message : 'Failed to fetch counters',
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCounters();
    }, []);

    return (
        <div className="modal">
            <CountersWrapper>
                {loading ? (
                    <div>Loading counters...</div>
                ) : counters ? (
                    <>
                        <h3>Filtered Connections</h3>
                        {Object.keys(counters.FilteredConnections).length > 0 ? (
                            Object.entries(counters.FilteredConnections).map(([groupKey, connections]) => (
                                <div key={groupKey}>
                                    <div className="group">{groupKey}</div>
                                    {Object.entries(connections).map(([connectionKey, count]) => (
                                        <div key={connectionKey} className="connection-item">
                                            <span>{connectionKey}</span>
                                            <span>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="empty-message">No filtered connections.</div>
                        )}

                        <h3>Unfiltered Connections</h3>
                        {Object.keys(counters.UnfilteredConnections).length > 0 ? (
                            Object.entries(counters.UnfilteredConnections).map(([groupKey, connections]) => (
                                <div key={groupKey}>
                                    <div className="group">{groupKey}</div>
                                    {Object.entries(connections).map(([connectionKey, count]) => (
                                        <div key={connectionKey} className="connection-item">
                                            <span>{connectionKey}</span>
                                            <span>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="empty-message">No unfiltered connections.</div>
                        )}
                    </>
                ) : (
                    <div className="empty-message">No counter data available.</div>
                )}
            </CountersWrapper>
        </div>
    );
};

export default ShowCountersModal; 