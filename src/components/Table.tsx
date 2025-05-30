import React from 'react';
import styled from "styled-components";
import {bgColor, bgHoverColor, grayColor} from "@/styles/colors";
import Image from "next/image";

type Column = {
    key: string;
    label: string;
};
type Agent = {
    [key: string]: string | number | boolean | object | null | React.ReactNode
}
type TableProps = {
    columns: Column[];
    data: Agent[];
};

const TableWrapper = styled.table`
    width: 90%;
    margin:  0 auto;
`
const TableHeader = styled.thead`
    position: relative;
    th{
        padding: 26px 0;
        color: ${grayColor};
        font-size: 18px;
        font-weight: normal;
        text-align: start;
    }
    &::after{
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${bgColor};
    }
`
const TableBody = styled.tbody`
    tr {
        position: relative;
        &:hover td:first-child::before {
            background-color: ${bgColor};
            border-radius: 10px;
        }
    }

    td {
        position: relative;
        z-index: 3;
        padding: 0 12px;
        height: 80px;
        font-size: 16px;
        &:first-child::before {
            content: "";
            position: absolute;
            top: 0;
            left: -2vw;
            width: 77vw;
            height: 100%;
            background-color: transparent;
            z-index: 1;
            transition: background-color 0.3s ease;
        }

        span {
            margin-right: 10px;
            display: inline-block;
            width: 6px;
            height: 40px;
            z-index: 3;
            position: relative;
            border-radius: 10px;
            &.online {
                background-color: #34C759;
            }

            &.offline {
                background-color: ${grayColor};
            }
        }
    }
`;

const TableActions = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`
const TableBtn =styled.button`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: ${bgColor};
    transition: background-color .4s ease;
    &:hover {
        background-color: ${bgHoverColor};
    }
`

const Table = ({columns, data}: TableProps) => {
    function handleEdit(row: object) {
        console.log("Edit:", row);
    }

    function handleUpdate(row: object) {
        console.log("Update:", row);
    }

    function handleDelete(row: object) {
        console.log("Delete:", row);
    }

    return (
        <TableWrapper>
            <TableHeader>
                <tr>
                    {columns.map((col)=>(
                        <th key={col.key}>{col.label}</th>
                    ))}
                </tr>
            </TableHeader>
            <TableBody>
                {data.map((row, i)=>(
                    <tr key={i}>
                        {columns.map((col) => (
                            <td key={col.key}>
                                {col.key === "actions" ? (
                                    <TableActions>
                                        <TableBtn onClick={() => handleUpdate(row)} title={'Обновить'}>
                                            <Image src={'/icons/refresh.svg'} alt={'refresh'} width={28} height={28} />
                                        </TableBtn>
                                        <TableBtn onClick={() => handleDelete(row)} title={'Удалить'}>
                                            <Image src={'/icons/pause.svg'} alt={'trash'} width={28} height={28} />
                                        </TableBtn>
                                        <TableBtn onClick={() => handleEdit(row)} title={'Настройки'}>
                                            <Image src={'/icons/options.svg'} alt={'options'} width={28} height={28} />
                                        </TableBtn>
                                    </TableActions>
                                ) : typeof row[col.key] === "boolean" ? (
                                    row[col.key] ? <span className="online"></span> : <span className="offline"></span>
                                ): (
                                    <>{row[col.key]}</>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </TableBody>
        </TableWrapper>
    );
};

export default Table;