"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useEffect } from "react";
import { toast } from "sonner";
import { CheckoutItem } from "../_components/checkout-item";
import { generateTenantURL } from "@/lib/utils";
import { CheckoutSidebar } from "../_components/checkout-sidebar";
import { InboxIcon, Loader2 } from "lucide-react";
import { paddingWrapper } from "@/lib/constants";

interface CheckoutViewProps {
  tenantSlug: string;
}
export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);
  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(
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
  if (isLoading) {
    return (
      <div className={`${paddingWrapper}`}>
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
          <Loader2 className="text-muted-foreground animate-spin" />
          Loading
        </div>
      </div>
    );
  }

  if (data?.totalDocs === 0) {
    return (
      <div className={`${paddingWrapper}`}>
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
          <InboxIcon />
          No Products Found
        </div>
      </div>
    );
  }
  return (
    <div className={`${paddingWrapper}`}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-md border bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                price={product.price}
                imgAlt={product.image?.alt}
                tenantName={product.tenant.name}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        {/* Checkout Siderbar */}
        <div className="lg:col-span-3">
          <CheckoutSidebar
            // WIP On removing a product, this causes causes the loading animation again, bad UX
            total={data?.totalPrice || 0}
            onCheckout={() => {}}
            isCanceled={true}
            isPending={false}
          />
        </div>
      </div>
    </div>
  );
};
