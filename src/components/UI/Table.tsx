import React from 'react';
import styled from "styled-components";
import {bgColor, grayColor, successColor} from "@/styles/colors";


type Column = {
    key: string;
    label: string;
};

type TableProps<T> = {
    columns: Column[];
    data: T[];
    buttons: (row: T) => React.ReactNode;
    style?: React.CSSProperties;
};


const TableWrapper = styled.table`
    width: 90%;
    margin:  0 auto;
    overflow: hidden;
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
            width: 100vw;
            height: 100%;
            background-color: transparent;
            z-index: -10;
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


function Table<T>({ columns, data, buttons, style }: TableProps<T>) {
    return (
        <TableWrapper style={style}>
            <TableHeader>
                <tr>
                    {columns.map((col) => (
                        <th key={String(col.key)}>{col.label}</th>
                    ))}
                </tr>
            </TableHeader>
            <TableBody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {columns.map((col) => (
                            <td key={String(col.key)}>
                                {col.key === "actions" ? (
                                    buttons(row)
                                ) : typeof row[col.key as keyof T] === "boolean" && col.key === "Online" ? (
                                    row[col.key as keyof T] ? (
                                        <span className="online" />
                                    ) : (
                                        <span className="offline" />
                                    )
                                ) : (
                                    <>{row[col.key as keyof T] as React.ReactNode}</>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </TableBody>
        </TableWrapper>
    );
}

export default Table;