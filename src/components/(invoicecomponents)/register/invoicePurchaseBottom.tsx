import {
  ProductsFormData,
  purchaseInvoiceDetailFormData,
} from "@/types/formdata";
import { calculePurchasePrice, isRoundedMult } from "@/types/function";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface InvoicePucharseBottomProps {
  onSubmmit: (data: purchaseInvoiceDetailFormData) => void;
  listProducts: ProductsFormData[];
}

export default function InvoicePurchaseBottom({
  onSubmmit,
  listProducts,
}: InvoicePucharseBottomProps) {
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [diferencePrice, setDiferencePrice] = useState<number>(0);
  const [netPrice, setNetPrice] = useState<number>(0);
  const form = useForm<purchaseInvoiceDetailFormData>({
    defaultValues: {
      id: "",
      id_purchaseInvoice: 0,
      id_product: undefined,
      quantity: 0,
      sales_price: 0,
      gross_price: 0,
      ico: 0,
      tax: 0,
      value_discount: 0,
      purchase_price: 0,
      isUnit: false,
      setUnit: 0,
      nameProduct: ""
    },
  });
  
  const watchedIsUnit = useWatch({ control: form.control, name: "isUnit" });
  const watchedCost = useWatch({ control: form.control, name: "gross_price" });
  const watchedIco = useWatch({ control: form.control, name: "ico" });
  const watchedTax = useWatch({ control: form.control, name: "tax" });
  const watchedQuantity = useWatch({ control: form.control, name: "quantity" });
  const watchedIdProduct = useWatch({
    control: form.control,
    name: "id_product",
  });
  const watchedPriceSeller = useWatch({
    control: form.control,
    name: "sales_price",
  });
  const watchedValueDiscount = useWatch({
    control: form.control,
    name: "value_discount",
  });

  useEffect(() => {
    if (!watchedIdProduct) return;
    const selectedProduct = listProducts.find(
      (product) => product.id === watchedIdProduct
    );
    const setUnit = handleUnitChange() || 1;
    const sales_price = Number(selectedProduct?.sales_price ?? 0);
    const cost = Number(selectedProduct?.gross_price ?? 0);
    const ico = Number(selectedProduct?.ico ?? 0);
    const nameProduct = selectedProduct?.name ?? "";

    if (selectedProduct) {
      form.setValue("nameProduct", nameProduct);
      form.setValue("sales_price", isRoundedMult(sales_price, setUnit));
      form.setValue("gross_price", isRoundedMult(cost, setUnit));
      form.setValue("ico", isRoundedMult(ico, setUnit));
      form.setValue("tax", selectedProduct.tax);
    }
  }, [watchedIdProduct, listProducts, watchedIsUnit]);

  useEffect(() => {

    const purchase = calculePurchasePrice(watchedCost, watchedTax, watchedIco, watchedQuantity);
    const difference = watchedPriceSeller - purchase;
    const subtotal = isRoundedMult(watchedCost, watchedQuantity);
    const netPrice = (subtotal + subtotal * watchedTax + watchedIco * watchedQuantity) - watchedValueDiscount;

    form.setValue("tax_subtotal", subtotal * watchedTax);
    form.setValue("gross_subtotal", subtotal);
    form.setValue("purchase_price", isRoundedMult(purchase, 1));
    setNetPrice(isRoundedMult(netPrice, 1));
    setPurchasePrice(purchase);
    setDiferencePrice(difference);
  }, [
    watchedCost,
    watchedIco,
    watchedTax,
    watchedPriceSeller,
    watchedQuantity,
    watchedValueDiscount
  ]);

  const handleUnitChange = () => {
    const selectedProduct = listProducts.find(
      (product) => product.id === watchedIdProduct
    );
    if (!selectedProduct) return;

    const isUnit = form.getValues("isUnit");
    const unit = Number(selectedProduct.unit_per_box ?? 0);
    let setQuantity = 0;
    if (isUnit === false) {
      form.setValue("setUnit", unit);
      setQuantity = unit;
    } else {
      form.setValue("setUnit", 1);
      setQuantity = 1;
    }
    return setQuantity;
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmmit)}>
          <div className=" flex flex-row gap-4">
            <FormField
              control={form.control}
              name="id_product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                    }}
                    value={field.value?.toString() ?? ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {listProducts.map((prod) => (
                        <SelectItem key={prod.id} value={prod.id.toString()}>
                          {prod.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidades</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === "true");
                    }}
                    value={field.value ? "true" : "false"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Caja</SelectItem>
                      <SelectItem value="true">Unidad</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <Input
                    type="text"
                    {...field}
                    className="max-w-24"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sales_price"
              render={({ field }) => (
                <FormItem>
                  <Label>Precio Venta</Label>
                  <Input
                    type="text"
                    {...field}
                    className="max-w-24"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gross_price"
              render={({ field }) => (
                <FormItem>
                  <Label>Costo bruto</Label>
                  <Input
                    type="text"
                    {...field}
                    className="max-w-24"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ICO</FormLabel>
                  <Input
                    type="text"
                    {...field}
                    className="max-w-24"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IVA</FormLabel>
                  <Input
                    type="text"
                    {...field}
                    className="max-w-24"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento</FormLabel>
                  <Input
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormItem>
              )}
            />
            <Plus
              onClick={form.handleSubmit(onSubmmit)}
              className=" hover:cursor-pointer  hover:text-red-600 hover:bg-white shadow-md hover:border-white transition-colors duration-200 ease-in-out  bg-red-600 text-white border-red-600 border rounded-md self-end"
            />
          </div>
          <div className="flex flex-row gap-4 mt-4 justify-self-center">
            <FormField
              control={form.control}
              name="purchase_price"
              render={() => (
                <FormItem>
                  <FormLabel>Precio de compra</FormLabel>
                  <Input
                    type="text"
                    className="max-w-24"
                    placeholder="$ precio de compra"
                    readOnly
                    value={String(purchasePrice)}
                  />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Ganancia</FormLabel>
              <Input
                type="text"
                className="max-w-24"
                placeholder="$ ganancia"
                readOnly
                value={String(diferencePrice)}
              />
            </FormItem>
            <FormField
              control={form.control}
              name="net_price"
              render={() => (
                <FormItem>
                  <FormLabel>Precio neto</FormLabel>
                  <Input
                    type="text"
                    className="max-w-24"
                    placeholder="$ precio neto"
                    readOnly
                    value={String(netPrice)}
                  />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
