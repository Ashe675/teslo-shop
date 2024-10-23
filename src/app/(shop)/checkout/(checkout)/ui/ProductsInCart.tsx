"use client";

import { ProductImage } from "@/components";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useState, useEffect } from "react";

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className=" flex mb-5">
          <ProductImage
            src={product.image}
            width={100}
            height={100}
            alt={product.title}
            style={{
              width: "100px",
              height: "100px",
            }}
            className=" mr-5 rounded"
          />

          <div>
            <span>
              {product.size} - {product.title} ({product.quantity})
            </span>
            <p className=" font-bold">
              {currencyFormat(product.price * product.quantity)}
            </p>
      
           
          </div>
        </div>
      ))}
    </>
  );
};
