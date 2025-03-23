import React from 'react';
import { Heart, Trash, MapPin, Plus } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import WeatherCard from '@/components/WeatherCard';
import { Button } from '@/components/ui/button';
import { formatLocationName } from '@/utils/helpers';

const Favorites = () => {
  const { favorites, removeFromFavorites, addLocation, selectedLocations } = useWeather();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
              <Heart className="h-6 w-6 text-red-400 mr-2" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-500 dark:to-blue-300">
                Your Favorites
              </span>
            </h1>
            <p className="text-foreground/80 mb-6">
              Your saved locations for quick access.
            </p>
            
            {favorites.length === 0 ? (
              <div className="weather-glass rounded-xl p-8 text-center">
                <p className="text-foreground/80 mb-2">No favorite locations saved yet</p>
                <p className="text-sm text-foreground/60 mb-4">
                  Add locations to your favorites by clicking the heart icon on any weather card
                </p>
                <Button asChild>
                  <a href="/">Back to Home</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {favorites.map((location) => (
                  <div key={location.id} className="weather-glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-primary mr-2" />
                        <h2 className="font-semibold">
                          {formatLocationName(location.name, location.country, location.state)}
                        </h2>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            if (!selectedLocations.some(loc => loc.id === location.id)) {
                              addLocation(location);
                            }
                          }}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromFavorites(location.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <WeatherCard location={location} isComparison={true} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Favorites;
