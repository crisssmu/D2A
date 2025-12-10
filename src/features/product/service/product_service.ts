import { createClient } from "@/utils/supabase/server";
import { SendProductDto } from "../dto/dto_send_product";
import { ReceiveProductDto } from "../dto/dto_receive_product";

export class ProductService {
  /**
   * Obtiene todos los productos de la base de datos
   * @returns Array de productos o array vacío si hay error
   */
  async getProducts(): Promise<ReceiveProductDto[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener productos:", error);
        throw new Error(error.message || "Error al obtener productos");
      }

      return (data as ReceiveProductDto[]) || [];
    } catch (err: any) {
      console.error("ProductService.getProducts error:", err);
      throw err;
    }
  }

  /**
   * Crea un nuevo producto en la base de datos
   * @param product - Datos del producto a crear
   * @returns Producto creado
   */
  async createProduct(product: SendProductDto): Promise<ReceiveProductDto> {
    try {
      const supabase = await createClient();

      // Validar que el producto sea un objeto válido
      if (typeof product !== "object" || Array.isArray(product)) {
        throw new Error("Formato inválido: se esperaba un objeto");
      }

      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

      if (error || !data) {
        console.error("Supabase error:", error);
        throw new Error(error?.message || "Error insertando producto");
      }

      return data as ReceiveProductDto;
    } catch (err: any) {
      console.error("ProductService.createProduct error:", err);
      throw err;
    }
  }
}

