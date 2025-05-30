'use client';
import {ListManagement, Loading, PaginateBtn, PaginateList} from "@/app/admin/page.styled";
import AdminStatistic from "@/components/AdminStatistic";
import React, {useCallback, useEffect, useState} from "react";
import Dropdown from "@/components/Dropdown";
import Table from "@/components/Table";
import CopyrightAdmin from "@/components/CopyrightAdmin";
import ClientAdminLayout from "@/components/ClientAdminLayout";
import AgentsLocal from "@/app/admin/agents.json"
import ClearFilter from "@/components/ClearFilter";
import {useToast} from "@/components/Toast/ToastProvider";

const columns = [
    {key: "Online", label: ""},
    {key: "Serial", label: "Serial"},
    {key: "Group", label: "Note/Group"},
    {key: "Address", label: "Address/Mode"},
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

const filterOnline = [
    {value: 'all', label: 'All'},
    {value: 'online', label: 'Online'},
    {value: 'offline', label: 'Offline'}
];

export default function Page() {
    const api = process.env.NEXT_PUBLIC_API_BASE
    const [loading, setLoading] = useState(true);
    const {addToast} = useToast();
    const [data, setData] = useState<Record<string, React.ReactNode>[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterOnlineValue, setFilterOnlineValue] = useState(filterOnline[0])
    const [filterGroup, setFilterGroup] = useState<{value:string, label:string}[]>([{value:'all', label:'All'}])
    const [filterGroupValue, setFilterGroupValue] = useState(filterGroup[0])

    useEffect(() => {
        async function fetchAgents(){
            try {
                const res = await fetch(api + '/api/v1/agents', {
                    credentials: 'include',
                })
                if(!res.ok){
                    const errorText = await res.text();
                    throw new Error(`Ошибка сервера: ${res.status} ${errorText}`);
                }
                const agents: Agent[] = await res.json();

                // Заполнение списка уникальными значениями
                const groupsSet = new Set<string>();
                agents.forEach(agent=>{
                    if(agent.Group){
                        groupsSet.add(agent.Group)
                    }
                })
                setFilterGroup([
                    {value:'all', label:"All"},
                    ...Array.from(groupsSet).map(group => ({value:group, label:group}))
                ])

                const format = agents.map((item)=>({
                    Online: item.Online,
                    Serial: item.Serial,
                    FilterGroup: item.Group,
                    Group: (<>
                        {item.Note}
                        <br />
                        ({item.Group})
                    </>),
                    Address: item.Address,
                    Version: (<>
                        {item.Version}
                        <br />
                        ({item.Type})
                    </>),
                    Connected: item.Connected,
                }))
                console.log(format)
                setData(format)
            }catch(err){
                addToast({
                    type:"danger",
                    title: 'Loading error',
                    message: err instanceof Error ? err.message : 'Неизвестная ошибка'
                })
                console.error('Ошибка при загрузке агентов:', err)
            }finally {
                setLoading(false)
            }
        }
        fetchAgents()
    }, []);

    useEffect(() => {
        if (!process.env.PRODUCTION) {
            setData(AgentsLocal);
        }
    }, []);

    const statistic = {
        total: {count:data.length, text:'Total Agents'},
        mainLabel: {count: data.filter(agent => agent.Online).length, text:'Online Agents'},
        subLabel: {count: data.filter(agent => !agent.Online).length, text:'Offline Agents'},
    };

    // Фильтры
    const filterAgents = data.filter(agent =>{
        if(filterOnlineValue.value === 'online' && !agent.Online) return false;
        if(filterOnlineValue.value === 'offline' && agent.Online) return false;

        if(filterGroupValue.value !== 'all' && agent.FilterGroup !== filterGroupValue.value) return false;

        return true
    })

    // Пагинция
    const itemsPage = 10
    const startIndex = (currentPage - 1) * itemsPage
    const paginateAgents = filterAgents.slice(startIndex, startIndex + itemsPage)
    const totalPages = Math.ceil(filterAgents.length / itemsPage);
    const pages = Array.from({length: totalPages}, (_,i)=> i+1)

    useEffect(()=>{
        setCurrentPage(1)
    }, [filterOnlineValue, filterGroupValue])

    const handleClearFilters = useCallback(() => {
        setFilterOnlineValue(filterOnline[0]);
        setFilterGroupValue(filterGroup[0]);
    }, [filterOnline, filterGroup]);

    return (
        <ClientAdminLayout>
            <AdminStatistic statistic={statistic} />
            <ListManagement>
                <span>
                    <Dropdown label={'Status'} options={filterOnline} value={filterOnlineValue} onChange={setFilterOnlineValue} />
                    <Dropdown label={'Group'} options={filterGroup} value={filterGroupValue} onChange={setFilterGroupValue} />
                </span>
                <span>
                    <ClearFilter onClick={handleClearFilters} />
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