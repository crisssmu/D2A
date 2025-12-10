import { ProductsFormData, ProviderFormData } from "@/types/formdata";
import { isRoundedMult } from "@/types/function";
import { Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";

interface TableProductProps {
    products: ProductsFormData[];
    providers: ProviderFormData[] | null;
    onSelectProduct: (product: ProductsFormData) => void;
    onOpenDialog: (open: boolean) => void;
}

const taxStates: Record<string, string> = {
    "1": "GRAVADO",
    "2": "EXCLUIDO",
    "3": "EXCENTO"
};

export const ProductsTable = (
    {
        products,
        providers,
        onSelectProduct,
        onOpenDialog
    }: TableProductProps
) => {
    const handleBoxAndUnit = (product: ProductsFormData) => {
        const box: number = Math.floor(product.quantity / product.unit_per_box);
        const unit: number = product.quantity % product.unit_per_box;
        return { box, unit };
    }
    if (products.length === 0) {
        return (
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Presentacion</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Precio de venta</TableHead>
                        <TableHead>Precio de compra</TableHead>
                        <TableHead>Precio bruto</TableHead>
                        <TableHead>Iva</TableHead>
                        <TableHead>Ico</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={9} className="text-center">
                            No hay productos
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Presentacion</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Precio de venta</TableHead>
                    <TableHead>Precio de compra</TableHead>
                    <TableHead>Precio bruto</TableHead>
                    <TableHead>Impuesto</TableHead>
                    <TableHead>Iva</TableHead>
                    <TableHead>Ico</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product: ProductsFormData) => {
                    const provider = providers?.find((prov) => prov.id === product.id_provider);

                    return (
                        <TableRow key={product.id}>
                            <TableCell>{product.code_product}</TableCell>
                            <TableCell>{product.name} x {product.unit_per_box}</TableCell>
                            <TableCell>{product.isReturnable == true ? "Retornable" : "No Retornable"}</TableCell>
                            <TableCell>
                                {(() => { if(product.code_product.startsWith("PLAST-")) {
                                    const box = product.quantity;
                                    return `${box},0`;
                                }
                                    const { box, unit } = handleBoxAndUnit(product);
                                    return `${box},${unit}`;
                                })()}
                            </TableCell>
                            <TableCell>{provider?.name || "—"}</TableCell>
                            <TableCell>{isRoundedMult(product.sales_price, product.unit_per_box) }</TableCell>
                            <TableCell>{isRoundedMult(product.purchase_price, product.unit_per_box) }</TableCell>
                            <TableCell>{isRoundedMult(product.gross_price, product.unit_per_box) }</TableCell>
                            <TableCell>{taxStates[String(product.id_tax)] || "—"}</TableCell>
                            <TableCell>{product.tax}</TableCell>
                            <TableCell>{isRoundedMult(product.ico, product.unit_per_box) }</TableCell>
                            <TableCell>
                                <Pencil 
                                    size={18}
                                    className="cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out" 
                                    onClick={() => { 
                                        onSelectProduct(product);
                                        onOpenDialog(true);
                                    }} 
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={9} className="text-center">
                        Total de productos: {products.length}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}