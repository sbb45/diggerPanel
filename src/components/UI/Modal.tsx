'use client'
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Image from "next/image";
import {
    bgColor,
    bgHoverColor,
    dangerColor, dangerHoverColor,
    whiteColor
} from "@/styles/colors";

const Overlay = styled(Dialog.Overlay)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    z-index: 900;
`
const ContentWrapper = styled(motion.div)`
    position: fixed;
    top: 50%;
    bottom: 50%;
    right: 50%;
    left: 50%;  
    min-width: 510px;
    max-width: 800px;
    width: max-content;
    height: max-content;
    min-height: 310px;
    max-height: 60vh;
    transform: translate(-50%, -50%) !important;
    z-index: 999;
    background-color: ${whiteColor};
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    div.btns{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90%;
        gap: 16px;
        margin-bottom: 20px;
        font-size: 18px;
        transition: .4s linear;
        button{
            padding: 12px 18px;
            border-radius: 12px;
            transition: .3s;
            width: 50%;
        }
        button.delete{
            color: ${whiteColor};
            background-color: ${dangerColor};
            &:hover{
                background-color: ${dangerHoverColor};
            }
        }
        button.cancel{
            background-color: ${bgColor};
            &:hover{
                background-color: ${bgHoverColor};
            }
        }
    }
    .content{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        p{
            font-size: 18px;
        }
    }
`

const Title = styled(Dialog.Title)`
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 12px;
    position: relative;
    top: 20px;
    left: 18px;
    width: 100%;
`
const CloseBtn = styled(Dialog.Close)`
    position: absolute;
    top: 20px;
    right: 18px;
    cursor: pointer;
`

interface ModalProps {
    open: boolean;
    onOpenChangeAction: (open:boolean) => void;
    title?:string;
    children: React.ReactNode;
}

const contentVariants = {
    hidden: { opacity: 0, scale: 0.85, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0 },
};

export default function Modal({open, onOpenChangeAction, title, children}:ModalProps){
    return(
        <Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
            <Dialog.Portal>
                <Dialog.Overlay asChild>
                    <Overlay />
                </Dialog.Overlay>
                <Dialog.Content asChild>
                    <ContentWrapper
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={contentVariants}
                        transition={{ duration: 0.3 }}
                        tabIndex={-1}
                    >
                        {title && <Title>{title}</Title>}
                        {children}
                        <CloseBtn aria-label="Close">
                            <Image src={'/icons/close.svg'} alt={'close'} width={30} height={30} />
                        </CloseBtn>
                    </ContentWrapper>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}