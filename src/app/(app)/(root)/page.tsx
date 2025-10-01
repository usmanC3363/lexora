import configPromise from "@payload-config";
import { getPayload } from "payload";

export default async function Home() {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, // Populates the subcategory with specified lvl of depth
    where: {
      parent: { exists: false }, //condition for only rendering parent category
    },
  });
  console.log(data);

  return <main className="flex flex-col gap-4">dasda</main>;
}
