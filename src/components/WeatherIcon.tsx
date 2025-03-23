
import React from 'react';
import { 
  Cloud, Sun, Moon, CloudRain, CloudSnow, CloudFog, CloudLightning, 
  CloudDrizzle, Wind, MoonStar, SunDim, CloudSun, CloudMoon
} from 'lucide-react';
import { WeatherCondition } from '../context/WeatherContext';

interface WeatherIconProps {
  condition: WeatherCondition;
  isDay: boolean;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  isDay, 
  size = 24,
  className = ''
}) => {
  const getIconComponent = () => {
    const weatherId = condition.id;
    const weatherMain = condition.main.toLowerCase();
    
    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning size={size} className={`text-purple-500 ${className} animate-pulse-slow`} />;
    }
    
    // Drizzle
    if (weatherId >= 300 && weatherId < 400) {
      return <CloudDrizzle size={size} className={`text-blue-400 ${className} animate-bounce-subtle`} />;
    }
    
    // Rain
    if (weatherId >= 500 && weatherId < 600) {
      return <CloudRain size={size} className={`text-blue-500 ${className} animate-bounce-subtle`} />;
    }
    
    // Snow
    if (weatherId >= 600 && weatherId < 700) {
      return <CloudSnow size={size} className={`text-slate-100 ${className} animate-float`} />;
    }
    
    // Atmosphere (fog, mist, etc.)
    if (weatherId >= 700 && weatherId < 800) {
      return <CloudFog size={size} className={`text-gray-400 ${className} animate-pulse-slow`} />;
    }
    
    // Clear sky
    if (weatherId === 800) {
      if (isDay) {
        return <Sun size={size} className={`text-yellow-400 ${className} animate-spin-slow`} />;
      } else {
        return <Moon size={size} className={`text-slate-100 ${className} animate-pulse-slow`} />;
      }
    }
    
    // Few clouds
    if (weatherId === 801) {
      if (isDay) {
        return <CloudSun size={size} className={`text-blue-400 ${className} animate-float`} />;
      } else {
        return <CloudMoon size={size} className={`text-slate-300 ${className} animate-float`} />;
      }
    }
    
    // Clouds
    if (weatherId > 801 && weatherId < 900) {
      return <Cloud size={size} className={`text-slate-400 ${className} animate-float`} />;
    }
    
    // Fallback
    if (isDay) {
      return <SunDim size={size} className={`text-yellow-400 ${className} animate-pulse-slow`} />;
    } else {
      return <MoonStar size={size} className={`text-slate-100 ${className} animate-pulse-slow`} />;
    }
  };
  
  return (
    <div className="relative flex items-center justify-center">
      {getIconComponent()}
    </div>
  );
};

export default WeatherIcon;
