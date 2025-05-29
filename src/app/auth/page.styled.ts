'use client'
import styled from "styled-components";
import {
    bgColor,
    blackColor,
    dangerColor,
    grayColor,
    primaryColor,
    primaryHoverColor,
    whiteColor
} from "@/styles/colors";


export const AuthBg = styled.section`
    width: 100vw;
    height: 100vh;
    background-color: ${bgColor};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export const AuthForm = styled.form`
    background-color: ${whiteColor};
    padding: 60px 64px;
    border-radius: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 3;
    flex-direction: column;
    h2{
        font-size: 32px;
        color: ${blackColor};
        font-weight: 600;
        margin-bottom: 14px;
        line-height: 1;
    }
    p{
        font-size: 16px;
        color: ${grayColor};
        margin-bottom: 24px;
        line-height: 1;
    }
    img{
        pointer-events: none;
    }
`
export const AuthWrapper = styled.div`
    display: inline-block;
    width: fit-content;
    position: relative;
`
export const AuthInput = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 4px;
    margin-bottom: 14px;
    background-color: ${bgColor};
    border-radius: 6px;
    padding: 5px 6px;
    cursor: text;
    transition: box-shadow .4s ease;
    width: 340px;
    input {
        font-size: 20px;
        width: 280px;
    }
    input::placeholder {
        color: ${grayColor};
    }
`
export const AuthBtn =  styled.button`
    color: ${whiteColor};
    font-size: 24px;
    background-color: ${primaryColor};
    width: 100%;
    padding: 14px 0;
    border-radius: 6px;
    margin-top: 28px;
    transition: background-color .4s ease;
    line-height: 1;
    &:hover{
        background-color: ${primaryHoverColor};
    }
`
export const AuthError = styled.div.withConfig({
    shouldForwardProp: (prop)=> prop !== 'showError'
})<{ showError: boolean }>`
    background-color: ${dangerColor};
    color: ${whiteColor};
    width: 100%;
    font-size: 24px;
    padding: 41px 0 21px;
    z-index: 1;
    text-align: center;
    border-radius: 0 0 25px 25px;
    position: absolute;
    transition: bottom .4s ease;
    bottom: ${({showError})=>(showError ? '-70px' : '10px')};
`