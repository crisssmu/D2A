export interface ReceiveProductDto {
    id: number;
    created_at: string;
    name: string;
    isReturnable: boolean;
    unit_per_box: number;
    gross_price: number;
    id_provider: number;
    sales_price: number;
    id_tax: number;
    ico: number;
    tax: number;
    purchase_price: number;
    quantity: number;
    has_liquid: boolean;
    code_product: string;
}
