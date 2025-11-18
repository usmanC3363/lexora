import { Footer } from "@/modules/tenants/ui/_components/footer";
import { Navbar } from "@/modules/checkout/ui/_components/navbar";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

const CheckoutLayout = async ({ children, params }: Props) => {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F0]">
      <Navbar slug={slug} />
      <div className="flex-1">
        <div className="mx-auto max-w-(--breakpoint-xl)">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutLayout;
