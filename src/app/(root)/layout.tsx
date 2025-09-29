import React from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
