import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import Link from "next/link";

interface Props {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
}

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
  const cart = useCart(tenantSlug);

  if (isPurchased)
    return (
      <Button
        variant="elevated"
        className={`flex-1 bg-[#FFCAB0] font-medium`}
        //   WIP may cause error
        asChild
        disabled={false}
      >
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/library/${productId}`}>
          View in Library
        </Link>
      </Button>
    );

  return (
    <Button
      variant="elevated"
      className={`flex-1 bg-pink-400 ${cart.isProductInCart(productId) && "bg-white"}`}
      //   WIP may cause error
      onClick={() => cart.toggleProduct(productId)}
      disabled={false}
    >
      {cart.isProductInCart(productId) ? "Remove from cart" : "Add to Cart"}
    </Button>
  );
};
