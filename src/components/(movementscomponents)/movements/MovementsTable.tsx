
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MovementsFormData, ProductsFormData } from "@/types/formdata";

interface MovementsTableProps {
  detailsMovements: MovementsFormData[];
  products?: ProductsFormData[] | null;
  openMovements?: boolean;
  setOpenMovements?: (open: boolean) => void;
}

export default function MovementsTable({
  detailsMovements,
  products,
  openMovements,
  setOpenMovements
}: MovementsTableProps) {
  if (detailsMovements.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Fecha de vencimiento</TableHead>
            <TableHead>Tipo de usuario</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Nota</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              No hay movimientos registrados.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Dialog open={openMovements} onOpenChange={setOpenMovements}>
        <DialogContent className="max-w-7xl">
            <DialogHeader>
                <DialogTitle>Movimientos</DialogTitle>
            </DialogHeader>

        
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Fecha de vencimiento</TableHead>
          <TableHead>Tipo de usuario</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Nota</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {detailsMovements.map((movement: MovementsFormData) => (
          <TableRow key={movement.id}>
            <TableCell>{movement.nameProduct}</TableCell>
            <TableCell>{movement.quantity}</TableCell>
            <TableCell>{movement.gross_price}</TableCell>
            <TableCell>{movement.id_type_of_movement}</TableCell>
            <TableCell>
              {new Date(movement.date).toISOString().split("T")[0]}
            </TableCell>
            <TableCell>
              {movement.due_date
                ? new Date(movement.due_date).toISOString().split("T")[0]
                : "N/A"}
            </TableCell>
            <TableCell>
              {movement.type_source === true ? "Cliente" : "Proveedor"}
            </TableCell>
            <TableCell>{movement.id_source}</TableCell>
            <TableCell>{movement.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </DialogContent>
    </Dialog>
  );
}
