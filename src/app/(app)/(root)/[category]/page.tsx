import React from "react";

type Props = {
  params: Promise<{
    category: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { category } = await params;
  return <div>{category}</div>;
};

export default Page;
