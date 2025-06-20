import styled from "styled-components";
import {bgColor, bgHoverColor, primaryColor, primaryHoverColor, whiteColor} from "@/styles/colors";


export const ListManagement = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: end;
    width: 90%;
    margin: 0 auto 40px;
    span{
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 14px;
    }
`
export const Loading = styled.div`
    width: 100%;
    height: 20vh;

    position: relative;
    &::after{
        position: absolute;
        content: '';
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 8px ${bgColor} solid;
        border-top: 8px ${primaryColor} solid;
        top: 10%;
        left: 48%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        to{
            transform: rotate(360deg);
        }
    }
`
export const PaginateList = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 32px 0;
`
export const PaginateBtn = styled.button`
    width: 40px;
    height: 40px;
    background-color: ${bgColor};
    border-radius: 12px;
    font-size: 20px;
    color: ${primaryColor};
    transition: background-color .4s ease;
    &:hover {
        background-color: #dfdfdf;
    }
    &.active {
        background-color: ${primaryColor};
        color: ${whiteColor};
        &:hover {
            background-color: ${primaryHoverColor};
        }
    }
`
export const TableActions = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`
export const TableBtn =styled.button`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    transition: background-color .4s ease;
    &:hover {
        background-color: ${bgHoverColor};
    }
    &:hover:disabled {
        background-color: ${bgColor};
    }
    &:disabled{
        opacity: .4;
    }
`