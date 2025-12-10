"use client";
import {
  ProductsFormData,
  purchaseInvoiceDetailFormData,
  purchaseInvoiceFormData,
} from "@/types/formdata";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { isRoundedMult } from "@/types/function";

interface invoicePurchaseDetailsListProps {
  details: purchaseInvoiceDetailFormData[];
  open: boolean;
  setOpen: (open: boolean) => void;
  invoice: purchaseInvoiceFormData | null;
  products: ProductsFormData[] | null;
}

export default function InvoicePurchaseDetailsList({
  details,
  open,
  setOpen,
  invoice,
  products,
}: invoicePurchaseDetailsListProps) {
  
  
  const { subtotalCost, subtotalTax } = details.reduce((acc, detail) => {
    let cost: any = 0, tax: any = 0;
    cost = isRoundedMult(detail.gross_price, detail.quantity);
    tax = isRoundedMult(detail.ico + detail.tax * detail.gross_price, detail.quantity);
    acc.subtotalCost += cost;
    acc.subtotalTax += tax;
    return acc;
  }, { subtotalCost: 0, subtotalTax: 0 });
  
  const handleSubtotal = (detail : purchaseInvoiceDetailFormData, isTax: boolean) => {

    detail.gross_subtotal = isRoundedMult(detail.gross_price, detail.quantity);
    detail.tax_subtotal = isRoundedMult(detail.tax * detail.gross_price + detail.ico , detail.quantity);
    return isTax ? detail.tax_subtotal : detail.gross_subtotal;
  }

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className=" h-auto p-4">
          <DialogHeader className="justify-start">
            <DialogTitle>Detalles de la factura</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio venta</TableHead>
                <TableHead>Precio compra</TableHead>
                <TableHead>Costo Bruto</TableHead>
                <TableHead>ICO</TableHead>
                <TableHead>IVA</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Subtotal Impuesto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail) => {
                const product = products!.find(
                  (p) => p.id === detail.id_product
                );
                
                return (
                  <TableRow key={detail.id}>
                    <TableCell>{product?.name || "N/A"} x {detail.setUnit}</TableCell>
                    <TableCell>
                      {detail.quantity / detail.setUnit!}
                    </TableCell>
                    <TableCell>{detail.sales_price}</TableCell>
                    <TableCell>{isRoundedMult(detail.purchase_price, detail.setUnit!)}</TableCell>
                    <TableCell>{isRoundedMult(detail.gross_price, detail.setUnit!)}</TableCell>
                    <TableCell>{isRoundedMult(detail.ico, detail.setUnit!)}</TableCell>
                    <TableCell>{detail.tax}</TableCell>
                    <TableCell>{handleSubtotal(detail, false)}</TableCell>
                    <TableCell>{handleSubtotal(detail, true)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} className="text-right">
                  Total
                </TableCell>
                <TableCell>
                  {isRoundedMult(subtotalCost, 1)}
                </TableCell>
                <TableCell>
                  {isRoundedMult(subtotalTax, 1)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={7} className="text-right">
                  Total Factura
                </TableCell>
                <TableCell>{invoice?.total}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
