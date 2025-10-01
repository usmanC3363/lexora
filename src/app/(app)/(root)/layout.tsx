import React from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { SearchFilters } from "./_components/search-filters";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Category } from "@/payload-types";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, // Populates the subcategory with specified lvl of depth
    pagination: false,
    where: {
      parent: { exists: false }, //condition for only rendering parent category
    },
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategory?.docs ?? []).map((doc) => ({
      ...(doc as Category),
      subcategory: undefined,
    })),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
