
import React, { useEffect } from 'react';
import { Trash, Heart, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useWeather, Location, CurrentWeather } from '../context/WeatherContext';
import WeatherIcon from './WeatherIcon';
import Forecast from './Forecast';
import { formatTemp, formatWindSpeed, formatTime } from '../utils/helpers';

interface WeatherCardProps {
  location: Location;
  isComparison?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ location, isComparison = false }) => {
  const { 
    weatherData, 
    fetchWeatherForLocation, 
    unit, 
    removeLocation, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite,
    getBackgroundClass
  } = useWeather();
  
  const data = weatherData.get(location.id);
  
  useEffect(() => {
    if (!data || (!data.current.main && !data.loading)) {
      fetchWeatherForLocation(location);
    }
  }, [location, data, fetchWeatherForLocation]);
  
  if (!data) {
    return (
      <div className="weather-glass rounded-3xl overflow-hidden min-h-[200px] w-full flex items-center justify-center animate-pulse p-6">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }
  
  if (data.loading) {
    return (
      <div className="weather-glass rounded-3xl overflow-hidden min-h-[200px] w-full flex flex-col items-center justify-center p-6 animate-pulse">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-center text-sm opacity-70">Loading weather for {location.name}...</p>
      </div>
    );
  }
  
  if (data.error) {
    return (
      <div className="weather-glass rounded-3xl overflow-hidden min-h-[200px] w-full flex flex-col items-center justify-center p-6">
        <AlertCircle className="h-8 w-8 text-red-400 mb-4" />
        <p className="text-center text-sm">{data.error}</p>
      </div>
    );
  }
  
  const current: CurrentWeather = data.current;
  
  if (!current.main) {
    return (
      <div className="weather-glass rounded-3xl overflow-hidden min-h-[200px] w-full flex items-center justify-center p-6">
        <p className="text-center text-sm">No weather data available</p>
      </div>
    );
  }

  const isDay = current.dt > current.sys.sunrise && current.dt < current.sys.sunset;
  const backgroundClass = getBackgroundClass(current.weather, current.dt, current.sys.sunrise, current.sys.sunset);

  return (
    <div className={`rounded-3xl overflow-hidden shadow-xl w-full transition-all duration-500 ${isComparison ? '' : 'hover:shadow-2xl hover:scale-[1.01]'}`}>
      <div className={`${backgroundClass} relative p-6 pb-4 transition-all duration-500`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20"></div>
        
        <div className="relative flex justify-between items-start mb-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-white text-shadow mr-1" />
            <h2 className="font-semibold text-xl text-white text-shadow tracking-tight">{current.name}</h2>
            <span className="text-white/80 text-shadow ml-1">{current.sys.country}</span>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => isFavorite(location.id) ? removeFromFavorites(location.id) : addToFavorites(location)}
              className="p-2 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300"
              aria-label={isFavorite(location.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite(location.id) ? 'text-red-400 fill-red-400' : 'text-white'}`} 
              />
            </button>
            
            {!isComparison && (
              <button 
                onClick={() => removeLocation(location.id)}
                className="p-2 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300"
                aria-label="Remove location"
              >
                <Trash className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-col justify-center">
              <div className="text-6xl font-bold text-white text-shadow-lg">
                {formatTemp(current.main.temp, unit)}
              </div>
              <div className="text-white/80 text-shadow">
                Feels like {formatTemp(current.main.feels_like, unit)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <WeatherIcon 
              condition={current.weather[0]} 
              isDay={isDay} 
              size={72} 
              className="text-white text-shadow"
            />
            <p className="text-white text-shadow capitalize mt-1">{current.weather[0].description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-6 text-white/90 text-shadow">
          <div className="flex flex-col items-center p-2 bg-white/20 rounded-xl">
            <span className="text-xs uppercase tracking-wide">Humidity</span>
            <span className="font-semibold">{current.main.humidity}%</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white/20 rounded-xl">
            <span className="text-xs uppercase tracking-wide">Wind</span>
            <span className="font-semibold">{formatWindSpeed(current.wind.speed, unit)}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white/20 rounded-xl">
            <span className="text-xs uppercase tracking-wide">Pressure</span>
            <span className="font-semibold">{current.main.pressure} hPa</span>
          </div>
        </div>
        
        <div className="flex justify-between mt-4 text-white/90 text-shadow text-sm">
          <div className="flex items-center">
            <span>Sunrise: {formatTime(current.sys.sunrise, current.timezone)}</span>
          </div>
          <div className="flex items-center">
            <span>Sunset: {formatTime(current.sys.sunset, current.timezone)}</span>
          </div>
        </div>
      </div>
      
      {!isComparison && data.forecast && data.forecast.list && (
        <div className="bg-white dark:bg-slate-800 p-4">
          <h3 className="font-medium mb-2 text-sm text-foreground/80">5-Day Forecast</h3>
          <Forecast forecast={data.forecast} unit={unit} timezone={data.forecast.city.timezone} />
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
