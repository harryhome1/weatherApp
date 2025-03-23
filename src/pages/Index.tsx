import React from 'react';
import { Plus, MapPin, Heart } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import LocationItem from '@/components/LocationItem';
import { Button } from '@/components/ui/button';
import { formatLocationName } from '@/utils/helpers';

const Index = () => {
  const { 
    currentLocation, 
    selectedLocations, 
    addLocation, 
    removeLocation, 
    weatherData,
    favorites
  } = useWeather();
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-500 dark:to-blue-300">
                Weather Comparison
              </span>
            </h1>
            <p className="text-lg text-foreground/80 mb-6">
              Check the weather for any location and compare multiple cities side by side.
            </p>
            
            <SearchBar />
          </section>
          
          {selectedLocations.length > 0 && (
            <section className="mb-10 animate-fade-in">
              <h2 className="text-xl font-semibold tracking-tight mb-4">Selected Locations</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {selectedLocations.map((location, index) => (
                  <WeatherCard key={location.id} location={location} />
                ))}
              </div>
            </section>
          )}
          
          {currentLocation && (
            <section className="mb-10 animate-fade-in">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold tracking-tight">Your Location</h2>
              </div>
              
              <WeatherCard location={currentLocation} />
            </section>
          )}
          
          {favorites.length > 0 && (
            <section className="animate-fade-in">
              <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 text-red-400 mr-2" />
                <h2 className="text-xl font-semibold tracking-tight">Favorites</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favorites.slice(0, 3).map((location) => (
                  <div key={location.id} className="bg-white/60 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-xl p-2 shadow-lg hover-lift">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between h-auto py-3 font-normal text-left"
                      onClick={() => {
                        if (!selectedLocations.some(loc => loc.id === location.id)) {
                          addLocation(location);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {formatLocationName(location.name, location.country, location.state)}
                        </span>
                      </div>
                      <Plus className="h-4 w-4 opacity-50" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {favorites.length > 3 && (
                <div className="mt-2 text-center">
                  <Button variant="link" asChild>
                    <a href="/favorites">View all favorites</a>
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
