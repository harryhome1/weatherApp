
import React from 'react';
import { Forecast as ForecastType } from '../context/WeatherContext';
import WeatherIcon from './WeatherIcon';
import { formatTemp, getDayOfWeek, groupForecastByDay } from '../utils/helpers';

interface ForecastProps {
  forecast: ForecastType;
  unit: 'metric' | 'imperial';
  timezone: number;
}

const Forecast: React.FC<ForecastProps> = ({ forecast, unit, timezone }) => {
  const dailyForecast = groupForecastByDay(forecast.list);
  
  if (!dailyForecast.length) {
    return <div>No forecast data available</div>;
  }
  
  return (
    <div className="flex overflow-x-auto hide-scrollbar pb-2 -mx-1">
      {dailyForecast.map((day, index) => {
        const isDay = true; // Assume daytime for forecast icons
        return (
          <div key={index} className="flex-shrink-0 px-1 w-[80px]">
            <div className="rounded-xl p-2 flex flex-col items-center justify-center hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="text-sm font-medium">
                {index === 0 ? 'Today' : getDayOfWeek(day.dt, timezone)}
              </div>
              <div className="my-1">
                <WeatherIcon condition={day.weather} isDay={isDay} size={32} />
              </div>
              <div className="text-sm font-bold">{formatTemp(day.temp, unit)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Forecast;
