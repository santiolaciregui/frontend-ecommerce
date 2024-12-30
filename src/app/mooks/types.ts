import { Product } from "../context/types";

export const emptyProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    finalPrice: 0,
    SKU: '',
    stock: 0,
    weight: 0,
    Discounts: [],
    Promotions: [],
    Categories: [],
    Options: [],
    Images: [],
    getFinalPrice: async () => 0, // Retorna 0 como predeterminado
  };
  