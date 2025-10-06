import React from "react";

type Props = {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { category, subcategory } = await params;
  return (
    <div>
      {category} &nbsp; / &nbsp; {subcategory}
    </div>
  );
};

export default Page;
