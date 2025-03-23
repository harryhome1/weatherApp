
// Format temperature based on unit
export const formatTemp = (temp: number, unit: 'metric' | 'imperial'): string => {
  return `${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}`;
};

// Format date
export const formatDate = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format time
export const formatTime = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

// Get day of week
export const getDayOfWeek = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Format wind speed based on unit
export const formatWindSpeed = (speed: number, unit: 'metric' | 'imperial'): string => {
  if (unit === 'metric') {
    return `${Math.round(speed * 3.6)} km/h`; // Convert m/s to km/h
  }
  return `${Math.round(speed)} mph`;
};

// Get weather icon based on condition and time
export const getWeatherIcon = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

// Group forecast by day
export const groupForecastByDay = (forecastList: any[]): any[] => {
  if (!forecastList || forecastList.length === 0) return [];
  
  const groupedForecast: { [key: string]: any[] } = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!groupedForecast[date]) {
      groupedForecast[date] = [];
    }
    groupedForecast[date].push(item);
  });
  
  // Get daily averages for each group
  return Object.keys(groupedForecast).map(date => {
    const items = groupedForecast[date];
    const midDayItem = items.find(item => {
      const hour = new Date(item.dt * 1000).getHours();
      return hour >= 12 && hour <= 15;
    }) || items[Math.floor(items.length / 2)];
    
    return {
      date,
      dt: midDayItem.dt,
      temp: midDayItem.main.temp,
      weather: midDayItem.weather[0],
      humidity: midDayItem.main.humidity,
      wind: midDayItem.wind.speed,
      items: items // Keep all items for reference if needed
    };
  }).slice(0, 5); // Limit to 5 days
};

// Calculate temperature differential
export const calculateTempDiff = (temp1: number, temp2: number): string => {
  const diff = Math.round(temp1 - temp2);
  if (diff > 0) {
    return `+${diff}°`;
  }
  return `${diff}°`;
};

// Get background color based on temperature (for visualization)
export const getTempColor = (temp: number, unit: 'metric' | 'imperial'): string => {
  // Convert to Celsius for consistent scale
  const tempC = unit === 'imperial' ? (temp - 32) * 5/9 : temp;
  
  if (tempC < 0) return 'bg-blue-700';
  if (tempC < 5) return 'bg-blue-500';
  if (tempC < 10) return 'bg-blue-400';
  if (tempC < 15) return 'bg-blue-300';
  if (tempC < 20) return 'bg-green-300';
  if (tempC < 25) return 'bg-yellow-300';
  if (tempC < 30) return 'bg-orange-300';
  if (tempC < 35) return 'bg-orange-500';
  return 'bg-red-500';
};

// Get a descriptive text for the weather condition
export const getWeatherDescription = (weatherId: number): string => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) return 'Thunderstorm';
  if (weatherId >= 300 && weatherId < 400) return 'Drizzle';
  if (weatherId >= 500 && weatherId < 600) return 'Rain';
  if (weatherId >= 600 && weatherId < 700) return 'Snow';
  if (weatherId >= 700 && weatherId < 800) return 'Fog';
  if (weatherId === 800) return 'Clear Sky';
  if (weatherId > 800 && weatherId < 900) return 'Clouds';
  return 'Unknown';
};

// Check if it's daytime
export const isDaytime = (dt: number, sunrise: number, sunset: number): boolean => {
  return dt >= sunrise && dt <= sunset;
};

// Format location name
export const formatLocationName = (name: string, country: string, state?: string): string => {
  if (state) {
    return `${name}, ${state}, ${country}`;
  }
  return `${name}, ${country}`;
};
