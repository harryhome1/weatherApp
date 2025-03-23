
import React from 'react';
import { useWeather, Location, CurrentWeather } from '../context/WeatherContext';
import { Loader2, AlertCircle, Droplets, Wind, Thermometer } from 'lucide-react';
import { formatTemp, calculateTempDiff, formatWindSpeed, getTempColor } from '../utils/helpers';
import WeatherIcon from './WeatherIcon';

interface ComparisonViewProps {
  locations: Location[];
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ locations }) => {
  const { weatherData, unit } = useWeather();
  
  if (locations.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-foreground/70">
          Add locations to compare their weather data.
        </p>
      </div>
    );
  }
  
  // Get weather data for each location
  const locationsWithData = locations.map(location => {
    const data = weatherData.get(location.id);
    return {
      location,
      weatherData: data
    };
  });
  
  // Check if all data is loaded
  const isLoading = locationsWithData.some(item => 
    !item.weatherData || item.weatherData.loading
  );
  
  // Check if any data has error
  const hasError = locationsWithData.some(item => 
    item.weatherData && item.weatherData.error
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
        <p>Loading weather data...</p>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="flex items-center justify-center p-12 text-red-500">
        <AlertCircle className="h-8 w-8 mr-2" />
        <p>Error loading some weather data. Please try again.</p>
      </div>
    );
  }
  
  // All data is loaded without errors
  const weatherItems = locationsWithData.map(item => 
    item.weatherData?.current as CurrentWeather
  );
  
  // Find base location (first one) for comparison
  const baseWeather = weatherItems[0];
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Temperature Comparison */}
      <div className="weather-glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Temperature Comparison</h3>
        <div className="space-y-4">
          {weatherItems.map((weather, index) => {
            const location = locations[index];
            const isBase = index === 0;
            let tempDiff = isBase ? null : calculateTempDiff(weather.main.temp, baseWeather.main.temp);
            
            return (
              <div key={location.id} className="flex items-center space-x-2">
                <div className="w-1/4">
                  <p className="font-medium">{weather.name}</p>
                </div>
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full flex items-center pl-3 ${getTempColor(weather.main.temp, unit)}`}
                    style={{ width: `${Math.max(30, Math.min(100, (weather.main.temp / 50) * 100))}%` }}
                  >
                    <span className="text-white font-medium text-sm">
                      {formatTemp(weather.main.temp, unit)}
                    </span>
                  </div>
                </div>
                {!isBase && (
                  <div className="w-12 text-right">
                    <span className={tempDiff?.startsWith('+') ? 'text-red-500' : 'text-blue-500'}>
                      {tempDiff}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Feels Like Comparison */}
      <div className="weather-glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
          Feels Like Comparison
        </h3>
        <div className="space-y-4">
          {weatherItems.map((weather, index) => {
            const location = locations[index];
            const isBase = index === 0;
            let tempDiff = isBase ? null : calculateTempDiff(weather.main.feels_like, baseWeather.main.feels_like);
            
            return (
              <div key={location.id} className="flex items-center space-x-2">
                <div className="w-1/4">
                  <p className="font-medium">{weather.name}</p>
                </div>
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full flex items-center pl-3 ${getTempColor(weather.main.feels_like, unit)}`}
                    style={{ width: `${Math.max(30, Math.min(100, (weather.main.feels_like / 50) * 100))}%` }}
                  >
                    <span className="text-white font-medium text-sm">
                      {formatTemp(weather.main.feels_like, unit)}
                    </span>
                  </div>
                </div>
                {!isBase && (
                  <div className="w-12 text-right">
                    <span className={tempDiff?.startsWith('+') ? 'text-red-500' : 'text-blue-500'}>
                      {tempDiff}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Humidity Comparison */}
      <div className="weather-glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Droplets className="h-5 w-5 mr-2 text-blue-500" />
          Humidity Comparison
        </h3>
        <div className="space-y-4">
          {weatherItems.map((weather, index) => {
            const location = locations[index];
            const isBase = index === 0;
            let diff = isBase ? null : weather.main.humidity - baseWeather.main.humidity;
            let diffText = diff === null ? '' : (diff > 0 ? `+${diff}%` : `${diff}%`);
            
            return (
              <div key={location.id} className="flex items-center space-x-2">
                <div className="w-1/4">
                  <p className="font-medium">{weather.name}</p>
                </div>
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 flex items-center pl-3"
                    style={{ width: `${Math.max(weather.main.humidity, 5)}%` }}
                  >
                    <span className="text-white font-medium text-sm">
                      {weather.main.humidity}%
                    </span>
                  </div>
                </div>
                {!isBase && (
                  <div className="w-12 text-right">
                    <span className={diff && diff > 0 ? 'text-blue-500' : 'text-amber-500'}>
                      {diffText}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Wind Comparison */}
      <div className="weather-glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Wind className="h-5 w-5 mr-2 text-emerald-500" />
          Wind Comparison
        </h3>
        <div className="space-y-4">
          {weatherItems.map((weather, index) => {
            const location = locations[index];
            const isBase = index === 0;
            const windSpeed = unit === 'metric' ? weather.wind.speed * 3.6 : weather.wind.speed; // Convert m/s to km/h
            const baseWindSpeed = unit === 'metric' ? baseWeather.wind.speed * 3.6 : baseWeather.wind.speed;
            let diff = isBase ? null : windSpeed - baseWindSpeed;
            let diffText = diff === null ? '' : (diff > 0 ? `+${Math.round(diff)}` : `${Math.round(diff)}`);
            
            return (
              <div key={location.id} className="flex items-center space-x-2">
                <div className="w-1/4">
                  <p className="font-medium">{weather.name}</p>
                </div>
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 flex items-center pl-3"
                    style={{ width: `${Math.max(15, Math.min(100, (windSpeed / 40) * 100))}%` }}
                  >
                    <span className="text-white font-medium text-sm">
                      {formatWindSpeed(weather.wind.speed, unit)}
                    </span>
                  </div>
                </div>
                {!isBase && (
                  <div className="w-12 text-right">
                    <span className={diff && diff > 0 ? 'text-emerald-500' : 'text-blue-400'}>
                      {diffText}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Weather Conditions */}
      <div className="weather-glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Weather Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherItems.map((weather, index) => {
            const location = locations[index];
            const isDay = weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset;
            
            return (
              <div key={location.id} className="bg-white/20 dark:bg-black/20 rounded-xl p-4 backdrop-blur-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{weather.name}</h4>
                </div>
                <div className="flex items-center justify-center py-2">
                  <WeatherIcon condition={weather.weather[0]} isDay={isDay} size={48} />
                </div>
                <p className="text-center capitalize mb-2">{weather.weather[0].description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Pressure:</span>
                    <span className="font-medium">{weather.main.pressure} hPa</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Clouds:</span>
                    <span className="font-medium">{weather.clouds.all}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
