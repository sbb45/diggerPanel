'use client';
import AdminMenu from "@/components/Admin/AdminMenu";
import React from "react";
import styled from "styled-components";
import {bgColor} from "@/styles/colors";

const AdminWindow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: start;
    min-height: 100vh;
`
const AdminContent = styled.div`
    flex: 1;
    padding-left: 280px; 
    min-width: 900px;
    max-width: 1900px;
`
const Menu = styled.aside`
    position: fixed;
    background-color: ${bgColor};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 280px;
    padding: 32px;
    min-width: 250px;
    max-width: 400px;
`

export default function ClientAdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminWindow>
            <Menu>
                <AdminMenu />
            </Menu>
            <AdminContent>
                {children}
            </AdminContent>
        </AdminWindow>
    );
}
