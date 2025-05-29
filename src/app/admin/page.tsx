'use client';
import {ListManagement, Loading} from "@/app/admin/page.styled";
import AdminStatistic from "@/components/AdminStatistic";
import React, {useEffect, useState} from "react";
import Dropdown from "@/components/Dropdown";
import Table from "@/components/Table";
import CopyrightAdmin from "@/components/CopyrightAdmin";
import ClientAdminLayout from "@/components/ClientAdminLayout";

const columns = [
    {key: "online", label: ""},
    {key: "serial", label: "Serial"},
    {key: "group", label: "Group"},
    {key: "address", label: "Address"},
    {key: "version", label: "Version"},
    {key: "connected", label: "Connected"},
    { key: "actions", label: "" },
];

type Agent = {
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


const statistic = {
    total: {count:40, text:'Total Agents'},
    mainLabel: {count:8, text:'Online Agents'},
    subLabel: {count:12, text:'Online Agents'},
};
const filterOnline = [
    {value: 'all', label: 'All'},
    {value: 'online', label: 'Online'},
    {value: 'offline', label: 'Offline'}
];
const filterGroup = [
    {value: 'new', label: 'New'},
];

export default function Page() {
    const api = process.env.NEXT_PUBLIC_API_BASE
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Record<string, string | number | boolean>[]>([]);

    useEffect(() => {
        async function fetchAgents(){
            try {
                const res = await fetch(api + '/api/v1/agents')
                const agents: Agent[] = await res.json();

                const format = agents.map((item)=>({
                    online: item.Online,
                    serial: item.Serial,
                    group: `${item.Note} (${item.Group})`,
                    address: item.Address,
                    version: `${item.Version} (${item.Type})`,
                    connected: item.Connected,
                }))
                setData(format)
            }catch(err){
                console.error('Ошибка при загрузке агентов:', err)
            }finally {
                setLoading(false)
            }
        }
        fetchAgents()
    }, []);

    return (
        <ClientAdminLayout>
            <AdminStatistic statistic={statistic} />
            <ListManagement>
                <span>
                    <Dropdown options={filterOnline} />
                    <Dropdown options={filterGroup} />
                </span>
            </ListManagement>
            {loading ? (
                <Loading />
            ) : (
                <Table columns={columns} data={data} />
            )}
            <CopyrightAdmin />
        </ClientAdminLayout>
    );
}