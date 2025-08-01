'use client';
import {ListManagement, Loading, PaginateBtn, PaginateList, TableActions} from "@/app/page.styled";
import AdminStatistic from "@/components/Admin/AdminStatistic";
import React, {useCallback, useEffect, useState} from "react";
import Dropdown from "@/components/UI/Dropdown";
import Table from "@/components/UI/Table";
import CopyrightAdmin from "@/components/UI/CopyrightAdmin";
import ClientAdminLayout from "@/components/Admin/ClientAdminLayout";
import ClearFilter from "@/components/UI/ClearFilter";
import {useUI} from "@/components/UI/UIProvider";
import FunctionBtn from "@/components/UI/FunctionBtn";
import SyncButton from "@/components/Agents/SyncButton";
import {Agent, AgentAll} from "@/lib/types";
import PauseButton from "@/components/Agents/PauseButton";
import OptionsButton from "@/components/Agents/OptionsButton";
import {api} from "@/lib/const";
import {redirect, useRouter} from "next/navigation";

const columns = [
    { key: "Online", label: "" },
    { key: "Serial", label: "Serial" },
    { key: "Note", label: "Note/Group" },
    { key: "Address", label: "Address/Mode" },
    { key: "Version", label: "Version" },
    { key: "Connected", label: "Connected" },
    { key: "actions", label: "" },
];

const filterOnline = [
    {value: 'all', label: 'All'},
    {value: 'online', label: 'Online'},
    {value: 'offline', label: 'Offline'}
];

export default function Home() {
    const [loading, setLoading] = useState(true);
    const {addToast} = useUI();
    const [data, setData] = useState<AgentAll[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    const [filterOnlineValue, setFilterOnlineValue] = useState(filterOnline[0])
    const [filterGroup, setFilterGroup] = useState<{ value: string, label: string }[]>([{value: 'all', label: 'All'}])
    const [filterGroupValue, setFilterGroupValue] = useState(filterGroup[0])


    const fetchAgents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api}api/v1/agents`, {
                credentials: 'include',
            });

            if (res.status === 401) {
                if (typeof window !== 'undefined') {
                    router.push(`${window.location.origin}/admin/auth`);
                }else{
                    redirect('/admin/auth');
                }
                throw new Error('Unauthorized. Redirecting to login...');
            }

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Ошибка сервера: ${res.status} ${errorText}`);
            }

            const agents: Agent[] = await res.json();

            // Заполнение списка уникальными значениями
            const groupsSet = new Set<string>();
            agents.forEach(agent => {
                if (agent.Group) {
                    groupsSet.add(agent.Group);
                }
            });
            setFilterGroup([
                { value: 'all', label: "All" },
                ...Array.from(groupsSet).map(group => ({ value: group, label: group }))
            ]);

            const format = agents.map(item => ({
                Id: item.Id,
                Group: item.Group,
                Online: item.Online,
                Serial: item.Serial,
                FilterGroup: item.Group,
                Note: `${item.Note} (${item.Group})`,
                Address: item.Address,
                Version: `${item.Version} (${item.Type})`,
                Connected: new Date(item.Connected).toLocaleString(),
                Item: item,
            }));
            setData(format);
        } catch (err) {
            addToast({
                type: "danger",
                title: 'Loading error',
                message: err instanceof Error ? err.message : 'Unknown error'
            });
            console.error('Error when loading agents:', err);
        } finally {
            setLoading(false);
        }
    }, [addToast, router]);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    const statistic = {
        total: {count: data.length, text: 'Total Agents'},
        mainLabel: {count: data.filter(agent => agent.Online).length, text: 'Online Agents'},
        subLabel: {count: data.filter(agent => !agent.Online).length, text: 'Offline Agents'},
    };

    // Фильтры
    const filterAgents = data.filter(agent => {
        if (filterOnlineValue.value === 'online' && !agent.Online) return false;
        if (filterOnlineValue.value === 'offline' && agent.Online) return false;
        if (filterGroupValue.value !== 'all' && agent.FilterGroup !== filterGroupValue.value) return false;

        return true
    })

    // Пагинция
    const itemsPage = 10
    const startIndex = (currentPage - 1) * itemsPage
    const paginateAgents = filterAgents.slice(startIndex, startIndex + itemsPage)
    const totalPages = Math.ceil(filterAgents.length / itemsPage);
    const pages = Array.from({length: totalPages}, (_, i) => i + 1)

    useEffect(() => {
        setCurrentPage(1)
    }, [filterOnlineValue, filterGroupValue])

    const handleClearFilters = useCallback(() => {
        setFilterOnlineValue(filterOnline[0]);
        setFilterGroupValue(filterGroup[0]);
    }, [filterGroup]);

    // Управление Агентом
    const buttons = (row: AgentAll) => (
        <TableActions>
            <SyncButton row={row} />
            <PauseButton fetchAgents={fetchAgents} row={row} />
            <OptionsButton row={row} fetchAgents={fetchAgents} />
        </TableActions>
    )


    // Общие активности
    async function backupAction() {
        try {
            window.open(api + 'api/v1/agents/export', '_blank')
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Backup error',
                message: err instanceof Error ? err.message : 'Unknown error'
            })
            console.error("Backup error", err)
        }
    }
    async function sync() {
        try {
            const res = await fetch(`${api}api/v1/agents/sync`);
            if (!res.ok) throw new Error(`Sync failed: ${res.statusText}`);
            addToast({
                type: 'success',
                title: 'Sync successful',
                message: 'Agents synchronized successfully'
            })
        } catch (err) {
            console.error(err);
            addToast({
                type: 'danger',
                title: 'Sync error',
                message: err instanceof Error ? err.message : 'Unknown error'
            })
        }
    }

    return (
        <ClientAdminLayout>
            <AdminStatistic statistic={statistic}/>
            <ListManagement>
                <span>
                    <Dropdown label={'Status'} options={filterOnline} value={filterOnlineValue} onChange={setFilterOnlineValue}/>
                    <Dropdown label={'Group'} options={filterGroup} value={filterGroupValue} onChange={setFilterGroupValue}/>
                     <ClearFilter onClick={handleClearFilters}/>
                </span>
                <span>
                    <FunctionBtn onClick={fetchAgents} title={'Refresh'} image={'refresh.svg'}/>
                    <FunctionBtn onClick={sync} title={'Sync'} image={'sync.svg'}/>
                    <FunctionBtn onClick={backupAction} title={'Backup'} image={'download.svg'}/>
                </span>
            </ListManagement>
            {loading ? (
                <Loading/>
            ) : (
                <Table
                    columns={columns}
                    data={paginateAgents}
                    buttons={buttons}
                />
            )}
            {totalPages !== 1 ? (
                <PaginateList>
                    {pages.map(page => (
                        <PaginateBtn key={page} onClick={() => setCurrentPage(page)}
                                     className={currentPage === page ? 'active' : ''}>
                            {page}
                        </PaginateBtn>
                    ))}
                </PaginateList>
            ) : null}
            <CopyrightAdmin/>
        </ClientAdminLayout>
    );
}