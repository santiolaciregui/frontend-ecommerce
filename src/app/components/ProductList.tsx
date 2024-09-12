'use client';

import Pagination from "./Pagination";
import { Product } from "../context/types";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";

type Props = {
  products: Product[];
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
};

const ProductList = ({ products, currentPage, hasPrev, hasNext }: Props) => {

  return (
    <div className='mt-12 flex gap-x-8 gap-y-8 justify-start flex-wrap'>
      {products.map((product) => (
        <ProductCard product={product} key={product.id}/>
      ))}
      <Pagination 
        currentPage={currentPage} 
        hasPrev={hasPrev} 
        hasNext={hasNext}
      />
    </div>
  );
};

export default ProductList;
