import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   swcPlugins: [
  //     [
  //       'next-superjson-plugin',
  //       {
  //         excluded: [],
  //       },
  //     ],
  //   ],
  // },
};

export default withPayload(nextConfig);
