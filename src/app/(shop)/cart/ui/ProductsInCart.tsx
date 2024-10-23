"use client";

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Link from "next/link";
import { useState, useEffect } from "react";

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const removeProduct = useCartStore((state) => state.removeProduct);
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
            <Link
              className=" hover:underline cursor-pointer"
              href={`/product/${product.slug}`}
            >
              {product.size} - {product.title}
            </Link>
            <p>${product.price}</p>
            <QuantitySelector
              onQuantityChanged={(quantity) =>
                updateProductQuantity(product, quantity)
              }
              quantity={product.quantity}
            />
            <button
              onClick={() => removeProduct(product)}
              className=" underline mt-3"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
