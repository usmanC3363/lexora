"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useEffect } from "react";
import { toast } from "sonner";
import { CheckoutItem } from "../_components/checkout-item";
import { generateTenantURL } from "@/lib/utils";

interface CheckoutViewProps {
  tenantSlug: string;
}
export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);
  const trpc = useTRPC();
  const { data, error } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    }),
  );
  // WIP, may improve this error
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning("Invalid products found, Cart cleared");
    }
  }, [error, clearAllCarts]);
  return (
    <div className="px-4 pt-4 lg:px-12 lg:pt-16">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-md border bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                id={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                price={product.price}
                imgalt={product.image?.alt}
                tenantName={product.tenant.name}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        {/* Checkout Siderbar */}
        <div className="lg:col-span-3">Checkout Siderbar</div>
      </div>
    </div>
  );
};
