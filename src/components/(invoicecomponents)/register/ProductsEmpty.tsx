import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductsFormData, purchaseInvoiceDetailFormData } from "@/types/formdata";
import { useEffect, useState } from "react";


interface ProductsEmptyProps {
    productsWithoutLiquid?: ProductsFormData[] | null;
    onChangeProductsQuantity?: purchaseInvoiceDetailFormData[] | null;
}
export function ProductsEmpty({ productsWithoutLiquid, onChangeProductsQuantity}: ProductsEmptyProps) {
  const [productEmpty, setProductEmpty] = useState<ProductsFormData[]>(productsWithoutLiquid || []);
  const [quantity, setQuantity] = useState<number>(0);
 
  
  useEffect(() => {
    if (productsWithoutLiquid) {
      setProductEmpty(productsWithoutLiquid);
      setQuantity(productsWithoutLiquid.map(product => {
        const detail = onChangeProductsQuantity?.find(detail => detail.id_product === product.id);
        return detail ? detail.quantity : 0;
      }).reduce((acc, qty) => acc + qty, 0));
    }
  }, [productsWithoutLiquid]);

  useEffect(() => {
    
  }, [onChangeProductsQuantity, productEmpty]);

    if (productEmpty && productEmpty.length === 0) {
      return (
        <div className="text-center py-10">
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No hay productos registrados.
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    }
  
    return (
    <div className="text-center py-10">
      <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {productEmpty?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.code_product}</TableCell>
                    <TableCell>{product.name} x {product.unit_per_box}</TableCell>
                    <TableCell>{quantity || 0}</TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}