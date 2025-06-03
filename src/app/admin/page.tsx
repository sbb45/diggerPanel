'use client';
import {ListManagement, Loading, PaginateBtn, PaginateList, TableActions} from "@/app/admin/page.styled";
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

const columns = [
    {key: "Online", label: ""},
    {key: "Serial", label: "Serial"},
    {key: "Group", label: "Note/Group"},
    {key: "Address", label: "Address/Mode"},
    {key: "Version", label: "Version"},
    {key: "Connected", label: "Connected"},
    {key: "actions", label: ""},
];

type FormattedAgent = {
    Item: Agent;
    Online: boolean;
    Serial: string;
    FilterGroup: string;
    Group: React.ReactNode;
    Address: React.ReactNode;
    Version: React.ReactNode;
    Connected: string;
};

const filterOnline = [
    {value: 'all', label: 'All'},
    {value: 'online', label: 'Online'},
    {value: 'offline', label: 'Offline'}
];

export default function Page() {
    const [loading, setLoading] = useState(true);
    const {addToast} = useUI();
    const [data, setData] = useState<FormattedAgent[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterOnlineValue, setFilterOnlineValue] = useState(filterOnline[0])
    const [filterGroup, setFilterGroup] = useState<{ value: string, label: string }[]>([{value: 'all', label: 'All'}])
    const [filterGroupValue, setFilterGroupValue] = useState(filterGroup[0])


    const fetchAgents = async () => {
        setLoading(true)
        try {
            const res = await fetch(api + '/api/v1/agents', {
                credentials: 'include',
            })
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Ошибка сервера: ${res.status} ${errorText}`);
            }
            const agents: Agent[] = await res.json();

            // Заполнение списка уникальными значениями
            const groupsSet = new Set<string>();
            agents.forEach(agent => {
                if (agent.Group) {
                    groupsSet.add(agent.Group)
                }
            })
            setFilterGroup([
                {value: 'all', label: "All"},
                ...Array.from(groupsSet).map(group => ({value: group, label: group}))
            ])

            const format = agents.map((item) => ({
                Item: item,
                Online: item.Online,
                Serial: item.Serial,
                FilterGroup: item.Group,
                Group: (<>
                    {item.Note}
                    <br/>
                    ({item.Group})
                </>),
                Address: item.Address,
                Version: (<>
                    {item.Version}
                    <br/>
                    ({item.Type})
                </>),
                Connected: new Date(item.Connected).toLocaleString(),
            }))
            setData(format)
        } catch (err) {
            addToast({
                type: "danger",
                title: 'Loading error',
                message: err instanceof Error ? err.message : 'Unknown error'
            })
            console.error('Error when loading agents:', err)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchAgents()
    }, []);

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
    }, [filterOnline, filterGroup]);

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
            window.open(api + '/api/v1/agents/export', '_blank')
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
            const res = await fetch(api + '/api/v1/agents/sync');
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
                    data={paginateAgents.map(fa => fa.Item)}
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