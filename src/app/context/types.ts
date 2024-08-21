export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  SKU: string;
  stock: number;
  weight: number;
  discountId?: number;
  Categories: Category[];
  Options?: Option[];
  images: Image[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Option {
  id: number;
  type: number;
  name: string;
}

export interface Image {
  id: number;
  url: string;
}

export interface CartItem {
  product: Product;
  variantId: string;
  quantity: number;
}

export interface Discount {
  id: number;
  name: string;
  description: string;
  percentage: number;
  active: boolean;
}

export interface Promotion {
  id: number;
  name: string;
  credit_card_id: number;
  installments: number;
  start_date: string;
  end_date: string;
}

