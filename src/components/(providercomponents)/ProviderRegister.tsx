'use client';
import { ProviderFormData } from "@/types/formdata"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast";



export const ProviderRegister = ( 
) => {
    const supabase = createClient();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false)
    const form = useForm<ProviderFormData>({
        defaultValues: {
            document: undefined,
            name: "",
            email: "",
            phone_number: undefined,
        },
    });

    const onSubmit = async (values: ProviderFormData) => {
        setLoading(true);
            if(!values) return
        try{

            const res = await fetch("/api/provider/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if(!res.ok){
                toast({
                    title: "Error",
                    description: "Error al crear el proveedor",
                    variant: "destructive"
                })
                throw new Error(res.statusText);
            } 

            const arrayProviders = Array.isArray(data) ? data : Array.isArray(data?.providers) ? data.providers : [];
            console.log(arrayProviders);
                toast({
                    title: "Proveedor creado",
                    description: "Proveedor creado correctamente",
                    variant: "default"
                })
            
        } catch (error) {
            console.log(error);
            toast({
                    title: "Error",
                    description: "Error al crear el proveedor",
                    variant: "destructive"
                })
        } finally {
            setLoading(false);
        }
    }


    return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Registrar Proveedor</CardTitle>
                </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-row gap-3">
                        <FormField
                            control={form.control}
                            name="document"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Documento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Documento" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />  
                        </div>
                        <div className="flex flex-row gap-3">
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Correo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefono</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Telefono" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button type="submit" >
                                Registrar
                            </Button>
                        </div>
                        
                    </form>
                </Form>                
            
            </CardContent>
            </Card>
    )
}