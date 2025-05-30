'use client'
import React, {useState} from 'react';
import Image from "next/image";
import {AuthBg, AuthBtn, AuthError, AuthForm, AuthInput, AuthWrapper} from "@/app/auth/page.styled";
import {useRouter} from "next/navigation";
import Copyright from "@/components/Copyright";

export default function AuthPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()
    const api = process.env.NEXT_PUBLIC_API_BASE

    async function send(e?: React.FormEvent) {
        if (e) e.preventDefault()

        const formData = new FormData();
        formData.append('a123', username)
        formData.append('a321', password)

        try {
            const res = await fetch(`${api}/api/v1/auth`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })
            if (!res.ok) {
                const text = await res.text();
                setError(text);
                return;
            } else {
                router.push('/admin')
            }
        } catch {
            setError('Server error')
        }
    }

    return (
        <AuthBg>
            <AuthWrapper>
                <AuthForm onSubmit={send}>
                    <h2>Welcome back!</h2>
                    <p>Manage agents and pools effortlessly</p>
                    <AuthInput>
                        <Image width='40' height='40' alt='login' title='login' src='/icons/user.svg'/>
                        <input type="text" placeholder='Username' value={username}
                               onChange={e => setUsername(e.target.value)}/>
                    </AuthInput>
                    <AuthInput>
                        <Image width='40' height='40' alt='password' title='password' src='/icons/lock.svg'/>
                        <input type="password" placeholder='Password' value={password}
                               onChange={e => setPassword(e.target.value)}/>
                    </AuthInput>
                    <AuthBtn type="submit">Login</AuthBtn>
                </AuthForm>
                <AuthError showError={!!error}>{error}</AuthError>
            </AuthWrapper>
            <Copyright />
        </AuthBg>
    );
};
