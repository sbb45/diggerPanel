'use client';
import {ListManagement, Loading, PaginateBtn, PaginateList, TableActions, TableBtn} from "@/app/page.styled";
import AdminStatistic from "@/components/Admin/AdminStatistic";
import React, {useCallback, useEffect, useState} from "react";
import Dropdown from "@/components/UI/Dropdown";
import Table from "@/components/UI/Table";
import CopyrightAdmin from "@/components/UI/CopyrightAdmin";
import ClientAdminLayout from "@/components/Admin/ClientAdminLayout";
import ClearFilter from "@/components/UI/ClearFilter";
import {useUI} from "@/components/UI/UIProvider";
import FunctionBtn from "@/components/UI/FunctionBtn";
import {Pools} from "@/lib/types";
import SwitchButton from "@/components/Pools/SwitchButton";
import DeleteButton from "@/components/Pools/DeleteButton";
import Image from "next/image";
import EditPoolModal from "@/components/Pools/EditPoolModal";
import AddPool from "@/components/Pools/AddPool";
import {api} from "@/lib/const";
import {redirect, useRouter} from "next/navigation";

type PoolRow = Pools & {
    Used: 'used' | 'unused';
    UpdatedTime: string;
}

const columns = [
    {key: "Note", label: "Note"},
    {key: "Address", label: "Address"},
    {key: "Username", label: "Username"},
    {key: "Worker", label: "Worker"},
    {key: "Used", label: "Used"},
    {key: "UpdatedTime", label: "Updated"},
    {key: "actions", label: ""},
];

const filterOnline = [
    {value: 'all', label: 'All'},
    {value: 'used', label: 'Used'},
    {value: 'unused', label: 'Unused'}
];

export default function Page() {
    const [loading, setLoading] = useState(true);
    const {addToast,openModal, closeModal} = useUI();
    const [data, setData] = useState<PoolRow[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    const [filterUsedValue, setFilterUsedValue] = useState(filterOnline[0])


    const fetchPools = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api}api/v1/pools`, { credentials: 'include' });
            if (res.status === 401) {
                if (typeof window !== 'undefined') {
                    router.push(`${window.location.origin}/admin/auth`);
                }else{
                    redirect('/admin/auth');
                }
                throw new Error('Unauthorized. Redirecting to login...');
            }
            if (!res.ok) {
                throw new Error(`Server Error: ${await res.text()}`);
            }
            const pools: Pools[] = await res.json();
            const format = pools.map((item): PoolRow => ({
                ...item,
                Used: item.FilterKeys ? "used" : 'unused',
                UpdatedTime: new Date(item.Updated).toLocaleString(),
            }));
            setData(format);
        } catch (err) {
            addToast({
                type: "danger",
                title: 'Loading error',
                message: err instanceof Error ? err.message : 'Unknown error'
            });
            console.error('Error when loading pools:', err);
        } finally {
            setLoading(false);
        }
    }, [addToast,router]);

    useEffect(() => {
        fetchPools();
    }, [fetchPools]);


    const statistic = {
        total: {count: data.length, text: 'Total Pools'},
        mainLabel: {count: data.filter(pool => pool.Used === 'used').length, text: 'Used Pools'},
        subLabel: {count: data.filter(pool => pool.Used === 'unused').length, text: 'Unused Pools'},
    };

    // Фильтры
    const filterPools = data.filter(pool => {
        if (filterUsedValue.value === 'used' && pool.Used=== 'unused') return false;
        if (filterUsedValue.value === 'unused' && pool.Used=== 'used') return false;

        return true
    })

    // Пагинция
    const itemsPage = 10
    const startIndex = (currentPage - 1) * itemsPage
    const paginatePools = filterPools.slice(startIndex, startIndex + itemsPage)
    const totalPages = Math.ceil(filterPools.length / itemsPage);
    const pages = Array.from({length: totalPages}, (_, i) => i + 1)

    useEffect(() => {
        setCurrentPage(1)
    }, [filterUsedValue])

    const handleClearFilters = useCallback(() => {
        setFilterUsedValue(filterOnline[0]);
    }, []);

    // Управление Пулом
    const buttons = (row: Pools) => (
        <TableActions>
            <SwitchButton row={row} fetchPools={fetchPools} />
            <TableBtn disabled={loading} onClick={() => openModal(<EditPoolModal row={row} onClose={closeModal} onSuccess={fetchPools} />, 'Edit Agent')} title={'Delete pool'}>
                <Image src={`/admin/icons/edit.svg`} alt={'edit'} width={28} height={28}/>
            </TableBtn>
            <DeleteButton row={row} fetchPools={fetchPools} />
        </TableActions>
    )

    return (
        <ClientAdminLayout>
            <AdminStatistic statistic={statistic}/>
            <ListManagement>
                <span>
                    <Dropdown label={'Status'} options={filterOnline} value={filterUsedValue} onChange={setFilterUsedValue}/>
                     <ClearFilter onClick={handleClearFilters}/>
                </span>
                <span>
                    <FunctionBtn onClick={fetchPools} title={'Refresh'} image={'refresh.svg'}/>
                    <FunctionBtn onClick={() => openModal(<AddPool onClose={closeModal} onSuccess={fetchPools} />, 'Create Pool')} title={'Create Pool'} image={'plus.svg'} primary={true}/>
                </span>
            </ListManagement>
            {loading ? (
                <Loading/>
            ) : (
                <Table columns={columns} data={paginatePools} buttons={buttons}/>
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