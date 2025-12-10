'use client'

import { NavItem } from "@/lib/constants/nav-items";
import { useAuthStore } from "@/lib/store/auth";
import { useGlobalStore } from "@/lib/store/global";
import { UserFormData } from "@/types/formdata";
import { get } from "http";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    
    const {loader, setLoader} = useGlobalStore();
    const {isLogged, setIsLogged} = useAuthStore();
    const { actualUserRol, setActualUserRol } = useAuthStore();
    const router = useRouter();

    const [userCookie, setUserCookie] = useState<UserFormData | null>(null);

    const getUser = async () => {
        const res = await fetch("/api/user/getuser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await res.json();
        setUserCookie(data.user);
        return data.user.name;
    };

    useEffect(() => {
        getUser();
    }, []);


    useEffect(() => {
        if(!loader){
            setLoader(true);
        }
        if(!isLogged){
            setIsLogged(true);
            setActualUserRol(true);
        }
        setLoader(false);
    }, []);


    if(loader)
    return(
        <div className="w-full h-full mx-auto p-4 items-center justify-center flex">
            <Loader />
        </div>
    )

    return (
        <div>
            <h1>
                Hola, {userCookie ? userCookie.email : "Usuario"}
            </h1>
        </div>
    )
}