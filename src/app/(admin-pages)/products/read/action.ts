
import { createClient } from "@supabase/supabase-js";
import { revalidateTag, unstable_cache } from "next/cache";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROL!
);

export default async function fetchProducts() {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("fetchProducts error:", err);
    return [];
  }
}


export const getCachedProducts = unstable_cache(fetchProducts, ["products-cache"], {
  revalidate: 3600, 
  tags: ["products"]
});

export async function revalidateProductsCache(){
    revalidateTag("products");
}