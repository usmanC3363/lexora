import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  tenantSlug: string;
  productId: string;
}

export const CartButton = ({ tenantSlug, productId }: Props) => {
  const cart = useCart(tenantSlug);

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
