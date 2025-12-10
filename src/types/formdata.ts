export type LoginFormData = {
  email: string;
  password: string;
};

export interface UserFormData {
  id: string;
  document: string;
  phone_number: string;
  birth_date: string;
  name: string;
  last_name: string;
  email: string;
  address: string;
  password: string;
}

export interface RegisterFormData {
  document: string;
  phone_number: string;
  birth_date: string;
  name: string;
  last_name: string;
  email: string;
  address: string;
  password: string;
  confirm_password: string;
}

export interface ProductsFormData {
  id: number;
  name: string;
  isReturnable: boolean;
  unit_per_box: number;
  quantity: number;
  sales_price: number;
  purchase_price: number;
  gross_price: number;
  id_tax: number;
  tax: number;
  ico: number;
  id_provider: number;
  has_liquid: boolean;
  code_product: string;
  isUnit?: boolean;
  auxHasLiquid?: string
  auxIsReturnable?: string
}

export interface ProviderFormData {
  id: number;
  document: number;
  name: string;
  email: string;
  phone_number: number;
}

export interface codeCompanyFormData {
  id: number;
  company_name: string;
  code: string;
  document: string; // or nit
  name: string;
  lastname: string; //optiona
  email: string;
  phone_number: string;
  id_provider: number;
  address: string;
}

export interface purchaseInvoiceFormData {
  id: number;
  id_codeCompany: number;
  reference: string;
  date: string;
  total: number;
  id_seller: string;
  is_cash_payment?: boolean;
  payment_due_date: string;
}

export interface purchaseInvoiceDetailFormData {
  id: string;
  id_purchaseInvoice: number;
  id_product: number;
  quantity: number;
  ico: number;
  tax: number;
  gross_price: number; 
  net_price: number; 
  sales_price: number;
  purchase_price: number; 
  value_discount: number;
  gross_subtotal?: number;
  tax_subtotal?: number;
  ico_subtotal?: number;
  isUnit?: boolean;
  setUnit?: number;
  nameProduct?: string;
}

export interface typeOfMovementFormData {
  id: number;
  name: string;
  gross_price: number;
}

export interface MovementsFormData {
  id: string;
  id_product: number;
  id_type_of_movement: number;
  gross_price: number;
  quantity: number;
  date: string;
  due_date: string;
  id_seller: string;
  id_source: string;
  type_invoices: boolean;
  id_invoices: number;
  type_source: boolean;
  note: string;
  nameProduct?: string;
}