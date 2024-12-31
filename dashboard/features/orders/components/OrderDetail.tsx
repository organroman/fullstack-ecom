import { ReactNode } from "react";

interface OrderDetailProps {
  title: string;
  value: string | ReactNode;
}
const OrderDetail = ({ title, value }: OrderDetailProps) => {
  return (
    <div className="grid grid-cols-5 gap-2 items-center w-full">
      <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1">
        {title}
      </p>
      <p className="text-md text-neutral-400 col-span-4">{value}</p>
    </div>
  );
};

export default OrderDetail;
