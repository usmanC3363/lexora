import configPromise from "@payload-config";
import { getPayload } from "payload";

export default async function Home() {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
  });

  return (
    <main className="flex flex-col gap-4">{JSON.stringify(data, null, 2)}</main>
  );
}
