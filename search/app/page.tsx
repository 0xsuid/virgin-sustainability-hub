import Banner from "@/components/Banner";
import Search from "@/components/search";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screenfont-[family-name:var(--font-geist-sans)]">

      <main className="w-full">
      <Banner title="Our Initiatives" />
      <div className="mt-6 mx-10 shadow-xl">
        <Search placeholder={"Ask AI - Our Sustainability Initiatives"} />
      </div>
      </main>
    </div>
  );
}
