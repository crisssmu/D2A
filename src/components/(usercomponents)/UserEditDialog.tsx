"use client";

import { UserFormData } from "@/types/formdata";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserEditProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: UserFormData | null;
    onSubmit: (data: UserFormData) => Promise<void>;
    isSeller?: boolean;
}

export const UserEdit = ({
    open,
    setOpen,
    user,
    onSubmit,
    isSeller
}: UserEditProps) => {

    if(!user) return;

    const [form, setForm] = useState<UserFormData>({
        id: user.id,
        document: user.document ?? "",
        phone_number: user.phone_number ?? "",
        birth_date: user.birth_date ?? "",
        name: user.name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        address: user.address ?? "",
        password: user.password ?? ""
    });

    useEffect(() => {
        if (user) {
            setForm({
                id: user.id,
                document: user.document ?? "",
                phone_number: user.phone_number ?? "",
                birth_date: user.birth_date ?? "",
                name: user.name ?? "",
                last_name: user.last_name ?? "",
                email: user.email ?? "",
                address: user.address ?? "",
                password: user.password ?? ""
            });
        }
    }, [user, open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md space-y-4">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-bold text-center">Editar usuario</DialogTitle>
                </DialogHeader>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Nombre</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}></Input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Apellido</Label>
                        <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}></Input>
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Documento</Label>
                        <Input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })}></Input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Fecha de nacimiento</Label>
                        <Input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })}></Input>
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Teléfono</Label>
                        <Input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })}></Input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Dirección</Label>
                        <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}></Input>
                    </div>
                </div>
                {!isSeller &&
                    <div className="flex flex-col gap-2">
                        <Label>Email</Label>
                        <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}></Input>
                    </div>}

                <div className="flex flex-row justify-center gap-6">
                    <Button onClick={() => onSubmit(form)}>Guardar</Button>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}