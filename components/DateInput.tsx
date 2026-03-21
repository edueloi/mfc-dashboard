
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  className = '',
  placeholder = 'DD/MM/AAAA',
  required = false
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative group">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-5 py-2.5 
            bg-white border border-gray-100 rounded-2xl shadow-sm
            text-sm font-bold text-gray-900 transition-all duration-200
            hover:border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500/5
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
          `}
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
          <CalendarIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default DateInput;
