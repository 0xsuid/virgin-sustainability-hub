import Banner from "@/components/Banner";
import Search from "@/components/search";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screenfont-[family-name:var(--font-geist-sans)]">

      <main className="w-full">
      <Banner title="Our Initiatives" />
      <div>
        <Search placeholder={"search"} />
      </div>
      </main>
    </div>
  );
}
