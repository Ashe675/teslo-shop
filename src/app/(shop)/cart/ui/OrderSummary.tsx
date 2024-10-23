"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react";

export const OrderSummary = () => {
  const getSummaryInformation = useCartStore(
    (state) => state.getSummaryInformation
  );
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());

  // Local state to store summary information
  const [summary, setSummary] = useState({
    itemsInCart: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
  });

  const { itemsInCart, subTotal, tax, total } = summary;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSummary = () => {
      const { itemsInCart, subTotal, tax, total } = getSummaryInformation();
      setSummary({ itemsInCart, subTotal, tax, total });
      setLoaded(true);
    };

    fetchSummary();
  }, [totalItemsInCart, getSummaryInformation]);

  if (!loaded) return <p>Cargando...</p>;

  return (
    <div className="grid grid-cols-2">
      <span>No. Productos</span>
      <span className="text-right">
        {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="text-2xl mt-5">Total</span>
      <span className="text-right mt-5">{currencyFormat(total)}</span>
    </div>
  );
};
