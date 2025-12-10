"use client";

import InvoicePurchase from "@/components/(invoicecomponents)/register/invoicePurchase";
import InvoicePurchaseBottom from "@/components/(invoicecomponents)/register/invoicePurchaseBottom";
import InvoicePurchaseTop from "@/components/(invoicecomponents)/register/invoicePurchaseTop";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  MovementsFormData,
  ProductsFormData,
  ProviderFormData,
  purchaseInvoiceDetailFormData,
  purchaseInvoiceFormData,
} from "@/types/formdata";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

import { ProductsEmpty } from "@/components/(invoicecomponents)/register/ProductsEmpty";
import MovementsRegister from "@/components/(movementscomponents)/movements/MovementsRegister";
import MovementsTable from "@/components/(movementscomponents)/movements/MovementsTable";
import TypeOfMovementsRegister from "@/components/(movementscomponents)/typeofmovements/TypeOfMovementsRegister";
import { Button } from "@/components/ui/button";
import { isRoundedDivi } from "@/types/function";
import { useEffect, useState } from "react";

export default function InvoicePurchaseRegister() {
  const { toast } = useToast();
  const [productFilter, setProductFilter] = useState<ProductsFormData[]>([]);
  const [listDetail, setListDetail] = useState<purchaseInvoiceDetailFormData[]>(
    []
  );
  const [products, setProducts] = useState<ProductsFormData[] | null>(null);
  const [invoice, setInvoice] = useState<purchaseInvoiceFormData | undefined>(
    undefined
  );
  const [proWithoutLiquid, setProWithoutLiquid] = useState<ProductsFormData[]>([]);

  const [openRegisterMov, setOpenRegisterMov] = useState<boolean>(false);
  const [openMovements, setOpenMovements] = useState<boolean>(false);
  const [provider, setProvider] = useState<ProviderFormData[] | null>(null);
  const [openTypeMovements, setOpenTypeMovements] = useState<boolean>(false);
  const [movements, setMovements] = useState<MovementsFormData[]>([]);

  const supabase = createClient();

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

  async function createInvoice(invoice: purchaseInvoiceFormData) {
    try {
      let userCookies = null;
      const res = await fetch("/api/user/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      userCookies = data.user.id;
      console.log("User Cookies in createInvoice:", userCookies);
      const totalAmount = listDetail.reduce(
        (acc, detail) => acc + (detail.tax_subtotal! + detail.gross_subtotal!),
        0
      );
      console.log("Total amount:", totalAmount);
      const newInvoice = {
        id: invoice.id,
        id_codeCompany: invoice.id_codeCompany,
        reference: invoice.reference,
        date: invoice.date,
        payment_due_date: invoice.payment_due_date,
        id_seller: userCookies,
        total: totalAmount,
      };
      if (userCookies == null) {
        throw new Error("User not found in cookies");
      }
      const cleanInvoice = {
        ...newInvoice,
        date: newInvoice.date || null,
        payment_due_date: newInvoice.payment_due_date || null,
      };
      setInvoice(newInvoice);
      const { data: dataPurcharse, error } = await supabase
        .from("purchase_invoice")
        .insert(cleanInvoice)
        .select()
        .single();
      if (error) throw error;

      toast({
        title: "Factura creada con exito",
      });
      return dataPurcharse.id;
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "Error al crear la factura",
        variant: "destructive",
      });
      return null;
    }
  }

  const addProductsEmpty = (detail: purchaseInvoiceDetailFormData) => {
    const product = products?.find((product) => product.id === detail.id_product);

    if(product?.isReturnable  && product?.has_liquid){
      const productEmpty = products?.find((pro) => 
        pro.id_provider === product.id_provider &&
        pro.unit_per_box === product.unit_per_box &&
        !pro.has_liquid && pro.code_product?.startsWith("BOT-")
      );
      const productPlast = products?.find((pro) => 
        pro.id_provider === product.id_provider &&
        pro.unit_per_box === product.unit_per_box &&
        !pro.has_liquid && pro.code_product?.startsWith("PLAST-")
      );
      if(!productEmpty && !productPlast) return;
      console.log("Product Empty Found: ", productEmpty);    
      console.log("Product Plast Found: ", productPlast);
      productEmpty!.quantity = detail.quantity;
      productPlast!.quantity = isRoundedDivi(detail.quantity, product.unit_per_box);
      const prodExist = proWithoutLiquid.find((p) => p.id === productEmpty?.id);
      const plastExist = proWithoutLiquid.find((p) => p.id === productPlast?.id);

      if(prodExist && plastExist){ setProWithoutLiquid((prev) => prev.map(p => 
        p.id === productEmpty?.id ? { ...p, quantity: p.quantity + detail.quantity } : 
        p.id === productPlast?.id ? { ...p, quantity: p.quantity + isRoundedDivi(detail.quantity, product.unit_per_box) } : p
      ));
      } else {
        setProWithoutLiquid((prev) => [
          ...prev,
          productPlast!, productEmpty!
        ]);
      }
      
    }
  }

  const addDetail = (detail: purchaseInvoiceDetailFormData) => {
    const newDetail = {
      ...detail,
      quantity: detail.quantity * detail.setUnit!,
      purchase_price: isRoundedDivi(detail.purchase_price, detail.setUnit!),
      gross_price: isRoundedDivi(detail.gross_price, detail.setUnit!),
      ico: isRoundedDivi(detail.ico, detail.setUnit!),
      value_discount: isRoundedDivi(detail.value_discount, detail.setUnit!),
      tax_subtotal: detail.tax_subtotal!,
      gross_subtotal: detail.tax_subtotal!,
      ico_subtotal: detail.ico_subtotal!,
      id: uuidv4(),
    };
    
    addProductsEmpty(newDetail);

    setListDetail((prev) => {
      return [...prev, newDetail];
    });

    toast({
      title: "Detalle agregado correctamente",
      variant: "default",
    });
  };

  const addMovements = (movement: MovementsFormData) => {
    const newMovement = {
      ...movement,
      id: uuidv4(),
    };
    setMovements((prev) => {
      return [...prev, newMovement];
    });
    toast({ title: "Movimiento agregado correctamente", variant: "default" });
  };

  useEffect(() => {
    console.log("InvoiceDetail: ", listDetail);
  }, [listDetail]);

  const handleCreateInvoice = async (invoiceData: purchaseInvoiceFormData) => {
    try {
      //Creation of the invoice
      const id_invoice = await createInvoice(invoiceData);
      if (!id_invoice || !listDetail.length) return;

      const detailsToInsert = listDetail.map((detail) => {
        return {
          id: detail.id,
          id_product: detail.id_product,
          quantity: detail.quantity,
          purchase_price: detail.purchase_price.toFixed(2),
          gross_price: detail.gross_price.toFixed(2),
          net_price: detail.net_price.toFixed(2),
          ico: detail.ico.toFixed(2),
          tax: detail.tax,
          id_purchaseInvoice: id_invoice,
        };
      });

      //Creation of the invoice details
      const { error } = await supabase
        .from("purchase_invoice_detail")
        .insert(detailsToInsert);
      if (error) throw error;

      //Add in the stock the products
      const dataStockInsert = listDetail.map((detail) => {
        return {
          id_purchase_invoice_detail: detail.id,
          id_product: detail.id_product,
          quantity: detail.quantity,
        };
      });
      const { error: stockError } = await supabase.from("stock").insert(
        listDetail.map((detail) => {
          dataStockInsert;
        })
      );
      if (stockError) throw stockError;

      //Check if the product data is updated
      const updatedProductData = productFilter.map((product) => {
        const detail = listDetail.find(
          (detail) => detail.id_product === product.id
        );
        if (detail) {
          return {
            ...product,
            quantity: detail.quantity * detail.setUnit!,
            gross_price: detail.gross_price,
            ico: detail.ico,
            purchase_price: detail.purchase_price,
            sales_price: detail.sales_price,
          };
        }
        return product;
      });

      const isUpdated = productFilter.some((product, index) => {
        return (
          product.quantity !== updatedProductData[index].quantity ||
          product.gross_price !== updatedProductData[index].gross_price ||
          product.purchase_price !== updatedProductData[index].purchase_price ||
          product.ico !== updatedProductData[index].ico ||
          product.sales_price !== updatedProductData[index].sales_price
        );
      });

      //Modify the product data to reflect the most recently created data.
      if (isUpdated) {
        const { error: updateError } = await supabase
          .from("product")
          .upsert(updatedProductData);
        if (updateError) throw updateError;
      }

      setListDetail([]);
      setInvoice(undefined);

      toast({
        title: "Factura creada con exito",
      });
      console.log("Invoice and details created successfully", invoice);
    } catch (error) {
      console.error("Error creating invoice and details:", error);
      toast({
        title: "Error",
        description: "Hubo un error al crear la factura",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full w-full justify-center items-center ">
      <Card className="w-full   overflow-hidden ">
        <CardHeader className=" ">
          <InvoicePurchaseTop
            handleSubmit={handleCreateInvoice}
            setProductsFilter={setProductFilter}
            products={products}
            set_Provider={setProvider}
          />
        </CardHeader>

        <CardContent>
          <InvoicePurchase
            detailsData={listDetail}
            products={productFilter}
            onDetailChange={setListDetail}
          />
          <div className="flex flex-row gap-4 p-2">
            <Button type="button" onClick={() => setOpenRegisterMov(true)}>
              Agregar Movimiento
            </Button>

            {movements.length > 0 && (
              <div>
                <Button
                  variant={"default"}
                  onClick={() => setOpenMovements(true)}
                >
                  Movimientos
                </Button>
                <MovementsTable
                  detailsMovements={movements}
                  products={productFilter}
                  openMovements={openMovements}
                  setOpenMovements={setOpenMovements}
                />
              </div>
            )}
          </div>
          {openRegisterMov && (
            <MovementsRegister
              open={openRegisterMov}
              setOpen={setOpenRegisterMov}
              products={productFilter}
              providers={provider || []}
              handleSubmit={addMovements}
            />
          )}
          {openTypeMovements && (
            <TypeOfMovementsRegister
              open={openTypeMovements}
              setOpen={setOpenTypeMovements}
            />
          )}
        </CardContent>

        <CardFooter>
          <div className="flex items-stretch justify-between w-full">
            <div>
              <InvoicePurchaseBottom
                onSubmmit={addDetail}
                listProducts={productFilter}
              />
            </div>
            <div className="self-start justify-items-start">
              <ProductsEmpty productsWithoutLiquid={proWithoutLiquid} onChangeProductsQuantity={listDetail} />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
