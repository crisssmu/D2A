import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import {
  codeCompanyFormData,
  ProductsFormData,
  purchaseInvoiceDetailFormData,
  purchaseInvoiceFormData,
} from "@/types/formdata";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import InvoicePurchase from "../register/invoicePurchase";
import InvoicePurchaseBottom from "../register/invoicePurchaseBottom";
import InvoicePurchaseTop from "../register/invoicePurchaseTop";
import { Loader } from "@/components/laoder/loader";
import { set } from "react-hook-form";
import { isRoundedDivi } from "@/types/function";

interface Props {
  openWatch: boolean;
  setOpenWatch: (open: boolean) => void;
  invoice: purchaseInvoiceFormData | null;
  invoiceDetails: purchaseInvoiceDetailFormData[];
  products: ProductsFormData[] | null;
  codeCompany: codeCompanyFormData[];
}

export default function PurchaseInvoiceEdit({
  openWatch,
  setOpenWatch,
  invoice,
  invoiceDetails,
  products,
  codeCompany,
}: Props) {
  const supabase = createClient();
  const { toast } = useToast();
  const [listDetails, setListDetails] = useState<
    purchaseInvoiceDetailFormData[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [productsFilter, setProductsFilter] = useState<ProductsFormData[]>([]);

  const getDetailsInvoice = async () => {
    try {
      setLoading(true);
      setListDetails(invoiceDetails);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al encontrar los detalles de la factura",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoice && openWatch) {
      getDetailsInvoice();
      console.log(invoiceDetails);
      console.log(invoice);
    }
  }, [invoice, openWatch]);

  const addDetail = (detail: purchaseInvoiceDetailFormData) => {
    const newDetail = {
      ...detail,
      quantity: detail.quantity * detail.setUnit!,
      purchase_price: detail.purchase_price / detail.setUnit!,
      gross_price: isRoundedDivi(detail.gross_price, detail.setUnit!),
      ico: detail.ico / detail.setUnit!,
      gross_subtotal: detail.gross_subtotal!,
      tax_subtotal: detail.tax_subtotal!,
      ico_subtotal: detail.ico_subtotal!,
      id: uuidv4(),
    };
    setListDetails((prev) => [...prev, newDetail]);
    toast({
      title: "Detalle agregado correctamente",
      variant: "default",
    });
  };

  const handleUpdatedInvoice = async (invoiceData: purchaseInvoiceFormData) => {
    try {
      // Get the IDs of the current invoice details
      const currentIds = invoiceDetails.map((d: any) => d.id);
      // Get the IDs of the new invoice details
      const newIds = listDetails.map((d) => d.id);
      // Get the IDs of the invoice details to delete
      const idsToDelete = currentIds.filter(
        (id: string) => !newIds.includes(id)
      );
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("purchase_invoice_detail")
          .delete()
          .in("id", idsToDelete);
        if (deleteError) throw deleteError;
      }

      const newDetails = listDetails.map((detail) => {
        return {
          id: detail.id,
          id_product: detail.id_product,
          quantity: detail.quantity,
          price_purchase: detail.purchase_price.toFixed(2),
          gross_price: detail.gross_price.toFixed(2),
          ico: detail.ico.toFixed(2),
          tax: detail.tax,
          id_purchaseInvoice: invoiceData.id,
        };
      });
      const totalAmount = listDetails.reduce(
        (acc, detail) => acc + (detail.gross_subtotal! + detail.tax_subtotal!),
        0
      )
      const newInvoice = { ...invoiceData, id: invoiceData.id, total: Math.round(totalAmount) };

      if(newInvoice !== null && newDetails !== null){
        const { error: updateError } = await supabase
        .from("purchase_invoice")
        .update(newInvoice)
        .eq("id", invoiceData.id);
      
        if (updateError) throw updateError;

        newDetails.forEach(async (detail) => {
          const { error: updateError } = await supabase
            .from("purchase_invoice_detail")
            .upsert(detail)
            .eq("id", detail.id);
          if (updateError) throw updateError;
        });
        setListDetails([]);
        toast({
        title: "Factura actualizada con exito",
      });
      console.log("Invoice and details updated successfully", invoice);
      } else {
        toast({
          title: "Fallo al actualizar la factura",
          description: "no hubo actualizacion",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar la factura",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <Dialog open={openWatch && invoice !== null} onOpenChange={setOpenWatch}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Factura de Compra</DialogTitle>
          <InvoicePurchaseTop
            handleSubmit={handleUpdatedInvoice}
            setProductsFilter={setProductsFilter}
            products={products}
            invoice={invoice}
            codeCompany={codeCompany}
            isEdit={true}
          />
        </DialogHeader>
        <InvoicePurchase
          detailsData={listDetails}
          products={productsFilter}
          onDetailChange={setListDetails}
        />
        <DialogFooter className="justify-self-center">
          <InvoicePurchaseBottom
            onSubmmit={addDetail}
            listProducts={productsFilter}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
