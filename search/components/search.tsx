'use client';
 
import { similaritySearch } from '@/lib/search';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from './ui/input';
 
export default function Search({ placeholder }: { placeholder: string }) {
  async function handleSearch(term: string) {
    console.log(term);
    const result = await similaritySearch(term); 
    console.log(result); 
  }
 
  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label> 
      <Input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 py-6 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}