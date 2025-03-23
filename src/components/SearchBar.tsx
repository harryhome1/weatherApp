
import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2, AlertTriangle } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { formatLocationName } from '../utils/helpers';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SearchBar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    searchLocations,
    clearSearch,
    addLocation,
    isLoading
  } = useWeather();
  
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        clearSearch();
        setError(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clearSearch]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (searchQuery.trim()) {
      try {
        await searchLocations(searchQuery);
      } catch (err) {
        setError('Failed to search locations. Please try again.');
      }
    }
  };
  
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        handleSearch(e as unknown as React.FormEvent);
      }
    } else if (e.key === 'Escape') {
      clearSearch();
      setError(null);
    } else if (searchQuery.length >= 3) {
      setError(null);
      const debounce = setTimeout(() => {
        searchLocations(searchQuery).catch(err => {
          setError('Failed to search locations. Please try again.');
        });
      }, 500);
      
      return () => clearTimeout(debounce);
    }
  };
  
  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={handleKeyUp}
            placeholder="Search for a city..."
            className="w-full h-12 px-12 rounded-2xl bg-white/20 backdrop-blur-lg dark:bg-black/20 border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg transition-all duration-300 text-foreground"
            aria-label="Search for a city"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/60" />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                clearSearch();
                setError(null);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-foreground/60 hover:text-foreground transition-colors" />
            </button>
          )}
        </div>
      </form>
      
      {error && (
        <div className="absolute mt-2 w-full z-10">
          <Alert variant="destructive" className="bg-white/90 dark:bg-black/80 backdrop-blur-lg border-red-300 dark:border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      
      {(searchResults.length > 0 || isLoading) && !error && (
        <div 
          ref={resultsRef}
          className="absolute mt-2 w-full bg-white/90 dark:bg-black/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 dark:border-white/10 z-10 max-h-80 overflow-auto transition-all duration-300 animate-fade-in"
        >
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <span className="ml-2">Searching...</span>
            </div>
          ) : (
            <ul className="py-2">
              {searchResults.map((location) => (
                <li key={location.id}>
                  <button
                    onClick={() => {
                      addLocation(location);
                      setError(null);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center"
                  >
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-foreground/70">
                        {formatLocationName(location.name, location.country, location.state)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
