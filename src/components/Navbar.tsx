import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThermometerSun, BarChart, Heart, Menu, X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { unit, toggleUnit } = useWeather();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  React.useEffect(() => {
    // Prevent scrolling when mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed w-full top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ThermometerSun className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">Climatify</span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Home
            </Link>
            <Link 
              to="/compare" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === '/compare' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Compare
            </Link>
            <Link 
              to="/favorites" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === '/favorites' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Favorites
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Desktop Unit Toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleUnit}
              className="hidden md:flex"
            >
              {unit === 'metric' ? '°C' : '°F'}
            </Button>
            
            {/* Mobile Unit Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleUnit}
              className="md:hidden text-blue-600"
            >
              {unit === 'metric' ? '°C' : '°F'}
            </Button>
            
            {/* Mobile Menu Button */}
            <button 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-colors md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-x-0 top-[65px] bottom-0 z-[90] bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="container h-full mx-auto p-4 overflow-y-auto flex flex-col">
          <div className="flex-1 space-y-1">
            <Link 
              to="/" 
              className={cn(
                "flex items-center p-4 rounded-lg font-medium transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700",
                location.pathname === '/' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-700 dark:text-gray-300'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/compare" 
              className={cn(
                "flex items-center p-4 rounded-lg font-medium transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700",
                location.pathname === '/compare' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-700 dark:text-gray-300'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Compare
            </Link>
            <Link 
              to="/favorites" 
              className={cn(
                "flex items-center p-4 rounded-lg font-medium transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700",
                location.pathname === '/favorites' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-700 dark:text-gray-300'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </Link>
          </div>
          
          <div className="mt-auto pt-4 pb-8">
            <Button 
              variant="outline" 
              onClick={() => {
                toggleUnit();
                setIsMenuOpen(false);
              }}
              className="w-full justify-center py-4 text-base"
            >
              Switch to {unit === 'metric' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
