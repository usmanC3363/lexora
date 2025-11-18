import { cn } from "@/lib/utils";
import Image from "next/image";

interface CheckoutItemProps {
  id: string;
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
  id,
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
        <div className="relative aspect-square h-full w-full">
          <Image
            src={imageUrl || "./placeholder.png"}
            alt={imgAlt || ""}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="">
        <p className="font-semibold">{name}</p>
        <p className="text-sm underline underline-offset-2">{tenantName}</p>
      </div>
    </div>
  );
};
