
import React from 'react';
import { Search, Filter as FilterIcon, X } from 'lucide-react';
import Button from './Button';

interface FilterBarProps {
  children?: React.ReactNode;
  onSearch?: (value: string) => void;
  searchValue?: string;
  onClear?: () => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  children, 
  onSearch, 
  searchValue = '', 
  onClear,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col lg:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {onSearch && (
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
          />
          {searchValue && onClear && (
            <button 
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        {children}
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" className="h-10 px-4 border-gray-200 text-gray-500 hover:bg-gray-50">
          <FilterIcon className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
