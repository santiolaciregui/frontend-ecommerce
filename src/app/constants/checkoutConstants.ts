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

  export const PAYMENT_FORMATS_ES = {
    CUOTAS_3: '3 Cuotas',
    CUOTAS_6: '6 Cuotas',
    DEBIT_CARD: 'Débito', 
    CASH: 'Efectivo',
    TRANSFER: 'Transferencia',
    PERSONAL_CREDIT: 'Credito Personal',
  } as const;
  
  export const DEFAULT_SHIPPING_COST = 30000;
  