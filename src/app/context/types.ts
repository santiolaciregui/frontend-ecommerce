export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  SKU: string;
  stock: number;
  weight: number;
  Discounts?: Discount[];
  Promotions?: Promotion[];
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
  colorCode: string;
}

export interface Image {
  id: number;
  url: string;
}
export interface Cart {
  id: number;
  totalAmount: number;
  CartItems: CartItem[];
}
export interface CartItem {
  id: number;
  Product: Product;
  Options: Option[];
  quantity: number;
  image: string;
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
  installments: number
}


export interface Order {
  id: number;
  email?: string;
  client: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
  };
  OrderItems: OrderItem[];
  totalAmount: number;
  shippingAddress?: string;
  paymentFormat: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string; // Assuming it's returned as a string from the API
}

export interface OrderItem {
  id: number;
  Product: Product;
  quantity: number;
  totalPrice: number;
}


export interface Store {
  id?: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface CardProvider {
  id: number;
  name: string;
}

export interface Bank {
  id: string;
  name: string;
  providerId: string;
}

export interface InstallmentOption {
  id: string;
  numberOfInstallments: number;
  interestRate: number;
  totalInterestRate: number;
  bankId: string;
}

export interface ContactInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface DeliveryOption {
  option: string; // Restrict the options to 'delivery' or 'pickup'
  address?: string;              // Address is optional when 'pickup' is selected
  city?: string;
  province?: string;
  zip?: string;
  storeId?: number;              // Use storeId for pickup
}


export interface FormData {
  contactInfo: ContactInfo;
  deliveryOption: DeliveryOption;
  paymentFormat: string;
  paymentDetails?: {
    provider?: CardProvider;
    bank?: Bank;
    installments?: InstallmentOption;
  };
  paymentInstallments: InstallmentOption | null; // Add proper type instead of 'any'
}


export interface Client {
  email: string | '';
  phone: string | '';
}

export interface OrdersDetails {
  id: number;
  orderNumber: string;
  email: string | null;
  totalAmount: number;
  shippingAddress: string | null;
  paymentFormat: string;
  createdAt: string;
  OrderItems: OrderItem[];
  client?: Client;
}

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  options: any[];
  createdAt: string;
  updatedAt: string;
  orderId: number;
  productId: number;
  Product: Product;
} 