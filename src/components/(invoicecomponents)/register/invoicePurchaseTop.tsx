'use client';
import { codeCompanyFormData, ProductsFormData, ProviderFormData, purchaseInvoiceFormData } from "@/types/formdata";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../ui/form";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface invoiceRegisterProps {
  handleSubmit: (data: purchaseInvoiceFormData) => void;
  setProductsFilter : (product: ProductsFormData[]) => void;
  products: ProductsFormData[] | null;
  invoice?: purchaseInvoiceFormData | null;
  isEdit?: boolean;
  set_Provider?: (provider: ProviderFormData[]) => void;
}

export default function InvoicePurchaseTop({
  handleSubmit,
  setProductsFilter,
  products,
  invoice,
  isEdit,
  set_Provider
}: invoiceRegisterProps) {
  const [codeCompany, setCodeCompany] = useState<codeCompanyFormData[]>([]);
  const [providers, setProviders] = useState<{ id: number; name: string}[]>([]);
  
  const form = useForm<purchaseInvoiceFormData>({
    defaultValues: {
      id_codeCompany: undefined,
      reference: "",
      date: new Date().toISOString().split("T")[0],
      id_seller: "",
      total: 0,
      is_cash_payment: true,
      payment_due_date: "",
    },
  });
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

  async function fetchProvider(){
    try{
      const res = await fetch('/api/provider/getCache');
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      const providersArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.providers)
        ? data.providers
        : [];
        setProviders(providersArray);
        set_Provider!(providersArray);
    } catch(error){
      console.error("Error fetching providers:", error);
    }
  }

  useEffect(() => {
    fetchCodeCompany();
    fetchProvider();
  }, []);

  useEffect(() => {
    const id_codeCompany = Number(form.getValues("id_codeCompany"));
    const code = codeCompany.find((code) => code.id === id_codeCompany);
    const id_provider = providers.find((provider) => provider.id === code?.id_provider);
    const filtered = products?.filter((product) => product.id_provider === id_provider?.id) || [];
    setProductsFilter(filtered);
  }, [form.watch("id_codeCompany")]);

  useEffect(() => {
    const cashPayment = form.getValues("is_cash_payment");
    const date = form.getValues("date");
    if (cashPayment) {
      form.setValue("payment_due_date", date);
    }
  }, [form.watch("is_cash_payment")]);

  useEffect(() => {
      if (invoice && isEdit) {
      form.setValue("id", invoice.id);
      form.setValue("id_codeCompany", invoice.id_codeCompany);
      form.setValue("reference", invoice.reference);
      form.setValue("date", invoice.date);
      form.setValue("id_seller", invoice.id_seller);
      form.setValue("total", invoice.total);
      form.setValue("is_cash_payment", invoice.is_cash_payment);
      form.setValue("payment_due_date", invoice.payment_due_date);
      // Disparar el filtro de productos manualmente al setear el valor inicial
      const id_codeCompany = Number(invoice.id_codeCompany);
      const code = codeCompany.find((code) => code.id === id_codeCompany);
      const id_provider = providers?.find((provider) => provider.id === code?.id_provider);
      const filtered = products?.filter((product) => product.id_provider === id_provider?.id) || [];
      
      setProductsFilter(filtered);
    }
  }, [invoice, isEdit, codeCompany, products, providers]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="m-4 flex flex-row justify-between w-full overflow-x-auto ">
          <div className="m-4 flex flex-row gap-4 w-full ">
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero de factura</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full md:max-w-sm"
                      placeholder="R2123121"  
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_codeCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo de la empresa</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                        <SelectTrigger className="w-full max-w-md">
                            <SelectValue placeholder="Seleccione el codigo de la empresa" />
                        </SelectTrigger>
                      <SelectContent>
                        {codeCompany.map((codeCompanyItem) => (
                            <SelectItem key={codeCompanyItem.id} value={codeCompanyItem.id.toString()}>
                              {codeCompanyItem.code} - {codeCompanyItem.company_name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de compra</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-svw"
                      type="date"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="is_cash_payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(val === "true")}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="max-w-xs">
                        <SelectValue placeholder="Contado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Contado</SelectItem>
                        <SelectItem value="false">Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            {form.getValues("is_cash_payment") === false ? (
              <FormField
                control={form.control}
                name="payment_due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de vencimiento</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full max-w-2xl"
                        type="date"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : null}
            </div>
          </div>
            <div className="m-4 self-end justify-end ">
              {isEdit ? (
                <Button className=" ml-auto " variant="destructive" type="submit" >Actualizar</Button>
              ) : <Button className=" ml-auto " variant="destructive" type="submit">Registrar compra</Button> }
              
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
