import { typeOfMovementFormData } from "@/types/formdata";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

interface TypeOfMovementsTableProps {
    typeOfMovements: typeOfMovementFormData[];
}
export default function TypeOfMovementsTable({typeOfMovements}: TypeOfMovementsTableProps) {


    if(typeOfMovements.length === 0){
        return (
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2} className="text-center">
                            No hay tipos de movimientos
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {typeOfMovements.map((typeOfMovement: typeOfMovementFormData) => (
                        <TableRow key={typeOfMovement.id}>
                            <TableCell>{typeOfMovement.id}</TableCell>
                            <TableCell>{typeOfMovement.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
    }   