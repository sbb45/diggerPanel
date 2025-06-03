'use client';
import {ListManagement, Loading, PaginateBtn, PaginateList, TableActions} from "@/app/admin/page.styled";
import AdminStatistic from "@/components/Admin/AdminStatistic";
import React, {useCallback, useEffect, useState} from "react";
import Dropdown from "@/components/UI/Dropdown";
import Table from "@/components/UI/Table";
import CopyrightAdmin from "@/components/UI/CopyrightAdmin";
import ClientAdminLayout from "@/components/Admin/ClientAdminLayout";
import {useUI} from "@/components/UI/UIProvider";
import FunctionBtn from "@/components/UI/FunctionBtn";
import {User} from "@/lib/types";
import ClearFilter from "@/components/UI/ClearFilter";
import DeleteUser from "@/components/Users/DeleteUser";
import OptionUser from "@/components/Users/OptionUser";
import AddUser from "@/components/Users/AddUser";
import {api} from "@/lib/const";

const columns = [
    { key: 'Source', label: 'Source' },
    { key: 'Note', label: 'Note' },
    { key: 'Login', label: 'Login' },
    { key: 'hiddenPassword', label: 'Password' },
    { key: 'RatioCount', label: 'Ratio' },
    { key: 'AgentsCount', label: 'Agents' },
    { key: 'ReferralsCount', label: 'Referrals' },
    { key: 'PoolsCount', label: 'Pools' },
    { key: 'UpdatedTime', label: 'Updated' },
    { key: 'actions', label: '' },
];

const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'withAgents', label: 'With Agents' },
    { value: 'withoutAgents', label: 'Without Agents' },
];

export default function UsersPage() {
    const { addToast, openModal, closeModal } = useUI();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterValue, setFilterValue] = useState(filterOptions[0]);

    function formatRatio(ratio?: number): string {
        if (ratio === undefined || ratio === null) return "0.00";
        let p = 0;
        if (ratio > 0) {
            p = 100 - (1 / (ratio + 1) * 100);
        } else {
            p = (1 / (-ratio + 1)) * 100;
        }
        return p.toFixed(2);
    }

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api}/api/v1/users`, { credentials: 'include' });
            if (!res.ok) throw new Error(await res.text());
            const data: User[] = await res.json();
            const format = data.map((item: User) => ({
                ...item,
                hiddenPassword: '***',
                RatioCount: (
                    <>
                        {item.Ratio}
                        <br />
                        {formatRatio(item.Ratio)}%
                    </>
                ),
                AgentsCount: item.Agents?.length ?? 0,
                ReferralsCount: item.Referrals?.length ?? 0,
                PoolsCount: item.Pools?.length ?? 0,
                UpdatedTime: new Date(item.Updated).toLocaleString(),
            }))
            setUsers(format);
        } catch (error) {
            addToast({
                type: 'danger',
                title: 'Loading error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Фильтрация
    const filteredUsers = users.filter(user => {
        if (filterValue.value === 'withAgents') return user.Agents && user.Agents.length > 0;
        if (filterValue.value === 'withoutAgents') return !user.Agents || user.Agents.length === 0;
        return true;
    });

    // Пагинация
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleClearFilters = useCallback(() => setFilterValue(filterOptions[0]), []);

    // Кнопки действий для каждой строки
    const actionButtons = (row: User) => (
        <TableActions>
            <OptionUser row={row} fetchUsers={fetchUsers} />
            <DeleteUser row={row} fetchUsers={fetchUsers} />
        </TableActions>
    );

    const statistic = {
        total: { count: users.length, text: 'Total Users' },
        mainLabel: { count: users.filter(u => u.Agents && u.Agents.length > 0).length, text: 'Users with Agents' },
        subLabel: { count: users.filter(u => !u.Agents || u.Agents.length === 0).length, text: 'Users without Agents' },
    };

    return (
        <ClientAdminLayout>
            <AdminStatistic statistic={statistic}/>
            <ListManagement>
        <span>
          <Dropdown label="Filter" options={filterOptions} value={filterValue} onChange={setFilterValue} />
            <ClearFilter onClick={handleClearFilters}/>
        </span>
                <span>
          <FunctionBtn onClick={fetchUsers} title="Refresh" image="refresh.svg" />
          <FunctionBtn
             onClick={() => openModal(<AddUser onClose={closeModal} onSuccess={fetchUsers} />, 'Create User')}
             title="Create User"
             image="plus.svg"
             primary={true}
          />
        </span>
            </ListManagement>
            {loading ? (
                <Loading />
            ) : (
                <Table columns={columns} data={paginatedUsers} buttons={actionButtons} />
            )}
            {totalPages > 1 && (
                <PaginateList>
                    {pages.map(page => (
                        <PaginateBtn key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? 'active' : ''}>
                            {page}
                        </PaginateBtn>
                    ))}
                </PaginateList>
            )}
            <CopyrightAdmin />
        </ClientAdminLayout>
    );
}