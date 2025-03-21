'use client';  
import { useState } from 'react';  
import { similaritySearch } from '@/lib/search';  
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';  
import { Input } from './ui/input';  
  
// Define the interface for the sustainability initiative  
interface SustainabilityInitiative {  
  Virgin_Company: string;  
  Initiative: string;  
  Challenge: string;  
  What_Virgin_is_doing: string;  
  Call_to_Action: string[];  
  Links: string[];  
}  
  
export default function Search({ placeholder }: { placeholder: string }) {  
  const [results, setResults] = useState<SustainabilityInitiative[]>([]); // State to hold search results  
  
  async function handleSearch(term: string) {  
    console.log(term);  
    const result = await similaritySearch(term);  
    console.log(result);  
    setResults(result.sustainability_initiatives); // Update state with initiatives  
  }  
  
  return (  
    <div>  
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
  
      {results.length > 0 && ( // Render results if they exist  
        <div className="mt-4">  
          {results.map((initiative, index) => (  
            <div key={index} className="mb-4 p-4 border rounded-md">  
              <h2 className="text-lg font-semibold">{initiative.Virgin_Company}</h2>  
              <h3 className="text-md font-medium">{initiative.Initiative}</h3>  
              <p><strong>Challenge:</strong> {initiative.Challenge}</p>  
              <p><strong>What Virgin is doing:</strong> {initiative.What_Virgin_is_doing}</p>  
              <p><strong>Call to Action:</strong> {initiative.Call_to_Action.join(', ')}</p>  
              <div>  
                <strong>Links:</strong>  
                <ul>  
                  {initiative.Links.map((link, linkIndex) => (  
                    <li key={linkIndex}>  
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">  
                        {link}  
                      </a>  
                    </li>  
                  ))}  
                </ul>  
              </div>  
            </div>  
          ))}  
        </div>  
      )}  
    </div>  
  );  
}  
