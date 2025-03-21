'use client';  
import { useEffect, useState } from 'react';  
import { similaritySearch } from '@/lib/search';  
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';  
import { Input } from './ui/input';  
import Spinner from './Spinner'; // Import the Spinner component  
import useDebounce from '@/hooks/useDebounce'; // Import the debounce hook  
  
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
    const [inputValue, setInputValue] = useState<string>(''); // State for input value  
    const [results, setResults] = useState<SustainabilityInitiative[]>([]); // State to hold search results  
    const [loading, setLoading] = useState<boolean>(false); // State to indicate loading status  
  
    // Debounced value to be used for the search  
    const debouncedValue = useDebounce(inputValue, 300); // 300ms delay for debouncing  
  
    async function handleSearch(term: string) {  
        if (!term) {  
            setResults([]); // Clear results if the input is empty  
            return;  
        }  
        setLoading(true); // Set loading to true before the fetch  
        try {  
            const result = await similaritySearch(term);  
            setResults(result.sustainability_initiatives); // Update state with initiatives  
        } catch (error) {  
            console.error("Error fetching search results:", error);  
            setResults([]); // Optionally clear results on error  
        } finally {  
            setLoading(false); // Set loading to false after the fetch is complete  
        }  
    }  
  
    // Use effect to trigger search when the debounced value changes  
    useEffect(() => {  
        handleSearch(debouncedValue);  
    }, [debouncedValue]); // Only call handleSearch when the debounced value changes  
  
    return (  
        <div className="p-4 bg-white shadow-md rounded-lg"> {/* Added padding, background, shadow, and rounded corners */}  
            <div className="relative">  
                <label htmlFor="search" className="sr-only">Search</label>  
                <Input  
                    className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200" // Improved styling  
                    placeholder={placeholder}  
                    onChange={(e) => {  
                        setInputValue(e.target.value); // Update input value on change  
                    }}  
                />  
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" /> {/* Changed icon size */}  
            </div>  
            {loading ? <Spinner /> : null} {/* Display loading spinner */}  
            {results.length > 0 && ( // Render results if they exist  
                <div className="mt-4 space-y-4"> {/* Added spacing between results */}  
                    {results.map((initiative, index) => (  
                        <div key={index} className="p-4 border border-gray-300 rounded-md hover:shadow-lg transition-shadow duration-300"> {/* Improved styling with hover effect */}  
                            <h2 className="text-lg font-semibold">{initiative.Virgin_Company}</h2>  
                            <h3 className="text-md font-medium">{initiative.Initiative}</h3>  
                            <p><strong>Challenge:</strong> {initiative.Challenge}</p>  
                            <p><strong>What Virgin is doing:</strong> {initiative.What_Virgin_is_doing}</p>  
                            <p><strong>Call to Action:</strong> {initiative.Call_to_Action.join(', ')}</p>  
                            <div>  
                                <strong>Links:</strong>  
                                <ul className="list-disc pl-5"> {/* Added padding for list items */}  
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
