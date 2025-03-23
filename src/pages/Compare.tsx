import React from 'react';
import { Plus } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '@/components/SearchBar';
import LocationItem from '@/components/LocationItem';
import ComparisonView from '@/components/ComparisonView';
import { Button } from '@/components/ui/button';

const Compare = () => {
  const { selectedLocations, removeLocation } = useWeather();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-500 dark:to-blue-300">
                Weather Comparison
              </span>
            </h1>
            <p className="text-foreground/80 mb-6">
              Check the weather for any location and compare multiple cities side by side.
            </p>
            
            <div className="mb-6">
              <SearchBar />
            </div>
            
            <div className="weather-glass rounded-xl p-4 mb-6">
              <h2 className="text-sm font-medium mb-3 text-foreground/70">Selected Locations ({selectedLocations.length}/3)</h2>
              
              <div className="space-y-2">
                {selectedLocations.length === 0 ? (
                  <div className="text-center py-4 text-foreground/60">
                    <p>No locations selected</p>
                    <p className="text-sm mt-1">Use the search bar to add locations for comparison</p>
                  </div>
                ) : (
                  selectedLocations.map((location) => (
                    <LocationItem
                      key={location.id}
                      location={location}
                      onRemove={removeLocation}
                    />
                  ))
                )}
              </div>
              
              {selectedLocations.length < 3 && (
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" className="text-foreground/70">
                    <Plus className="h-4 w-4 mr-1" />
                    Add location
                  </Button>
                </div>
              )}
            </div>
          </section>
          
          <section>
            <ComparisonView locations={selectedLocations} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Compare;
