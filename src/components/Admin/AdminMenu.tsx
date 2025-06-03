'use client'
import React, {useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import {blackColor, primaryColor, whiteColor} from "@/styles/colors";
import {usePathname} from "next/navigation";
import {useUI} from "@/components/UI/UIProvider";
import AdminOptions from "@/components/Admin/AdminOptions";
import {api} from "@/lib/const";
import {router} from "next/client";


const MenuLogo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 50px;

    h2 {
        line-height: 1;
        font-weight: 600;
        font-size: 22px;
    }
`
const MenuLinks = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 30px;
    width: 90%;
`
const MenuLink = styled.li`
    display: flex;
    cursor: pointer;
    justify-content: start;
    align-items: center;
    width: 90%;
    gap: 16px;

    p {
        font-size: 24px;
        color: ${blackColor};
        z-index: 1;
        white-space: nowrap;
    }

    div {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 16px;
        position: relative;
    }

    div::after {
        content: '';
        position: absolute;
        top: -10%;
        left: -12%;
        width: 130%;
        height: 120%;
        border-radius: 10px;
        background-color: ${primaryColor};
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 0;
    }
    &:hover div::after {
        opacity: .1;
    }
    &.active div::after {
        background-color: ${primaryColor};
        opacity: 1;
    }
    img {
        z-index: 1;
    }
    &.active {
        p {
            color: ${whiteColor};
        }
    }
`
const MenuSubLinks = styled.div<{ $isOpen: boolean }>`
    overflow: hidden;
    max-height: ${({$isOpen}) => ($isOpen ? '400px' : '0')};
    width: 80%;
    transition: max-height .4s ease;

    li {
        margin-bottom: 30px;
        justify-content: end;
    }
`

const AdminMenu = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const {openModal, closeModal,addToast} = useUI();
    const pathname = usePathname();

    const cleanLogs = async () => {
        try {
            const res = await fetch(`${api}/api/v1/logs`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error(await res.text());
            addToast({ type: "success",title:"Logs cleaned", message: "Logs cleaned successfully" });

        } catch (err){
            addToast({ type: "danger", title:"Error logs cleaned", message: err instanceof Error ? err.message : 'Unknown error' });
        }
    };

    function openSettings(){
        openModal(<AdminOptions onClose={closeModal} />, "Admin Options")
    }
    async function logout(){
        try {
            const res = await fetch(`${api}/api/v1/exit`);
            if (!res.ok) {
                throw new Error('Logout failed');
            }
            router.push('/auth');
        } catch (err) {
            addToast({ type: "danger", title:"Logout error", message: err instanceof Error ? err.message : 'Unknown error' });
        }
    }

    const topMenu = [
        { label: "Agents", path: '/admin', img: 'agents.svg', imgActive: 'agents-active.svg' },
        { label: "Pools", path: '/admin/pools', img: 'pools.svg', imgActive: 'pools-active.svg' },
        { label: "Users", path: '/admin/users', img: 'users.svg', imgActive: 'users-active.svg' },
        {
            label: "Logs", img: 'logs.svg', sub: [
                { label: "Open logs", action: () => window.open(`${api}/api/v1/logs`, '_blank') },
                { label: "Clean logs", action: cleanLogs }
            ]
        },
    ];

    const bottomMenu = [
        { label: "Options", path: '/admin/options', img: 'options.svg', action:openSettings },
        { label: "Sign Out", path: '/logout', img: 'logout.svg', action:logout },
    ];

    const toggleSubMenu = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <div>
                <MenuLogo>
                    <Image src="/icons/logo.png" width='50' height='50' alt='logo' title='logo' loading="lazy" />
                    <h2>Digger Management System</h2>
                </MenuLogo>
                <MenuLinks>
                    {topMenu.map((item, i) =>
                        item.sub ? (
                            <React.Fragment key={i}>
                                <MenuLink onClick={() => toggleSubMenu(i)}>
                                    <div>
                                        <Image src={'/icons/' + item.img} width='46' height='46' alt={item.label} />
                                        <p>{item.label}</p>
                                        <Image src={'/icons/more.svg'} width='25' height='25' alt='more' />
                                    </div>
                                </MenuLink>
                                {item.sub && (
                                    <MenuSubLinks $isOpen={openIndex === i}>
                                        {item.sub.map((itemSub, j) => (
                                            <MenuLink
                                                key={j}
                                                as="button"
                                                onClick={itemSub.action}
                                                style={{ cursor: 'pointer', marginBottom: '18px' }}
                                            >
                                                <p>{itemSub.label}</p>
                                            </MenuLink>
                                        ))}
                                    </MenuSubLinks>
                                )}
                            </React.Fragment>
                        ) : (
                            <Link key={i} href={item.path} passHref legacyBehavior>
                                <MenuLink as="a" className={pathname === item.path ? 'active' : ''}>
                                    <div>
                                        <Image
                                            src={pathname !== item.path ? '/icons/' + item.img : '/icons/' + item.imgActive}
                                            width='46' height='46' alt={item.label}></Image>
                                        <p>{item.label}</p>
                                    </div>
                                </MenuLink>
                            </Link>
                        )
                    )}
                </MenuLinks>
            </div>
            <MenuLinks>
                {bottomMenu.map((item, i) =>
                    <MenuLink key={i} onClick={item.action}>
                        <div>
                            <Image src={'/icons/' + item.img} width='46' height='46' alt={item.label}></Image>
                            <p>{item.label}</p>
                        </div>
                    </MenuLink>
                )}
            </MenuLinks>
        </>
    );
};

export default AdminMenu;
