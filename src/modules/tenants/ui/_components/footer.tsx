import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t bg-white font-medium">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center gap-2 px-4 py-6 lg:px-12 2xl:max-w-(--breakpoint-2xl)">
        <p className="">Powered by</p>
        <Link
          href={process.env.NEXT_PUBLIC_APP_URL!}
          className="text-2xl font-bold tracking-tight"
        >
          Lexora
        </Link>
      </div>
    </footer>
  );
};
