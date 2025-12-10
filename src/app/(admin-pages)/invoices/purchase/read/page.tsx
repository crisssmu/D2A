"use client";
import InvoicePurchaseDetailsList from "@/components/(invoicecomponents)/read/invoicePurchaseDetailsList";
import InvoicePurchaseFilter from "@/components/(invoicecomponents)/read/invoicePurchaseFilter";
import { InvoicePurchaseTable } from "@/components/(invoicecomponents)/read/invoicePurchaseTable";
import PurchaseInvoiceEdit from "@/components/(invoicecomponents)/update/purchaseInvoiceEdit";
import { Loader } from "@/components/laoder/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  codeCompanyFormData,
  ProductsFormData,
  purchaseInvoiceDetailFormData,
  purchaseInvoiceFormData,
} from "@/types/formdata";
import { createClient } from "@/utils/supabase/client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openTable, setOpenTable] = useState(true);
  const [openDetailsInvoice, setOpenDetailsInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<purchaseInvoiceFormData | null>(null);
  const [openUpdateInvoice, setOpenUpdateInvoice] = useState(false);
  const [invoices, setInvoices] = useState<purchaseInvoiceFormData[]>([]);
  const [invoiceDetails, setInvoiceDetails] = useState<purchaseInvoiceDetailFormData[]>([]);
  const [codeCompany, setCodeCompany] = useState<codeCompanyFormData[]>([]);
  const [products, setProducts] = useState<ProductsFormData[]>([]);

  const getInvoicesForDate = async (invoicePurchase: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("search_invoice_date", {
        date_start: invoicePurchase.date_start,
        date_end: invoicePurchase.date_end,
      });

      if (error) {
        console.error("Error fetching invoices:", error);
        return;
      }

      if (data.length > 0) {
        setOpenTable(false);
        console.log(data);
        setInvoices(data);
        setOpenFilter(true);
      }
      if (data.length === 0) {
        toast({
          title: "No existen facturas",
          description: "No existen facturas para la fecha seleccionada",
        });
      }
    } catch (error) {
      toast({
        title: "No existen facturas",
        description: "No existen facturas para la fecha seleccionada",
      });
      console.log("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products/cacheproduct/getcache");
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const productsArray = Array.isArray(data)
      ? data
      : data.data || data.products || [];

    setProducts(productsArray);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCodeCompany = async () => {
      const res = await fetch("/api/codeCompany/cacheCode/getCache");
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const arrayCodes = Array.isArray(data)
        ? data
        : Array.isArray(data?.codes)
        ? data.codes
        : [];
      setCodeCompany(arrayCodes);
    };
    fetchCodeCompany();
  }, []);

  const fetchDetailsInvoice = async (id_invoice: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("purchase_invoice_detail")
        .select("*")
        .eq("id_purchaseInvoice", id_invoice);
      if (error) throw error;

      const insertDetails = data.map((detail) => {
        const product = products.find((prod) => prod.id === detail.id_product);

        const unitPerBox = product ? product.unit_per_box : 1;

        return {
          ...detail,
          isUnit: detail.quantity % unitPerBox! === 0 ? false : true,
          setUnit: detail.quantity % unitPerBox! === 0 ? unitPerBox : 1,
        };
      });

      setInvoiceDetails(insertDetails);
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al encontrar los detalles de la factura",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedInvoice) {
      fetchDetailsInvoice(selectedInvoice.id);
    }
  }, [selectedInvoice]);

  const handleOutInvoice = () => {
    setOpenTable(true);
    setOpenFilter(false);
    if (openDetailsInvoice) {
      setOpenUpdateInvoice(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col w-full h-full items-center justify-center ">
        <Card hidden={openFilter}>
          <CardHeader>
            <CardTitle>Facturas de compra</CardTitle>
            <CardDescription>Filtra las facturas de compra</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoicePurchaseFilter
              codeCompany={codeCompany}
              handleSubmit={getInvoicesForDate}
            />
          </CardContent>
        </Card>
        <Card hidden={openTable} className="w-full">
          <CardHeader>
            <div className="flex flex-row justify-between">
              <CardTitle>Facturas de compra</CardTitle>
              <X
                className="hover:cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out right-0"
                onClick={handleOutInvoice}
              ></X>
            </div>
            <CardDescription>
              Aqui puedes ver las facturas de compra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvoicePurchaseTable
              invoices={invoices}
              onSelectInvoice={setSelectedInvoice}
              onOpenDialog={setOpenDetailsInvoice}
              codeCompany={codeCompany}
              openEditDialog={setOpenUpdateInvoice}
            />
          </CardContent>
        </Card>
      </div>
      <InvoicePurchaseDetailsList
        details={invoiceDetails}
        open={openDetailsInvoice}
        setOpen={setOpenDetailsInvoice}
        invoice={selectedInvoice}
        products={products}
      />

      <PurchaseInvoiceEdit
        openWatch={openUpdateInvoice}
        setOpenWatch={setOpenUpdateInvoice}
        invoiceDetails={invoiceDetails}
        invoice={selectedInvoice}
        products={products}
        codeCompany={codeCompany}
      />
    </>
  );
}
