"use client";

import { Loader } from '@/components/laoder/loader';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from '@/lib/store/auth';
import { useGlobalStore } from '@/lib/store/global';
import { LoginFormData } from '@/types/formdata';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from './actions';

export default function LoginPage() {
    const [userCookies, setUserCookies] = useState<{data: {id: string , email: string | null}}>({data: {id: "", email: ""}});
    const supabase = createClient();
    const router = useRouter();
    const [loginFormData, setLoginFormData] = useState<LoginFormData>({ email: '', password: '' });
    const { loader, setLoader } = useGlobalStore();
    const { setIsLogged } = useAuthStore();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoader(true);
        e.preventDefault();
        const data = await login(loginFormData);
        if (data) {
            setIsLogged(true);
            const {data: user, error} = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error.message);
            }
            const userId = user.user?.id ?? "";
            const userEmail = user.user?.email ?? null;
            setUserCookies({ data: { id: userId, email: userEmail } });
            await fetch('/api/user/setuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ user: { id: userId , email: userEmail } }),
            });
            setLoader(false);
            router.push('/admindashboard');
            
        }
        
    };

    if(loader){
        return (
            <div className='w-full h-full mx-auto p-4 items-center justify-center flex'>
                <Loader />
            </div>
        )
    }

    return (
        <div className='w-full h-full mx-auto p-4 items-center justify-center flex'>
            <Card className='w-full max-w-md ml-2.5'>
                <CardHeader>
                    <CardTitle>Inicio de sesion</CardTitle>
                    <CardDescription>Ingresa tu email y contraseña para entrar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-col gap-6'>
                            <div className='grid gap-2'>
                                <Label className='mr-2' htmlFor="email">Email:</Label>
                                <Input
                                    className='w-full'
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={loginFormData?.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor="password">Contraseña:</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={loginFormData?.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-3 pt-6'>
                            <Button
                                variant={"normal"}
                                className=""
                                type="submit"
                            >
                                Iniciar sesion
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
