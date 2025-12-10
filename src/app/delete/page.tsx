"use client";   

import { Button } from "@/components/ui/button";
import { deleteUser } from "./actions"
import { useTransition } from "react";
import { Input } from "@/components/ui/input";

export default function Delete({userId}: {userId: string}) {
    const [ pending, starTransation ] = useTransition();

    const handleDelete = () => {
        starTransation(async () => {
            try {
                await deleteUser(userId);
                alert("Usuario Eliminado");
            } catch (error) {
                alert("Error al eliminar el usuario");
            }
        })
    }

    return(
        <div>
            <h1>Eliminar Usuario</h1>
            <Input className="w-1/2" id="userId" value={userId} onChange={(e) => userId = e.target.value} placeholder="Id del usuario" />
            <Button onClick={handleDelete} disabled={pending} >{pending ? "Eliminando..." : "Eliminar"}</Button>

        </div>
    )
}