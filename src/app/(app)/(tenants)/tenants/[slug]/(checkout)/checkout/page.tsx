import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";
import React from "react";

type Props = { params: Promise<{ slug: string }> };

const CheckoutPage = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <div>
      <CheckoutView tenantSlug={slug} />
    </div>
  );
};

export default CheckoutPage;
