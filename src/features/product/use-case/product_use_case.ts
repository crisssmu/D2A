import { ProductService } from "../service/product_service";
import { SendProductDto } from "../dto/dto_send_product";
import { ReceiveProductDto } from "../dto/dto_receive_product";

export class ProductUseCase {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Obtiene todos los productos
   * @returns Array de productos
   */
  async getProducts(): Promise<ReceiveProductDto[]> {
    try {
      return await this.productService.getProducts();
    } catch (error: any) {
      console.error("ProductUseCase.getProducts error:", error);
      throw new Error(error.message || "Error al obtener productos");
    }
  }

  /**
   * Crea un nuevo producto
   * @param product - Datos del producto a crear
   * @returns Producto creado
   */
  async createProduct(product: SendProductDto): Promise<ReceiveProductDto> {
    try {
      // Validaciones adicionales de negocio pueden ir aquí
      if (!product.name || product.name.trim() === "") {
        throw new Error("El nombre del producto es requerido");
      }

      if (!product.code_product || product.code_product.trim() === "") {
        throw new Error("El código del producto es requerido");
      }

      if (product.unit_per_box <= 0) {
        throw new Error("Las unidades por caja deben ser mayor a 0");
      }

      if (product.purchase_price < 0) {
        throw new Error("El precio de compra no puede ser negativo");
      }

      if (product.sales_price < 0) {
        throw new Error("El precio de venta no puede ser negativo");
      }

      return await this.productService.createProduct(product);
    } catch (error: any) {
      console.error("ProductUseCase.createProduct error:", error);
      throw error;
    }
  }
}

