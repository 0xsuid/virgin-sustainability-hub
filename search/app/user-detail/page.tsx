import Banner from "@/components/Banner";
import { Button } from "@/components/ui/button";

export default function userDetail() {
  return (
    <div className="items-center justify-items-center min-h-screenfont-[family-name:var(--font-geist-sans)]">
      <main className="w-full">
      <Banner title="Our Initiatives" />
      <div>
        <Button>Get Insights</Button>
      </div>
      </main>
    </div>
  );
}