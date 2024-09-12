export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  SKU: string;
  stock: number;
  weight: number;
  Discounts?: Discount[];
  Categories: Category[];
  Options?: Option[];
  Images: Image[];
  getFinalPrice: () => Promise<number>;
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  subcategories?: Category[]; // Add this line

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
  options: Option[];
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

export interface CreditCard {
  id: number;
  name: string;
}


export interface Order {
  id: number;
  email: string;
  totalAmount: number;
  shippingAddress?: string;
  paymentFormat: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string; // Assuming it's returned as a string from the API
}


