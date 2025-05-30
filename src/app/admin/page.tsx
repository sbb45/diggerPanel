'use client';
import {ListManagement, Loading, PaginateBtn, PaginateList} from "@/app/admin/page.styled";
import AdminStatistic from "@/components/AdminStatistic";
import React, {useEffect, useState} from "react";
import Dropdown from "@/components/Dropdown";
import Table from "@/components/Table";
import CopyrightAdmin from "@/components/CopyrightAdmin";
import ClientAdminLayout from "@/components/ClientAdminLayout";
import agents from "@/app/admin/agents.json";

const columns = [
    {key: "Online", label: ""},
    {key: "Serial", label: "Serial"},
    {key: "Group", label: "Group"},
    {key: "Address", label: "Address"},
    {key: "Version", label: "Version"},
    {key: "Connected", label: "Connected"},
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
    total: {count:agents.length, text:'Total Agents'},
    mainLabel: {count: agents.filter(agent => agent.Online).length, text:'Online Agents'},
    subLabel: {count: agents.filter(agent => !agent.Online).length, text:'Offline Agents'},
};
const filterOnline = [
    {value: 'all', label: 'All'},
    {value: 'online', label: 'Online'},
    {value: 'offline', label: 'Offline'}
];

export default function Page() {
    const api = process.env.NEXT_PUBLIC_API_BASE
    const [loading, setLoading] = useState(false);
    const [filterOnlineValue, setFilterOnlineValue] = useState(filterOnline[0])
    //const [data, setData] = useState<Record<string, string | number | boolean>[]>([]);

    // Заполнение списка
    const groupsSet = new Set<string>();
    agents.forEach(agent=>{
        if(agent.Group){
            groupsSet.add(agent.Group)
        }
    })

    const filterGroup = [
        {value: 'all', label: 'All'},
        ...Array.from(groupsSet).map(group => ({
            value: group,
            label: group
        }))
    ];
    const [filterGroupValue, setFilterGroupValue] = useState(filterGroup[0])

    // Фильтры
    const filterAgents = agents.filter(agent =>{
        if(filterOnlineValue.value === 'online' && !agent.Online) return false;
        if(filterOnlineValue.value === 'offline' && agent.Online) return false;

        if(filterGroupValue.value !== 'all' && agent.Group !== filterGroupValue.value) return false;

        return true
    })

    // Пагинция
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPage = 10
    const startIndex = (currentPage - 1) * itemsPage
    const paginateAgents = filterAgents.slice(startIndex, startIndex + itemsPage)
    const totalPages = Math.ceil(filterAgents.length / itemsPage);
    const pages = Array.from({length: totalPages}, (_,i)=> i+1)

    //useEffect(() => {
    //    async function fetchAgents(){
    //        try {
    //            const res = await fetch(api + '/api/v1/agents')
    //            const agents: Agent[] = await res.json();
//
    //            const format = agents.map((item)=>({
    //                online: item.Online,
    //                serial: item.Serial,
    //                group: `${item.Note} (${item.Group})`,
    //                address: item.Address,
    //                version: `${item.Version} (${item.Type})`,
    //                connected: item.Connected,
    //            }))
    //            setData(format)
    //        }catch(err){
    //            console.error('Ошибка при загрузке агентов:', err)
    //        }finally {
    //            setLoading(false)
    //        }
    //    }
    //    fetchAgents()
    //}, []);


    return (
        <ClientAdminLayout>
            <AdminStatistic statistic={statistic} />
            <ListManagement>
                <span>
                    <Dropdown label={'Status'} options={filterOnline} value={filterOnlineValue} onChange={setFilterOnlineValue} />
                    <Dropdown label={'Group'} options={filterGroup} value={filterGroupValue} onChange={setFilterGroupValue} />
                </span>
            </ListManagement>
            {loading ? (
                <Loading />
            ) : (
                <Table columns={columns} data={paginateAgents} />
            )}
            {totalPages !== 1 ? (
                <PaginateList>
                    {pages.map(page=>(
                        <PaginateBtn key={page} onClick={()=>setCurrentPage(page)} className={currentPage === page ? 'active' : ''}>
                            {page}
                        </PaginateBtn>
                    ))}
                </PaginateList>
            ): null}
            <CopyrightAdmin />
        </ClientAdminLayout>
    );
}