import React, {useEffect} from 'react';
import Image from "next/image";
import styled from "styled-components";
import {blackColor, dangerColor, grayColor, successColor, warningColor, whiteColor} from "@/styles/colors";

const ToastWrapper = styled.div<{$type: 'success' | 'warning' | 'danger'}>`
    z-index: 100;
    width: 380px;
    background-color: ${whiteColor};
    overflow: hidden;
    border-radius: 12px;
    padding: 18px 20px;
    -webkit-box-shadow: 0 0 10px 0 rgba(34, 60, 80, 0.1);
    -moz-box-shadow: 0 0 10px 0 rgba(34, 60, 80, 0.1);
    box-shadow: 0 0 10px 0 rgba(34, 60, 80, 0.1);
    
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 16px;
    animation: .6s open linear forwards ,.6s close linear forwards 2.6s;
    h5{
        color: ${blackColor};
        font-size: 18px;
    }
    p{
        color: ${grayColor};
        font-size: 15px;
    }
    
    &::after{
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        height: 5px;
        background-color: ${({$type}) => 
             $type === 'success' ? successColor :
             $type === 'warning' ? warningColor :
            dangerColor        
        };
        animation: load 2s linear forwards .4s;
    }
    @keyframes load {
        to{ width: 100%}
        from{ width: 0}
    }
    @keyframes open {
        from { transform: translateX(120%); }
        to { transform: translateX(0%); }
    }
    @keyframes close {
        to{transform: translateX(120%)}
        from{transform: translateX(0)}
    }
`

const icons = {
    danger: '/icons/error.svg',
    success: '/icons/success.svg',
    warning: '/icons/warning.svg',
}
interface ToastProps {
    type?: 'danger' | 'warning' | 'success';
    title: string;
    message: string;
    onClose: ()=>void;
    duration?:number
}

const Toast: React.FC<ToastProps> = ({type='danger', title, message, onClose, duration=3000}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <ToastWrapper $type={type} role='alert'>
            <Image src={icons[type]} alt={type} width={40} height={40} />
            <div>
                <h5>{title}</h5>
                <p>{message}</p>
            </div>
        </ToastWrapper>
    );
};

export default Toast;