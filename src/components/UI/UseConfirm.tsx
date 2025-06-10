'use client'
import React from 'react';
import Image from "next/image";
import {useUI} from "@/components/UI/UIProvider";

type ConfirmOptions = {
    title?: string;
    btnClass?: string;
    message?: string;
    image?: string;
    confirmText?: string;
    cancelText?: string;
}

const UseConfirm = () => {
    const {openModal, closeModal} = useUI();

    return (options: ConfirmOptions): Promise<boolean>=>{
        return new Promise((resolve)=>{
            const {
                title = 'Confirmation of action',
                message,
                image = 'trashRed.svg',
                confirmText = 'Delete',
                cancelText = 'Cancel',
                btnClass = 'delete',
            } = options

            const handleConfirm = ()=>{
                closeModal();
                resolve(true)
            }
            const handleCancel = ()=>{
                closeModal();
                resolve(false)
            }

            openModal(
                <div className={"modal"}>
                    <div className="content">
                        <Image src={`/admin/icons/modal/${image}`} alt={image} width={80} height={80} />
                        <p>{message}</p>
                    </div>
                    <div className="btns">
                        <button onClick={() => handleCancel()} className="cancel">{cancelText}</button>
                        <button className={btnClass} onClick={() => handleConfirm()}>
                            {confirmText}
                        </button>
                    </div>
                </div>,
                title
            );
        })
    }
};

export default UseConfirm;