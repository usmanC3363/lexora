import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      Homepage
      <Button variant="elevated">click me</Button>
      <Progress />
      <Input />
    </main>
  );
}
