interface CheckoutViewProps {
  tenantSlug: string;
}
export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  return <div className="">{tenantSlug}</div>;
};
