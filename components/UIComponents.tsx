import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; 
  className?: string;
  disabled?: boolean;
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Input = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "",
  className = ""
}: { 
  label?: string; 
  value: string | number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  type?: string; 
  placeholder?: string;
  className?: string;
}) => (
  <div className={`flex flex-col space-y-1 w-full ${className}`}>
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-slate-600 transition-all"
    />
  </div>
);

export const Select = ({
  label,
  value,
  onChange,
  options,
  className = ""
}: {
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | number }[];
  className?: string;
}) => (
  <div className={`flex flex-col space-y-1 w-full ${className}`}>
     {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>}
     <div className="relative">
       <select
         value={value}
         onChange={onChange}
         className="w-full appearance-none bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
       >
         {options.map((opt) => (
           <option key={opt.value} value={opt.value}>
             {opt.label}
           </option>
         ))}
       </select>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
       </div>
     </div>
  </div>
);

export const SectionHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        </div>
        {action}
    </div>
);
