"use client";

import { useToast } from "@/hooks/use-toast";
import {
  ProductsFormData,
  purchaseInvoiceDetailFormData
} from "@/types/formdata";
import { isRoundedMult } from "@/types/function";
import { Minus, Plus, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "../../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface InvoicePurchaseProps {
  detailsData: purchaseInvoiceDetailFormData[];
  products: ProductsFormData[] | null;
  onDetailChange: (details: purchaseInvoiceDetailFormData[]) => void;
}

export default function InvoicePurchase({
  detailsData,
  products,
  onDetailChange,
}: InvoicePurchaseProps) {
  
  const { toast } = useToast();
  const [total, setTotal] = useState<number>(0);
  const [details, setDetails] =
    useState<purchaseInvoiceDetailFormData[]>(detailsData);
    const { boxTotal, subtotalCost, subtotalTax, unitTotal, icoSubtotal, discountSubtotal } = details.reduce(
      (acc, detail) => {
        if (!detail.isUnit) {
          acc.subtotalCost += detail.gross_price * (detail.quantity / detail.setUnit!) * detail.setUnit!;
          acc.subtotalTax += (detail.tax * detail.gross_price) * (detail.quantity / detail.setUnit!) * detail.setUnit!;
          acc.icoSubtotal += detail.ico * (detail.quantity / detail.setUnit!) * detail.setUnit!;
          acc.discountSubtotal += detail.value_discount * (detail.quantity / detail.setUnit!) * detail.setUnit!;
          acc.boxTotal += detail.quantity / detail.setUnit!;
        } else {
          acc.subtotalCost += detail.gross_price * detail.quantity  * detail.setUnit!;
          acc.subtotalTax += ( detail.tax * detail.gross_price) * detail.quantity * detail.setUnit!;
          acc.icoSubtotal += detail.ico * (detail.quantity / detail.setUnit!) * detail.setUnit!;
          acc.discountSubtotal += detail.value_discount * (detail.quantity / detail.setUnit!) * detail.setUnit!;
          acc.unitTotal += detail.quantity || 0;
        }
        return acc;
      },
      { boxTotal: 0, subtotalCost: 0, subtotalTax: 0, unitTotal: 0, icoSubtotal: 0, discountSubtotal: 0 }
    );
  

  useEffect(() => {
    setTotal(subtotalCost + subtotalTax + icoSubtotal);
  }, [details]);

  useEffect(() => {
    setDetails(detailsData);
  }, [detailsData]);

  const plusQuantity = (id: string) => {
    let updatedQuantity = 0;
    setDetails((prev) => {
      const updated = prev.map((detail) => {
        if (detail.id === id) {
          const product = products?.find(
            (product) => product.id === detail.id_product
          );
          if(detail.isUnit){
            updatedQuantity = detail.quantity + 1;
          } else {
            updatedQuantity = detail.quantity + detail.setUnit!;
          }
          const subtotal = detail.gross_price * updatedQuantity;
          const subtotal_tax =
            (detail.tax * detail.gross_price) * updatedQuantity;
          const subtotal_ico = detail.ico * updatedQuantity;
          return {
            ...detail,
            quantity: updatedQuantity,
            subtotal,
            subtotal_tax,
            subtotal_ico,
          };
        }
        return detail;
      });
      // Solo llamar a onDetailChange aquí, fuera del render
      setTimeout(() => { if (onDetailChange) onDetailChange(updated); }, 0);
      return updated;
    });
  };

  const minusQuantity = (id: string) => {
    let updatedQuantity = 1;
    setDetails((prev) => {
      const updated = prev.map((detail) => {
        if (detail.id === id) {
          const product = products?.find(
            (product) => product.id === detail.id_product
          );
          
          if(detail.isUnit){
            (updatedQuantity === 1) ? updatedQuantity = 1 : updatedQuantity = detail.quantity - 1;
          } else {
            updatedQuantity === detail.setUnit! ? updatedQuantity = detail.setUnit! : updatedQuantity = detail.quantity - detail.setUnit!;
          }
          
          const subtotal = detail.gross_price * updatedQuantity;
          const subtotal_tax = (detail.tax * detail.gross_price) * updatedQuantity;
          const subtotal_ico = detail.ico * updatedQuantity;
          return {
            ...detail,
            quantity: updatedQuantity,
            subtotal,
            subtotal_tax,
            subtotal_ico,
          };
        }
        return detail;
      });
      setTimeout(() => { if (onDetailChange) onDetailChange(updated); }, 0);
      return updated;
    });
  };

  const deleteDetail = (id: string) => {
    setDetails((prev) => {
      const updated = prev.filter((detail) => detail.id !== id);
      setTimeout(() => { if (onDetailChange) onDetailChange(updated); }, 0);
      toast({
        title: "Detalle eliminado correctamente",
        variant: "default",
      });
      return updated;
    });
  };

  const handleSubtotal = (detail : purchaseInvoiceDetailFormData, isTax: boolean, isIco: boolean) => {
      detail.gross_subtotal = isRoundedMult(detail.gross_price, detail.quantity);
      detail.ico_subtotal = isRoundedMult(detail.ico, detail.quantity);
      detail.tax_subtotal = isRoundedMult(detail.tax * detail.gross_price + detail.gross_price, detail.quantity);
    if (isTax) {
      return detail.tax_subtotal;
    } else if (isIco) {
      return detail.ico_subtotal;
    } else {
      return detail.gross_subtotal;
    }
  }

  if (detailsData.length === 0) {
    return (
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio Bruto Un.</TableHead>
            <TableHead>ICO</TableHead>
            <TableHead>IVA</TableHead>
            <TableHead>Precio compra</TableHead>
            <TableHead>Descuento</TableHead>
            <TableHead>Precio Bruto</TableHead>
            <TableHead>Valor IVA</TableHead>
            <TableHead>Valor ICO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              No hay detalles disponibles
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead colSpan={1}>Subtotales</TableHead>
            <TableHead colSpan={5}>{boxTotal}</TableHead>
            <TableHead>{0}</TableHead>
            <TableHead>{0}</TableHead>
            <TableHead>{0}</TableHead>
            <TableHead>{0}</TableHead>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  return (
    <>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio Bruto Un.</TableHead>
            <TableHead>ICO</TableHead>
            <TableHead>IVA</TableHead>
            <TableHead>Precio compra</TableHead>
            <TableHead>Descuento</TableHead>
            <TableHead>Precio Bruto</TableHead>
            <TableHead>Valor IVA</TableHead>
            <TableHead>Valor ICO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((detail: purchaseInvoiceDetailFormData) => {
            return (
              <TableRow key={detail.id}>
                  <TableCell>
                    {detail.nameProduct} x {detail.setUnit}
                  </TableCell>
                <TableCell>
                  {
                    <div className="flex flex-row items-center gap-2">
                      <div>
                        <Minus
                          size={20}
                          className="hover:cursor-pointer border-2 rounded-sm bg-transparent text-red-600 hover:bg-red-600 transition-colors duration-200 ease-in-out hover:text-white border-red-600"
                          onClick={() => minusQuantity(detail.id)}
                        />
                      </div>
                      <div>{detail.quantity / detail.setUnit!}</div>
                      <div>
                        <Plus
                          size={20}
                          className="hover:cursor-pointer border-2 rounded-sm bg-transparent text-red-600 hover:bg-red-600 transition-colors duration-200 ease-in-out hover:text-white border-red-600"
                          onClick={() => plusQuantity(detail.id)}
                        />
                      </div>
                    </div>
                  }
                </TableCell>
                <TableCell>{isRoundedMult(detail.gross_price, detail.setUnit!)}</TableCell>
                <TableCell>{isRoundedMult(detail.ico, detail.setUnit!)}</TableCell>
                <TableCell>{detail.tax}</TableCell>
                <TableCell>
                  {isRoundedMult(detail.purchase_price, detail.setUnit!)}
                </TableCell>
                <TableCell>{isRoundedMult(detail.value_discount, detail.setUnit!)}</TableCell>
                <TableCell>{handleSubtotal(detail, false, false)}</TableCell>
                <TableCell>{handleSubtotal(detail, true, false)}</TableCell>
                <TableCell>{handleSubtotal(detail, false, true)}</TableCell>
                <TableCell>
                  <Trash2Icon
                    size={18}
                    className="hover:cursor-pointer bg-transparent rounded-lg  shadow-md hover:text-red-600 transition-colors duration-200 ease-in-out"
                    onClick={() => deleteDetail(detail.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead colSpan={1}>Subtotales</TableHead>
            <TableHead colSpan={5}>
              {boxTotal},{unitTotal}
            </TableHead>
            <TableHead>{isRoundedMult(discountSubtotal, 1)}</TableHead>
            <TableHead>{isRoundedMult(subtotalCost, 1)}</TableHead>
            <TableHead>{isRoundedMult(subtotalTax, 1)}</TableHead>
            <TableHead>{isRoundedMult(icoSubtotal, 1)}</TableHead>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex justify-end ">
        <div className="flex flex-row gap-2 ">
          <Label>Total Factura:</Label>
          <Label>{Math.round(total)}</Label>
        </div>
      </div>
    </>
  );
}
