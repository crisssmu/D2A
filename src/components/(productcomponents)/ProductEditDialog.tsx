"use client"

import { ProductsFormData, ProviderFormData } from "@/types/formdata";
import { isRoundedMult } from "@/types/function";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ProductEditDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    product: ProductsFormData | null;
    onSubmmit: (data: ProductsFormData) => Promise<void>;
    providers: ProviderFormData[] | null;
}

export const ProductEditDialog = ({
    open,
    setOpen,
    product,
    onSubmmit,
    providers
}: ProductEditDialogProps) => {
    
    const [tax_value, setTax] = useState(0);
    const [idTax, setIdTax] = useState<number>(0);
    const [purchasePrice, setPurchasePrice] = useState<number>(0);

    
    const form = useForm<ProductsFormData>({
        defaultValues: {
            id: 0,
            name: "",
            isReturnable: true,
            unit_per_box: undefined,
            sales_price: undefined,
            gross_price: undefined,
            id_tax: undefined,
            tax: undefined,
            ico: undefined,
            id_provider: undefined,
            auxHasLiquid: undefined,
            code_product: "",
            has_liquid: false,
            quantity: 0,
            purchase_price: 0,
            auxIsReturnable: undefined,
            isUnit: undefined
        },
    })
    const auxHasLiquidWatch = form.watch("auxHasLiquid");
    let grossPriceWatch = useWatch({
        control: form.control,
        name: "gross_price",
    });
    let icoWatch = useWatch({
        control: form.control,
        name: "ico",
    });
    let taxWatch = useWatch({
        control: form.control,
        name: "tax",
    });
    let idTaxWatch = useWatch({
        control: form.control,
        name: "id_tax",
    });
    let auxIsReturnableWatch = useWatch({
        control: form.control,
        name: "auxIsReturnable",
    });
    
    useEffect(() => {
        if (idTax === 1) {
            setTax(0.19);
            form.setValue("tax", 0.19);
        } else {
            setTax(0);
            form.setValue("tax", 0);
        }
    }, [idTax]);

    useEffect(() => {
        if (product) {
            const unit = product.unit_per_box;
            console.log("Product data:", product);
            console.log("Product id:", product.id);
            form.setValue("id", product.id);
            form.setValue("code_product", product.code_product);
            form.setValue("name", product.name);
            form.setValue("isReturnable", product.isReturnable);
            form.setValue("unit_per_box", product.unit_per_box);
            form.setValue("sales_price", isRoundedMult(product.sales_price, unit));
            form.setValue("gross_price", isRoundedMult(product.gross_price, unit));
            form.setValue("id_tax", product.id_tax);
            form.setValue("tax", product.tax);
            form.setValue("ico", isRoundedMult(product.ico, unit));
            form.setValue("has_liquid", product.has_liquid);
            form.setValue("id_provider", product.id_provider);
            form.setValue("auxHasLiquid", product.has_liquid.toString());
            form.setValue("auxIsReturnable", product.isReturnable.toString());
            form.setValue("quantity", product.code_product.startsWith("PLAST-") ? product.quantity : product.quantity / unit);
            form.setValue("purchase_price", isRoundedMult(product.purchase_price, unit));
            setPurchasePrice(isRoundedMult(product.purchase_price, unit));
            setIdTax(product.id_tax);
            setTax(product.tax);
        }
    }, [product, open]);

    useEffect(() => {
        const tax_value: number = idTaxWatch === 1 ? taxWatch : 0;
        setTax(tax_value);
        const purchase_price = isRoundedMult(Number(grossPriceWatch) + Number(icoWatch) + (Number(grossPriceWatch) * tax_value), 1);
        setPurchasePrice(purchase_price);
        form.setValue("purchase_price", purchase_price);
    }, [grossPriceWatch, icoWatch, taxWatch, idTaxWatch]);

    useEffect(() => {
        if (auxHasLiquidWatch === "false") {
            form.setValue("auxIsReturnable", "true");
            form.setValue("has_liquid", false);
        } else {
            form.setValue("has_liquid", true);
        }  

    }, [auxHasLiquidWatch]);

    useEffect(() => {
        if(auxIsReturnableWatch === "true") {
            form.setValue("isReturnable", true);
        } else {
            form.setValue("isReturnable", false);
        }
    }, [auxIsReturnableWatch]);

    const onClose = () => {
        setOpen(false);
    }

    return (
        <Dialog open={open && product !== null} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md space-y-4">
                <DialogHeader className="flex flex-col gap-2 text-center sm:text-left">
                    <DialogTitle>Editar Producto</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-4 w-full"
                        onSubmit={form.handleSubmit((data) => onSubmmit(data))}
                    >

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
                            {providers!.map((provider) => (
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
                  name="auxIsReturnable"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-1/3">
                      <FormLabel className="">Categoria</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={field.onChange}
                          disabled={ auxHasLiquidWatch === "false" }
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

              <div className="flex flex-row gap-4 p-2">
                
                <FormField
                  control={form.control}
                  name="unit_per_box"
                  render={({ field }) => (
                    <FormItem className="w-full">
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
                    <FormItem className="w-full">
                      <FormLabel className="">Cantidad</FormLabel>
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
                          value={purchasePrice}
                          
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
                          value={String(tax_value)}
                          onChange={(e) => {
                            const parsed = Number(e.target.value);
                            setTax(parsed);
                            form.setValue("tax", parsed);
                          }}
                          disabled={Number(form.watch("id_tax")) !== 1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                       <div className="flex justify-center items-center gap-4">
                            <Button type="submit">Guardar</Button>
                            <Button type="button" onClick={onClose}>Cancelar</Button>
                        </div>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}