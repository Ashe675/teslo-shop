"use client";

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChanged: (quantity : number) => void;
}

const MAX_QUANTITY = 5;
const MIN_QUANTITY = 1;

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {

  const onValueChange = (value: number) => {
    if (quantity + value < MIN_QUANTITY ) return;
    if (quantity + value > MAX_QUANTITY ) return;
    onQuantityChanged(quantity + value);
  };

  return (
    <div className=" flex ">
      <button disabled={quantity <= MIN_QUANTITY} className=" disabled:text-gray-300" onClick={() => onValueChange(-1)}>
        <IoRemoveCircleOutline size={20} />
      </button>
      <span className=" w-20 mx-3 px-5 bg-gray-200 text-center rounded">
        {quantity}
      </span>
      <button  disabled={quantity >= MAX_QUANTITY} className=" disabled:text-gray-300" onClick={() => onValueChange(+1)}>
        <IoAddCircleOutline size={20} />
      </button>
    </div>
  );
};
