"use client";

import { ProductEditDialog } from "@/components/(productcomponents)/ProductEditDialog";
import { ProductsTable } from "@/components/(productcomponents)/ProductTable";
import { Loader } from "@/components/laoder/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ProductsFormData, ProviderFormData } from "@/types/formdata";
import { isRoundedDivi } from "@/types/function";
import { createClient } from "@/utils/supabase/client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProductRead() {
  const [products, setProducts] = useState<ProductsFormData[]>([]);
  const [searchProducts, setSearchProducts] = useState<ProductsFormData[]>([]);
  const [search, setSearch] = useState("");
  const [providers, setProviders] = useState<ProviderFormData[] | null>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const supabase = createClient();
  const [selectedProduct, setSelectedProduct] =
    useState<ProductsFormData | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products/cacheproduct/getcache");
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      console.log(data);

      const productsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : [];

      setProducts(productsArray);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Hubo un error al encontrar los productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (product: ProductsFormData) => {
    if (!product) return;
    setLoading(true);
    try {
      const costUnit = isRoundedDivi(product.gross_price, product.unit_per_box);
      const salesUnit = isRoundedDivi(
        product.sales_price,
        product.unit_per_box
      );
      const icoUnit = isRoundedDivi(product.ico, product.unit_per_box);

      const newProduct = {
        id: product.id,
        name: product.name,
        code_product: product.code_product,
        gross_price: costUnit,
        sales_price: salesUnit,
        ico: icoUnit,
        isReturnable: product.isReturnable,
        unit_per_box: product.unit_per_box,
        quantity: product.code_product.startsWith("PLAST-") ? product.quantity : product.quantity * product.unit_per_box,
        id_tax: product.id_tax,
        tax: product.tax,
        purchase_price: isRoundedDivi(
          product.purchase_price, product.unit_per_box
        ),
        id_provider: product.id_provider,
        has_liquid: product.has_liquid,
      };
      const res = await fetch("/api/products/cacheproduct/update", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, ...newProduct } : p))
      );

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      console.log("Respuesta del servidor: ", data);

      toast({
        title: "Actualizado con exito",
        description: "Los datos del producto ha sido actualizado con exito",
      });

      console.log(product);
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar el producto",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
      setSelectedProduct(null);
    }
  };

  const fetchProviders = async () => {
    const res = await fetch("/api/provider/getCache");
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const providersArray = Array.isArray(data)
      ? data
      : Array.isArray(data?.providers)
      ? data.providers
      : [];
    setProviders(providersArray);
  };

  useEffect(() => {
    setSearchProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  useEffect(() => {
    fetchProducts();
    fetchProviders();
  }, []);

  const handleCloseDialog = (value: boolean) => {
    setOpen(value);
    if (!value) setSelectedProduct(null);
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
      <div className="flex w-full h-full justify-center items-center p-4">
        <Card className="flex items-center w-screen h-full flex-col p-4 gap-5">
          <CardHeader className="w-full items-start justify-center">
            <CardTitle>Productos</CardTitle>
            <div className="relative w-full flex flex-row gap-2 items-center justify-center p-2 ">
              <Search className="absolute left-4" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border w-md"
                placeholder="Buscar"
              />
            </div>
          </CardHeader>
          <CardContent className="w-full h-full">
            <ProductsTable
              products={searchProducts}
              providers={providers}
              onSelectProduct={setSelectedProduct}
              onOpenDialog={setOpen}
            />
          </CardContent>
        </Card>
      </div>
      <ProductEditDialog
        open={open}
        setOpen={handleCloseDialog}
        product={selectedProduct}
        onSubmmit={handleUpdate}
        providers={providers}
      />
    </>
  );
}
