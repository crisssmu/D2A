import { ProviderFormData } from "@/types/formdata";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";


interface ProviderEditDialogProps {
    provider: ProviderFormData | null;
    isOpen: boolean;
    onClose: (isOpen: boolean) => void  ;
    onUpdateSuccess?: (data: ProviderFormData) => Promise<void>;
}


export default function ProviderEditDialog({
    provider, isOpen, onClose, onUpdateSuccess
}: ProviderEditDialogProps) {
    const form = useForm<ProviderFormData>({
        defaultValues: {
            id: 0,
            document: 0,
            name: "",
            email: "",
            phone_number: 0,
        },
    });
    
    useEffect(() => {
        if (provider) {
            form.setValue("id", provider.id);
            form.setValue("document", provider.document);
            form.setValue("name", provider.name);
            form.setValue("email", provider.email);
            form.setValue("phone_number", provider.phone_number);
        }
    }, [provider, form]);

    return (
    <div>
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md space-y-4">
                <DialogHeader>
                    <DialogTitle>Registrar Proveedor</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => onUpdateSuccess?.(data))} className="space-y-4">
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
                                Actualizar
                            </Button>
                        </div>
                        
                    </form>
                </Form>                
                            
            </DialogContent>
        </Dialog>
    </div>
        
    )
}