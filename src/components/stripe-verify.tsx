import { Button, Link } from "@payloadcms/ui";

interface StripeVerifyProps {
  className?: string;
}
export const StripeVerify = ({ className }: StripeVerifyProps) => {
  return (
    <Link href="/stripe-verify" className="">
      <Button>Verify Account</Button>
    </Link>
  );
};
