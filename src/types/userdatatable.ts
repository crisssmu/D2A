import { ColumnDef } from "@tanstack/react-table";
import { UserFormData } from "./formdata";

export const columns: ColumnDef<UserFormData>[] = [
    {
        accessorKey: 'document',
        header: 'Documento',
    },
    {
        accessorKey: 'name',
        header: 'Nombre',
    },
    {
        accessorKey: 'last_name',
        header: 'Apellido',
    },
    {
        accessorKey: 'email',
        header: 'Correo',
    },
    {
        accessorKey: 'birth_date',
        header: 'Nacimiento',
    },
    {
        accessorKey: 'number_phone',
        header: 'Teléfono',
    },
    {
        accessorKey: 'address',
        header: 'Dirección',
    },
    {
        accessorKey: 'role',
        header: 'Rol',
    }
]