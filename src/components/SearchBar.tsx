"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        onSearch(val);
    };

    const clearSearch = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className="search-section">
            <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar verbo (ex: eat, ate, eaten, comer)..."
                    value={query}
                    onChange={handleChange}
                />
                {query && (
                    <button className="search-clear visible opacity-100" onClick={clearSearch}>
                        <X size={20} />
                    </button>
                )}
            </div>
            <p className="search-hint">
                Busque por infinitivo, passado, particípio ou tradução
            </p>
        </div>
    );
}
