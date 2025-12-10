'use client'

import CodeEditDialog from "@/components/(codecomponents)/CodeEditDialog";
import CodeTable from "@/components/(codecomponents)/CodeTable";
import { Loader } from "@/components/laoder/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { codeCompanyFormData, ProviderFormData } from "@/types/formdata";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function tableCodeCompany() {
    const [open, setOpen] = useState(false);
    const [selectCodeCompany, setSelectCodeCompany] = useState<codeCompanyFormData | null>(null);   
    const [provider, setProvider] = useState<ProviderFormData[] | null>([]);
    const [codes, setCodes] = useState<codeCompanyFormData[]>([]);
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const fetchCodes = async () => {
        setLoading(true);
        
        try {
        const res = await fetch("/api/codeCompany/cacheCode/getCache");
        
        if(!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        const codesArray = Array.isArray(data) ? data : Array.isArray(data?.codes) ? data.codes : [];
        console.log(codesArray);
            const insertIntoCodes = codesArray.map((code: codeCompanyFormData) => {
                return{
                    ...code,
                    email: code.email ?? "",
                    phone_number: code.phone_number !== null ? code.phone_number : "",
                    document: code.document !== null ? code.document : "",
                    name: code.name !== null ? code.name : "",
                    lastname: code.lastname !== null ? code.lastname : "",
                    company_name: code.company_name !== null ? code.company_name : "",
                    address: code.address !== null ? code.address : "",
                    code: code.code ?? "",
                }
            })
        setCodes(insertIntoCodes);   
        } catch (error) {
            toast({
                title: "Error",
                description: "Error al obtener los códigos",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }

    }

    const updateCodeCompany = async (data: codeCompanyFormData) => {
        setLoading(true);
        if(data == null) return;
        try {
            const res = await fetch("/api/codeCompany/updateCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                console.log("Error updating code", data);
                throw new Error(res.statusText);
            }
            toast({
                title: "Éxito",
                description: "Código actualizado correctamente",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Error al actualizar el código",
                variant: "destructive",
            });
        } finally {
            fetchCodes();
            setSelectCodeCompany(null);
            setOpen(false);
        }
    }

    useEffect(() => {
        const fetchProviders = async () => {
            const { data, error } = await supabase.from("providers").select("*");
            if (error) {
                console.error("Error fetching providers", error);
                return;
            }
            setProvider(data || null);
        }
        setLoading(true);
        fetchCodes();
        fetchProviders();
    }, [])

    if(loading){
        return(
            <div className="flex justify-center items-center h-96">
                <Loader/>
            </div>
        )
    }

    return(
        
        <div className="justify-center items-center">
            <Card className="w-full max-w-6xl mx-auto mt-10">
                <CardHeader>
                    <CardTitle className="text-center">Lista de Códigos de Compañías</CardTitle>
                </CardHeader>
                <CardContent>

                <CodeTable selectCodeCompany={setSelectCodeCompany} open={setOpen} codes={codes}  providers={provider} />
                <CodeEditDialog selectCodeCompany={selectCodeCompany} close={setOpen} open={open} onSubmmit={updateCodeCompany} providers={provider}/>
                </CardContent>

            </Card>
        </div>

    )
}