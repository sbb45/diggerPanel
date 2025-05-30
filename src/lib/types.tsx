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
    [key: string]: string | number | boolean | object | null | React.ReactNode
}
export interface AgentButtonProps {
    row: AgentAll;
    onUpdate?: (updatedAgent: AgentAll) => void;
}