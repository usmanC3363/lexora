import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lexora",
  description:
    "The best online book selling store you can find out there. We've got from the old midnight classics, or new novels by best selling authors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar">
      <body
        className={`${dmSans.className} no-scrollbar overflow-x-hidden overflow-y-scroll antialiased`}
      >
        {/* Nuqs helps with Params or so */}
        <NuqsAdapter>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
