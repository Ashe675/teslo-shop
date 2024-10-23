"use client";

import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { placeOrder } from "@/actions";
import { useRouter } from "next/navigation";

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getSummaryInformation = useCartStore(
    (state) => state.getSummaryInformation
  );

  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Local state to store summary information
  const [summary, setSummary] = useState({
    itemsInCart: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
  });

  const { itemsInCart, subTotal, tax, total } = summary;

  const address = useAddressStore((state) => state.address);

  useEffect(() => {
    const { itemsInCart, subTotal, tax, total } = getSummaryInformation();
    setSummary({ itemsInCart, subTotal, tax, total });
    setLoaded(true);
  }, [getSummaryInformation, totalItemsInCart]);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    // await sleep(2);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const res = await placeOrder(productsToOrder, address);
    if (!res.ok) {
      setErrorMessage(res.message);
      setIsPlacingOrder(false);
      return;
    }

    //* Todo bien
    clearCart();
    router.replace("/orders/" + res.order?.id);
  };

  if (!loaded) return <p>Cargando...</p>;

  return (
    <div className=" bg-white rounded-xl shadow-xl p-7">
      <h2 className=" text-2xl mb-2 ">Dirección de entrega</h2>
      <div className=" mb-10">
        <p className=" text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>
      <div className=" w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className=" text-2xl mb-2">Resumen de orden</h2>
      <div className=" grid grid-cols-2">
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
      <div className=" mt-5 mb-2 w-full">
        <p className=" mb-5">
          <span className=" text-xs">
            Al hacer click en <q>Colocar orden</q>, aceptas nuestros{" "}
            <a href="#" className=" underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className=" underline">
              política de privacidad
            </a>
          </span>
        </p>
        <p className=" text-red-500">{errorMessage}</p>
        <button
          // href={"/orders/123"}
          disabled={isPlacingOrder}
          onClick={onPlaceOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
