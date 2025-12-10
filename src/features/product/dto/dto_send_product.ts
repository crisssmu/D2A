export interface SendProductDto {
    name: string;
    code_product: string;
    unit_per_box: number;
    quantity: number;
    sales_price: number;
    gross_price: number;
    id_tax: number;
    tax: number;
    ico: number;
    purchase_price: number;
    id_provider: number;
    has_liquid: boolean;
}

