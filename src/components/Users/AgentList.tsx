'use client';
import React, { useEffect, useState } from "react";
import {AgentAll, User} from "@/lib/types";
import { useUI } from "@/components/UI/UIProvider";
import Table from "@/components/UI/Table";
import { TableActions, TableBtn } from "@/app/admin/page.styled";
import Image from "next/image";

const columns = [
    { key: "Created", label: "Created" },
    { key: "Note", label: "Note" },
    { key: "Serial", label: "Serial" },
    { key: "HAddr", label: "HAddr" },
    { key: "Version", label: "Version" },
    { key: "actions", label: "" },
];

type Props = {
    row: User;
    onSuccess: () => void;
};

const AgentList = ({ row, onSuccess }: Props) => {
    const api = process.env.NEXT_PUBLIC_API_BASE;
    const userId = row.Id
    const { addToast } = useUI();
    const [agents, setAgents] = useState<AgentAll[]>([]);

    const fetchAgents = async () => {
        try {
            const res = await fetch(`${api}/api/v1/agents`, { credentials: "include" });
            if (!res.ok) throw new Error(await res.text());
            const allAgents: AgentAll[] = await res.json();

            const userAgents = allAgents.filter(agent => agent.Users?.includes(userId) || false);
            setAgents(userAgents);
        } catch (err) {
            addToast({
                type: "danger",
                title: "Loading agents failed",
                message: err instanceof Error ? err.message : "Unknown error",
            });
        }
    };

    const assignAgent = async (agentId: string) => {
        try {
            const res = await fetch(`${api}/api/v1/users/${userId}/agents/${agentId}`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) throw new Error(await res.text());
            addToast({ type: "success", title: "Agent assigned", message: "" });
            fetchAgents();
            onSuccess()
        } catch (err) {
            addToast({
                type: "danger",
                title: "Assign agent failed",
                message: err instanceof Error ? err.message : "Unknown error",
            });
        }
    };

    const releaseAgent = async (agentId: string) => {
        try {
            const res = await fetch(`${api}/api/v1/users/${userId}/agents/${agentId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error(await res.text());
            addToast({ type: "success", title: "Agent released", message: "" });
            fetchAgents();
            onSuccess()
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
    }, [userId]);

    const buttons = (agent: AgentAll) => {
        const assigned = agent.Users?.includes(userId);

        return (
            <TableActions>
                <TableBtn
                    className={assigned ? "red" : "green"}
                    onClick={() => (assigned ? releaseAgent(String(agent.Id)) : assignAgent(String(agent.Id)))}
                    title={assigned ? "Release Agent" : "Assign Agent"}
                >
                    <Image src={`/icons/${assigned ? "close" : "plus"}.svg`} alt={assigned ? "release" : "assign"} width={28} height={28} />
                </TableBtn>
            </TableActions>
        );
    };

    return (
        <div className="modal">
            <div className="content" style={{ margin: "30px 0", width: "100%" }}>
                <Table columns={columns} data={agents} buttons={buttons} />
            </div>
        </div>
    );
};

export default AgentList;
