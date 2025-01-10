export const DELIVERY_OPTIONS = {
    DELIVERY: 'delivery',
    PICKUP: 'pickup',
  };
  
  export const PAYMENT_FORMATS = {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card', 
    CASH: 'cash',
    TRANSFER: 'transfer',
    PERSONAL_CREDIT: 'personal_credit',
  } as const;
  
  export const DEFAULT_SHIPPING_COST = 30000;
  