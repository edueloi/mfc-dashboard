
import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = 'Selecione uma data...', 
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 }),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'];

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-5 py-2.5 
            bg-white border border-gray-100 rounded-2xl shadow-sm
            text-sm font-bold text-gray-900 transition-all duration-200
            hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
            ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-300' : ''}
          `}
          disabled={disabled}
        >
          <span className={!value ? 'text-gray-400' : ''}>
            {value ? format(value, 'dd/MM/yyyy') : placeholder}
          </span>
          <CalendarIcon className="w-4 h-4 text-gray-400" />
        </button>
        {value && !disabled && (
          <button 
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-[120] w-72 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-sm font-black text-gray-900 uppercase tracking-tight">
              {format(currentMonth, 'MMMM, yyyy', { locale: ptBR })}
            </span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((day, i) => (
                <div key={i} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day, i) => {
                const isSelected = value && isSameDay(day, value);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={i}
                    onClick={() => {
                      onChange(day);
                      setIsOpen(false);
                    }}
                    className={`
                      h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all
                      ${!isCurrentMonth ? 'text-gray-200' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
                      ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-lg shadow-blue-100' : ''}
                      ${isTodayDate && !isSelected ? 'border border-blue-200 text-blue-600' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 bg-gray-50/50 border-t border-gray-50">
            <button 
              onClick={() => { onChange(new Date()); setIsOpen(false); }}
              className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors px-2 py-1"
            >
              Hoje
            </button>
            <button 
              onClick={() => { onChange(null); setIsOpen(false); }}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors px-2 py-1"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
