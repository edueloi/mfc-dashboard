
import React from 'react';

interface BooleanInputProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
  description?: string;
}

const BooleanInput: React.FC<BooleanInputProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  className = '',
  description
}) => {
  return (
    <div className={`flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-200 hover:border-blue-100 ${className}`}>
      <div className="flex flex-col gap-1">
        {label && (
          <span className="text-sm font-black text-gray-900 tracking-tight leading-none">
            {label}
          </span>
        )}
        {description && (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            {description}
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20
          ${value ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${value ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      
      <span className="ml-3 text-xs font-black text-gray-500 uppercase tracking-widest min-w-[30px]">
        {value ? 'Sim' : 'Não'}
      </span>
    </div>
  );
};

export default BooleanInput;
