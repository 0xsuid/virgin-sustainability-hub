"use server"; 

export async function similaritySearch(query: string) {
    
    const result = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query
        })
    });
    const data = await result.json();
    return data.results;
}