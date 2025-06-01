import React, {useState} from 'react';
import styled from "styled-components";
import {bgColor, grayColor, successColor} from "@/styles/colors";
import Image from "next/image";
import Modal from "@/components/UI/Modal";
import {useUI} from "@/components/UI/UIProvider";
import {AgentAll} from "@/lib/types";


type Column = {
    key: string;
    label: string;
};
type TableProps = {
    columns: Column[];
    data: AgentAll[];
    buttons: (row: AgentAll) => React.ReactNode;
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
                background-color: ${successColor};
            }

            &.offline {
                background-color: ${grayColor};
            }
        }
    }
`;


const Table = ({columns, data, buttons}: TableProps) => {
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
                                    buttons(row.Item as AgentAll)
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