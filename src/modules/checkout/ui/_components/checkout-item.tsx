import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CheckoutItemProps {
  name: string;
  productUrl: string;
  tenantName: string;
  tenantUrl: string;
  price: number;
  onRemove: () => void;
  imageUrl?: string | null;
  imgAlt?: string | null;
  isLast?: boolean;
}
export const CheckoutItem = ({
  isLast,
  imageUrl,
  imgAlt,
  name,
  productUrl,
  tenantUrl,
  price,
  tenantName,
  onRemove,
}: CheckoutItemProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[8.5rem_1fr_auto] gap-4 border-b pr-4",
        isLast && "border-b-0",
      )}
    >
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image
            src={imageUrl || "./placeholder.png"}
            alt={imgAlt || name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between py-4">
        <div className="">
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>
          <Link href={tenantUrl}>
            <p className="font-medium underline">{tenantName}</p>
          </Link>
        </div>
      </div>
      <div className="flex min-w-23 flex-col justify-between py-4">
        <p className="font-medium">{formatCurrency(price)}</p>
        <button
          className="group flex cursor-pointer items-center"
          type="button"
          onClick={onRemove}
        >
          <span
            className="text-red-500 transition-all duration-100 ease-linear group-hover:scale-[1.15]"
            style={{ transformOrigin: "center" }}
          >
            ✗{" "}
          </span>
          <span className="pl-[7px] font-medium underline underline-offset-3 transition-all duration-100 ease-linear group-hover:pl-[9px] group-hover:text-base group-hover:text-red-500">
            Remove
          </span>
        </button>
      </div>
    </div>
  );
};
