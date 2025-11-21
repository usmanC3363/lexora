"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { CheckoutItem } from "../_components/checkout-item";
import { generateTenantURL } from "@/lib/utils";
import { CheckoutSidebar } from "../_components/checkout-sidebar";
import { InboxIcon, Loader2 } from "lucide-react";
import { paddingWrapper } from "@/lib/constants";
import { useCheckoutStates } from "../../hooks/use-checkout-state";

interface CheckoutViewProps {
  tenantSlug: string;
}
export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const [states, setStates] = useCheckoutStates();
  const router = useRouter();
  const { productIds, clearCart, removeProduct } = useCart(tenantSlug);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    }),
  );

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          // WIP: modify when subdomains are enabled
          router.push("/sign-in");
        }
        toast.error(error.message);
      },
    }),
  );
  // WIP, may improve this error
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, Cart cleared");
    }
  }, [error, clearCart]);

  useEffect(() => {
    if (states.success) {
      // this prevents a loop error, but not suitable
      // setStates({ success: false, cancel: false });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      router.push("/library");
    }
  }, [
    states.success,
    clearCart,
    router,
    setStates,
    queryClient,
    trpc.library.getMany,
  ]);
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
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCanceled={states.cancel}
            isPending={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};
