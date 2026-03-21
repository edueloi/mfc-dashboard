
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed border";
  
  const roundedStyle = "rounded-2xl";
  
  const variants = {
    primary: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 focus:ring-blue-500/10 shadow-lg shadow-blue-600/20",
    secondary: "bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100 hover:border-slate-300 focus:ring-slate-500/10 shadow-sm",
    danger: "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 focus:ring-red-500/10 shadow-lg shadow-red-600/20",
    success: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 focus:ring-emerald-500/10 shadow-lg shadow-emerald-600/20",
    outline: "bg-transparent text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 focus:ring-blue-500/10",
    ghost: "bg-transparent text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-200/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] tracking-widest uppercase",
    md: "px-6 py-2.5 text-[11px] tracking-widest uppercase",
    lg: "px-8 py-3.5 text-xs tracking-widest uppercase",
  };

  return (
    <button
      className={`${baseStyles} ${roundedStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
