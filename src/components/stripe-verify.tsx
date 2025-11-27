import { Button, Link } from "@payloadcms/ui";

export const StripeVerify = () => {
  return (
    <Link href="/stripe-verify" className="">
      <Button>Verify Account</Button>
    </Link>
  );
};
