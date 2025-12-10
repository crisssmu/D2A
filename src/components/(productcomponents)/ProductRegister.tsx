"use client";
import { ProductsFormData } from "@/types/formdata";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { isRoundedDivi } from "@/types/function";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface productRegisterProps {
  handleRegisterProduct: (data: ProductsFormData) => void;
}

export default function ProductCreateForm({
  handleRegisterProduct,
}: productRegisterProps) {
  const [tax_value, setTax] = useState("");
  const [providers, setProviders] = useState<{ id: string; name: string }[]>(
    []
  );
  const supabase = createClient();
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [differencePrice, setDiferencePrice] = useState<number>(0);

  const form = useForm<any>({
    defaultValues: {
      name: "",
      aux_isReturnable: undefined,
      code_product: undefined,
      isReturnable: undefined,
      unit_per_box: undefined,
      quantity: undefined,
      sales_price: 0,
      gross_price: 0,
      id_tax: 1,
      tax: 0.19,
      ico: 0,
      purchase_price: 0,
      id_provider: undefined,
      has_liquid: undefined,
      isUnit: undefined,
      auxHasLiquid: undefined
    },
  });
  let watchedCost = useWatch({ control: form.control, name: "gross_price" });
  let watchedIco = useWatch({ control: form.control, name: "ico" });
  let watchedIdTax = useWatch({ control: form.control, name: "id_tax" });
  let watchedTax = useWatch({ control: form.control, name: "tax" });
  let watchedSalesPrice = useWatch({
    control: form.control,
    name: "sales_price",
  });
  let watchedEmpty = useWatch({ control: form.control, name: "auxHasLiquid" });
  let watchedReturnable = useWatch({ control: form.control, name: "aux_isReturnable" });
  

  useEffect(() => {
    const cost = Number(watchedCost) || 0;
    const ico = Number(watchedIco) || 0;
    const tax = Number(watchedTax) || 0;
    const idTax = Number(watchedIdTax) || 1;
    const salePrice = Number(watchedSalesPrice) || 0;

    const taxToApply = idTax === 1 ? tax : 0;
    const purchasePrice = cost + cost * taxToApply + ico;
    const differencePrice = salePrice - purchasePrice;
    setPurchasePrice(isRoundedDivi(purchasePrice, 1));
    setDiferencePrice(isRoundedDivi(differencePrice, 1));
    form.setValue("purchase_price", isRoundedDivi(purchasePrice, 1));
  }, [watchedCost, watchedIco, watchedTax, watchedIdTax, watchedSalesPrice]);

  useEffect(() => {
    const fetchProviders = async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("id, name");

      if (!error && data) {
        setProviders(data);
      }
    };
    fetchProviders();
  }, []);

  
  useEffect(() => {
    if (watchedReturnable === "true") {
      form.setValue("isReturnable", true);
    } else if (watchedReturnable === "false") {
      form.setValue("isReturnable", false);
    } else {
      form.setValue("isReturnable", undefined);
    }

    console.log("Retornable: ", form.getValues("isReturnable"));
  }, [watchedReturnable]);

 useEffect(() => {
    if(watchedEmpty === "true") {
      form.setValue("has_liquid", true);
    } else if (watchedEmpty === "false") {
      form.setValue("has_liquid", false);
      form.setValue("aux_isReturnable", "true");
    } else {
      form.setValue("has_liquid", undefined);
    }

    console.log("Con liquido: ", form.getValues("has_liquid"));
  }, [watchedEmpty]);


  useEffect(() => {
    const idTax = form.watch("id_tax");
    if (Number(idTax) === 1) {
      setTax("0.19");
    } else {
      setTax("0");
    }
  }, [form.watch("id_tax")]);

  return (
    <Card className="w-full max-w-lg  p-4 m-4">
      <CardHeader className="p-2">
        <CardTitle>Producto</CardTitle>
        <CardDescription>Registrar Producto</CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <div>
          <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(handleRegisterProduct)}>
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full p-2">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Aguila 330 ml"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="code_product"
                  render={({ field }) => (
                    <FormItem className="w-full p-2">
                      <FormLabel>Codigo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="3128"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row justify-between p-2">
                <FormField
                  control={form.control}
                  name="id_provider"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/3">
                      <FormLabel>Proveedor</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Proveedor" />
                          </SelectTrigger>
                          <SelectContent>
                            {providers.map((provider) => (
                              <SelectItem
                                key={provider.id}
                                value={String(provider.id)}
                              >
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="auxHasLiquid"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/4">
                      <FormLabel className="">Con liquido</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Si" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Si</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aux_isReturnable"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/3">
                      <FormLabel className="">Categoria</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={field.onChange}
                          disabled={watchedEmpty === "false" }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Retornable" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Retornable</SelectItem>
                            <SelectItem value="false">No retornable</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row justify-between p-2">
                <FormField
                  control={form.control}
                  name="isUnit"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/3 mt-4">
                      <FormLabel className="">Presentacion</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Caja" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FALSE">Caja</SelectItem>
                            <SelectItem value="TRUE">Unidad</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit_per_box"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/4">
                      <FormLabel className="">Unidades por caja</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full "
                          placeholder="1"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/3">
                      <FormLabel className="mt-4">Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full "
                          placeholder="30"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-4 p-2">
                <FormField
                  control={form.control}
                  name="gross_price"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/2">
                      <FormLabel>Costo bruto</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Costo"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="ico"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/2">
                      <FormLabel>ICO</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="4000"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchase_price"
                  render={() => (
                    <FormItem className="w-full max-w-1/2">
                      <FormLabel>Precio compra</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          type="text"
                          value={String(purchasePrice)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

                  <div className="flex flex-row gap-4 p-2">
                    <FormField
                  control={form.control}
                  name="sales_price"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/2">
                      <FormLabel className="">Precio Venta</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Precio venta"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id_tax"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/2">
                      <FormLabel>IVA</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={field.onChange}
                          defaultValue="1"
                        >
                          <SelectTrigger className="w-full ">
                            <SelectValue placeholder="IMPUESTO" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">GRAVADO</SelectItem>
                            <SelectItem value="2">EXCLUIDO</SelectItem>
                            <SelectItem value="3">EXCENTO</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tax"
                  render={() => (
                    <FormItem className="w-full max-w-1/2">
                      <FormLabel>Valor impuesto</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="0,19"
                          type="text"
                          value={tax_value}
                          onChange={(e) => setTax(e.target.value)}
                          disabled={Number(form.watch("id_tax")) !== 1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Label>Diferencia: {String(differencePrice)}</Label>
              
              <div className="flex justify-center items-center">
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
