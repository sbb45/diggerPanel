'use client';

import React, {useCallback, useEffect, useState} from "react";
import { AgentAll, User } from "@/lib/types";
import { useUI } from "@/components/UI/UIProvider";
import Table from "@/components/UI/Table";
import { Loading, TableActions, TableBtn } from "@/app/admin/page.styled";
import Image from "next/image";
import {api} from "@/lib/const";

type Props = {
    row: User;
    onSuccess: () => void;
};

type FormattedAgent = {
    Item: AgentAll;
    Online: boolean;
    Serial: string;
    FilterGroup: string;
    Group: React.ReactNode;
    Address: string;
    Version: React.ReactNode;
    Connected: string;
};

const columns = [
    { key: "Connected", label: "Connected" },
    { key: "Group", label: "Group" },
    { key: "Serial", label: "Serial" },
    { key: "Address", label: "Address" },
    { key: "Version", label: "Version" },
    { key: "actions", label: "" },
];

const AgentList = ({ row, onSuccess }: Props) => {
    const userId = row.Id;
    const { addToast } = useUI();

    const [data, setData] = useState<FormattedAgent[]>([]);
    const [loading, setLoading] = useState(false);
    const [assignedAgents, setAssignedAgents] = useState<string[]>(row.Agents ?? []);

    useEffect(() => {
        setAssignedAgents(row.Agents ?? []);
    }, [row.Agents]);

    const fetchAgents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api}api/v1/agents`, {
                credentials: 'include',
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Ошибка сервера: ${res.status} ${errorText}`);
            }
            const agents: AgentAll[] = await res.json();
            const format = agents.map((item) => ({
                Item: item,
                Online: Boolean(item.Online),
                Serial: String(item.Serial),
                FilterGroup: String(item.Group ?? ""),
                Group: (
                    <>
                        {item.Note}
                        <br />
                        ({item.Group ?? ""})
                    </>
                ),
                Address: String(item.Address ?? ""),
                Version: (
                    <>
                        {item.Version ?? ""}
                        <br />
                        ({item.Type ?? ""})
                    </>
                ),
                Connected: item.Connected ? new Date(String(item.Connected)).toLocaleString() : "",
            }));
            setData(format);
        } catch (err) {
            addToast({
                type: "danger",
                title: 'Loading error',
                message: err instanceof Error ? err.message : 'Unknown error',
            });
            console.error('Error when loading agents:', err);
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const assignAgent = async (agentId: string, agentSerial: string) => {
        try {
            const res = await fetch(`${api}api/v1/users/${userId}/agents/${agentId}`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) throw new Error(await res.text());
            await res.json();

            addToast({ type: "success", title: "Agent assigned", message: "The agent has been successfully assigned" });
            setAssignedAgents(prev => [...prev, agentSerial]);
            onSuccess();
            fetchAgents();
        } catch (err) {
            addToast({
                type: "danger",
                title: "Assign agent failed",
                message: err instanceof Error ? err.message : "Unknown error",
            });
        }
    };

    const releaseAgent = async (agentId: string, agentSerial: string) => {
        try {
            const res = await fetch(`${api}api/v1/users/${userId}/agents/${agentId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error(await res.text());
            await res.json();

            addToast({ type: "success", title: "Agent released", message: 'The agent was successfully released' });
            setAssignedAgents(prev => prev.filter(serial => serial !== agentSerial));
            onSuccess();
            fetchAgents();
        } catch (err) {
            addToast({
                type: "danger",
                title: "Release agent failed",
                message: err instanceof Error ? err.message : "Unknown error",
            });
        }
    };

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    const buttons = (agent: FormattedAgent) => {
        const assigned = assignedAgents.includes(agent.Serial);

        return (
            <TableActions>
                <TableBtn
                    className={assigned ? "red" : "green"}
                    onClick={() =>
                        assigned
                            ? releaseAgent(String(agent.Item.Id), agent.Serial)
                            : assignAgent(String(agent.Item.Id), agent.Serial)
                    }
                    title={assigned ? "Release Agent" : "Assign Agent"}
                >
                    <Image
                        src={`/admin/icons/${assigned ? "close" : "plusBlack"}.svg`}
                        alt={assigned ? "release" : "assign"}
                        width={28}
                        height={28}
                    />
                </TableBtn>
            </TableActions>
        );
    };

    return (
        <div className="modal">
            <div className="content" style={{ margin: "30px 0", width: "1200px" }}>
                {loading ? (
                    <Loading />
                ) : (
                    <Table columns={columns} data={data} buttons={buttons} />
                )}
            </div>
        </div>
    );
};

export default AgentList;
