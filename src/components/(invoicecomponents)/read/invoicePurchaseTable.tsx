'use client';

import {
  codeCompanyFormData,
  purchaseInvoiceFormData,
} from "@/types/formdata";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { FileText, Pencil } from "lucide-react";

interface invoicePurchaseReadProps {
  invoices: purchaseInvoiceFormData[];
  onSelectInvoice: (invoice: purchaseInvoiceFormData) => void;
  onOpenDialog: (open: boolean) => void;
  codeCompany: codeCompanyFormData[]
  openEditDialog: (open: boolean) => void
}
export const InvoicePurchaseTable = ({
  invoices,
  onSelectInvoice,
  onOpenDialog,
  codeCompany,
  openEditDialog
}: invoicePurchaseReadProps) => {
  return (
    <div >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° factura</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead>Código de la empresa</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <div className="flex flex-row gap-3">
                  <span title="Detalle la factura">
                    <FileText
                      size={18}
                      className="hover:cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out"
                      onClick={() => {
                        onSelectInvoice(invoice);
                        onOpenDialog(true);
                      }}
                    ></FileText>
                  </span>
                  
                  {invoice.id}
                </div>
              </TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.reference}</TableCell>
              <TableCell>{codeCompany.find((code) => code.id === invoice.id_codeCompany)?.company_name || "N/A"}</TableCell>
              <TableCell>{invoice.total}</TableCell>
              <TableCell>
                <Pencil size={18} className="hover:cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out"  onClick={() => {
    onSelectInvoice(invoice); // agrega esto si quieres editar la seleccionada
    openEditDialog(true);
  }}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
