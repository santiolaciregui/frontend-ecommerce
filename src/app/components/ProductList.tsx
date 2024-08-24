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
  searchParams: any;
};

const ProductList = ({ products, currentPage, hasPrev, hasNext, searchParams }: Props) => {

  // const sortProducts = (products: Product[]) => {
  //   let sorted = [...products];
  //   if (searchParams?.sort) {
  //     const [sortType, sortBy] = searchParams.sort.split(" ");
  //     if (sortBy === "price") {
  //       sorted = sorted.sort((a, b) => sortType === "asc" ? a.price!.price - b.price!.price : b.price!.price - a.price!.price);
  //     } else if (sortBy === "alphabetic") {
  //       sorted = sorted.sort((a, b) => sortType === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  //     } else if (sortBy === "best sellers") {
  //       sorted = sorted.sort((a, b) => (b.sales || 0) - (a.sales || 0));
  //     }
  //   }
  //   return sorted;
  // };

  // const sortedProducts = sortProducts(products);


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
