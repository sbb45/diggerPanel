import React from "react";

export type Agent = {
    Id: number;
    Serial: string;
    Group: string;
    Note: string;
    Address: string;
    HAddr: string;
    Version: string;
    Type: string;
    Online: boolean;
    Connected: string;
};
export type AgentAll = {
    [key: string]: string | number | boolean | object | null | React.ReactNode | undefined
}
export interface AgentButtonProps {
    row: AgentAll;
    fetchAgents?: ()=>void;
    onUpdate?: (updatedAgent: AgentAll) => void;
}

export type Pools = {
    Id: number;
    Note: string;
    Address: string;
    Username: string;
    Password: string;
    Worker: string;
    FilterKeys?: Record<string, string[]>;
    Updated: string;
    State: boolean
}