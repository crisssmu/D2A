"use client";

import RegisterProduct from "@/components/(productcomponents)/ProductRegister";
import { Loader } from "@/components/laoder/loader";
import { useToast } from "@/hooks/use-toast";
import { ProductsFormData } from "@/types/formdata";
import { isRoundedDivi } from "@/types/function";
import { useEffect, useState } from "react";

export default function ProductRegister() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductsFormData[] | null>(null);
  let newProducts = [];

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
  const handleRegisterProduct = async (values: ProductsFormData) => {
    try {
      setLoading(true);
      if (!values) return;

      const insertProduct = {
        name: values.name,
        code_product: values.code_product,
        isReturnable: values.isReturnable,
        unit_per_box: values.unit_per_box,
        quantity: values.quantity * values.unit_per_box,
        sales_price: isRoundedDivi(values.sales_price, values.unit_per_box),
        gross_price: isRoundedDivi(values.gross_price, values.unit_per_box),
        id_tax: values.id_tax,
        tax: values.tax,
        ico: isRoundedDivi(values.ico, values.unit_per_box),
        purchase_price: isRoundedDivi(
          values.purchase_price,
          values.unit_per_box
        ),
        id_provider: values.id_provider,
        has_liquid: values.has_liquid,
      };
      console.log("Insert Product: ", insertProduct);

      if (values.isReturnable && values.has_liquid) {
        const productExist = products?.find(
          (product) =>
            product.id_provider === values.id_provider &&
            Number(product.unit_per_box) === Number(values.unit_per_box) &&
            !product.has_liquid
        );

        if (
          productExist === undefined ||
          (productExist === null && values.isReturnable)
        ) {
          toast({
            title: "Error",
            description:
            "No existe un producto sin liquido. Por favor, cree primero el producto sin liquido.",
            variant: "destructive",
          });
          console.log("Producto: ", productExist);
          return;
        }
      }

      //Check if product without liquid exist
      if (!values.has_liquid && values.isReturnable) {
        const existingReturnableProduct = products?.find(
          (product) =>
            product.id_provider === values.id_provider &&
            product.unit_per_box === values.unit_per_box &&
            product.isReturnable === true &&
            product.has_liquid === false
        );

        if (existingReturnableProduct) {
          toast({
            title: "Error",
            description:
              "Ya existe el producto sin liquido con las mismas caracteristicas.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const insertPlasticProduct = {
          name: `Plastico ${values.name}`,
          isReturnable: true,
          unit_per_box: values.unit_per_box,
          quantity: values.quantity,
          sales_price: 0,
          gross_price: 0,
          id_tax: 1,
          tax: 0,
          ico: 0,
          purchase_price: 0,
          id_provider: values.id_provider,
          has_liquid: false,
          code_product: `PLAST-${values.code_product}`,
        };
        newProducts = [{...insertProduct, code_product: `BOT-${values.code_product}`}, insertPlasticProduct];
      } else {
        newProducts = [insertProduct];
      }

      for (const product of newProducts) {
        const valueTax = Number(values.id_tax) === 1 ? values.tax : 0;
        const res = await fetch("/api/products/cacheproduct/postcache", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...product, tax: valueTax }),
        });
        const data = await res.json();
        if (data.error || !res.ok) {
          throw new Error(data.message || res.statusText);
        }
        toast({
          title: "Producto creado",
          description: "Producto creado correctamente",
          variant: "default",
        });
        console.log("Product created successfully", data);
      }
    } catch (error) {
      console.log("Error al crear el Producto", error);
      toast({
        title: "Error al crear el Producto",
        description: "Error al crear el Producto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    <div className="flex justify-center items-center h-full">
      <RegisterProduct handleRegisterProduct={handleRegisterProduct} />
    </div>
  );
}
