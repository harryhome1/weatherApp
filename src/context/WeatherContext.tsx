import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

// Types
export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  id: number;
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
  visibility: number;
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  pop: number;
  dt_txt: string;
}

export interface Forecast {
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: Forecast;
  loading: boolean;
  error: string | null;
}

interface WeatherContextProps {
  unit: 'metric' | 'imperial';
  toggleUnit: () => void;
  searchResults: Location[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLocations: (query: string) => Promise<void>;
  clearSearch: () => void;
  selectedLocations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (locationId: string) => void;
  weatherData: Map<string, WeatherData>;
  fetchWeatherForLocation: (location: Location) => Promise<void>;
  isLoading: boolean;
  favorites: Location[];
  addToFavorites: (location: Location) => void;
  removeFromFavorites: (locationId: string) => void;
  isFavorite: (locationId: string) => boolean;
  getBackgroundClass: (weather: WeatherCondition[], dt: number, sunrise: number, sunset: number) => string;
  currentLocation: Location | null;
}

const WeatherContext = createContext<WeatherContextProps | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

// API key for OpenWeatherMap
const API_KEY = '1635890035cbba097fd5c26c8ea672a1'; // OpenWeatherMap API key

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [weatherData, setWeatherData] = useState<Map<string, WeatherData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem('weatherFavorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  // Update localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Get current location on mount
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
              );
              
              if (!response.ok) {
                throw new Error('Failed to get location information');
              }
              
              const data = await response.json();
              if (data && data.length > 0) {
                const location: Location = {
                  id: `${data[0].lat}-${data[0].lon}`,
                  name: data[0].name,
                  lat: data[0].lat,
                  lon: data[0].lon,
                  country: data[0].country,
                  state: data[0].state
                };
                
                setCurrentLocation(location);
                fetchWeatherForLocation(location);
              }
            } catch (error) {
              console.error('Error getting current location:', error);
              toast.error('Could not determine your location. Please search for a location manually.');
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            toast.error('Location access denied. Please search for a location manually.');
          }
        );
      } else {
        toast.error('Geolocation is not supported by your browser. Please search for a location manually.');
      }
    };

    getCurrentLocation();
  }, []);

  const toggleUnit = () => {
    setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        toast.error(`No locations found for "${query}"`);
        setSearchResults([]);
        return;
      }
      
      const locations: Location[] = data.map((item: any) => ({
        id: `${item.lat}-${item.lon}`,
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state
      }));
      
      setSearchResults(locations);
    } catch (error) {
      console.error('Error searching locations:', error);
      toast.error('Failed to search locations. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const addLocation = (location: Location) => {
    setSelectedLocations(prev => {
      // Check if location already exists
      if (prev.some(loc => loc.id === location.id)) {
        return prev;
      }
      
      let newLocations;
      // If already at maximum, remove the last location
      if (prev.length >= 3) {
        // Add the new location at the beginning and keep only the first 3
        newLocations = [location, ...prev.slice(0, 2)];
        toast.info('Removed oldest location to add new one');
      } else {
        // Add the new location at the beginning
        newLocations = [location, ...prev];
      }
      
      // Fetch weather data for the new location
      fetchWeatherForLocation(location);
      return newLocations;
    });
    clearSearch();
  };

  const removeLocation = (locationId: string) => {
    setSelectedLocations(prev => prev.filter(location => location.id !== locationId));
    
    // Update weatherData by creating a new Map without the removed location
    setWeatherData(prev => {
      const newMap = new Map(prev);
      newMap.delete(locationId);
      return newMap;
    });
  };

  const fetchWeatherForLocation = async (location: Location) => {
    // Skip if already loading this location
    if (weatherData.get(location.id)?.loading) {
      return;
    }
    
    // Set loading state for this location
    setWeatherData(prev => {
      const newMap = new Map(prev);
      newMap.set(location.id, {
        ...(prev.get(location.id) || { current: {} as CurrentWeather, forecast: {} as Forecast }),
        loading: true,
        error: null
      });
      return newMap;
    });
    
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=${unit}&appid=${API_KEY}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current weather');
      }
      
      const currentData = await currentResponse.json();
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=${unit}&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast');
      }
      
      const forecastData = await forecastResponse.json();
      
      // Update weather data in state
      setWeatherData(prev => {
        const newMap = new Map(prev);
        newMap.set(location.id, {
          current: currentData,
          forecast: forecastData,
          loading: false,
          error: null
        });
        return newMap;
      });
    } catch (error) {
      console.error(`Error fetching weather for ${location.name}:`, error);
      
      // Update error state
      setWeatherData(prev => {
        const newMap = new Map(prev);
        newMap.set(location.id, {
          ...(prev.get(location.id) || { current: {} as CurrentWeather, forecast: {} as Forecast }),
          loading: false,
          error: `Failed to load weather data for ${location.name}`
        });
        return newMap;
      });
      
      toast.error(`Could not load weather data for ${location.name}`);
    }
  };

  const addToFavorites = (location: Location) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === location.id)) {
        return prev;
      }
      return [...prev, location];
    });
    toast.success(`Added ${location.name} to favorites`);
  };

  const removeFromFavorites = (locationId: string) => {
    setFavorites(prev => prev.filter(location => location.id !== locationId));
    toast.success('Removed from favorites');
  };

  const isFavorite = (locationId: string) => {
    return favorites.some(location => location.id === locationId);
  };

  // Function to determine appropriate background class based on weather
  const getBackgroundClass = (
    weather: WeatherCondition[], 
    dt: number, 
    sunrise: number, 
    sunset: number
  ): string => {
    if (!weather || weather.length === 0) {
      return 'bg-weather-clear-day';
    }
    
    const isDay = dt > sunrise && dt < sunset;
    const weatherMain = weather[0].main.toLowerCase();
    
    if (weatherMain.includes('clear')) {
      return isDay ? 'bg-weather-clear-day' : 'bg-weather-clear-night';
    } else if (weatherMain.includes('cloud')) {
      return isDay ? 'bg-weather-clouds-day' : 'bg-weather-clouds-night';
    } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      return isDay ? 'bg-weather-rain-day' : 'bg-weather-rain-night';
    } else if (weatherMain.includes('snow')) {
      return isDay ? 'bg-weather-snow-day' : 'bg-weather-snow-night';
    } else if (weatherMain.includes('thunder')) {
      return 'bg-weather-thunderstorm';
    } else {
      return 'bg-weather-atmosphere';
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        unit,
        toggleUnit,
        searchResults,
        searchQuery,
        setSearchQuery,
        searchLocations,
        clearSearch,
        selectedLocations,
        addLocation,
        removeLocation,
        weatherData,
        fetchWeatherForLocation,
        isLoading,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getBackgroundClass,
        currentLocation
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
