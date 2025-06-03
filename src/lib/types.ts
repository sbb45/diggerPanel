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
    [key: string]: string | number | boolean | object | null | React.ReactNode | undefined,
    Users?: number[];
    Id: number;
    Item: Agent;
    Online: boolean;
    Serial: string;
    FilterGroup: string;
    Group: React.ReactNode;
    Address: React.ReactNode;
    Version: React.ReactNode;
    Connected: string;
}
export interface AgentButtonProps {
    row: AgentAll;
    fetchAgents?: ()=>void;
    onUpdate?: (updatedAgent: AgentAll) => void;
}

export type Pools = {
    Id: number;
    Note: string;
    Login: string;
    Address: string;
    Type: string;
    Username: string;
    Password: string;
    Worker: string;
    FilterKeys?: Record<string, string[]>;
    Updated: string;
    State: boolean
}

export interface Referral {
    Type: string;
    Percent: number;
    Address: string;
    Login: string;
    Password: string;
}

export interface UserPool {
    Address: string;
    Login: string;
    Password: string;
    Type: string;
}

export interface ServerType {
    Name: string;
    Addr: string;
}
export interface User {
    Id: number;
    Source?: string;
    Note: string;
    Login: string;
    Password: string;
    Ratio: number;
    Agents?: string[];
    Referrals?: Referral[];
    Pools?: UserPool[];
    Updated: string;
    WorkerAsIP?: boolean;
    PersistentDevPercent?: number;
    IgnoreExclusions?: boolean;
    HideDevHash?: boolean;
    Servers?: ServerType[];
}
